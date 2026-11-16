---
description: "Build a multi-node Kubernetes cluster with Kind: one control plane plus two workers, a three-control-plane HA layout, port mappings, scheduling checks and a one-shot script."
date: 2026-11-16
recommend: 4
tag:
 - Kind
tags:
 - Kubernetes
 - Docker
 - Kind
categories:
 - Open Source
---

# Kind Multi-Node Deployment

A multi-node cluster provides several Kubernetes nodes on one host, enabling validation of scheduling, cross-node networking, service discovery and high availability. Kind declares node count and roles in a cluster config. Common layouts are one control plane with two workers, or three control planes with three workers.

All nodes still run on the same host, so a multi-node cluster cannot replace a real multi-machine environment. Its value lies in reproducing node joins, taint changes and scheduling distribution at low cost.

## Core concepts

### Roles

| Role | Components | Responsibility |
| --- | --- | --- |
| `control-plane` | API server, etcd, scheduler, controller manager, kubelet, containerd | Cluster state, API requests, scheduling |
| `worker` | kubelet, containerd, kube-proxy | Run scheduled Pods |

Each role is still a Docker container. The number of node containers is the number of cluster nodes; there are no extra VMs or host agents.

### Cluster configuration

Kind uses the `kind.x-k8s.io/v1alpha4` YAML API. The core of a multi-node config is the `nodes` array:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
  - role: worker
```

Each node can also set:

- `image`: the Kubernetes version for that node;
- `kubeadmConfigPatches`: kubeadm patches, such as node labels and kubelet arguments;
- `extraPortMappings`: host port to node container port mappings;
- `extraMounts`: host directories mounted into the node container.

The `networking` field controls Pod CIDR, Service CIDR, API server address and kube-proxy mode. Keep the defaults unless there is a specific reason to change them.

### Taints and scheduling

Kind removes the control-plane `NoSchedule` taint by default, so workload Pods may land on control planes in a multi-node cluster. That is convenient locally but differs from the usual production convention.

To keep control planes management-only:

```bash
for node in $(kubectl --context kind-kind-multi get nodes \
  -l node-role.kubernetes.io/control-plane \
  -o jsonpath='{.items[*].metadata.name}'); do
  kubectl --context kind-kind-multi taint node "$node" \
    node-role.kubernetes.io/control-plane:NoSchedule --overwrite
done
```

After that, only components with the matching toleration (for example an Ingress controller) can schedule onto control planes.

### HA layout

With three control planes, each runs an etcd member. etcd needs a quorum:

- one control plane down: the remaining two still work;
- two control planes down: the cluster loses quorum and API writes are blocked.

Kind starts an extra load balancer container on the Docker network and points the kubeconfig API server address at it, so requests are distributed across surviving control planes. Users still see one kubeconfig and one context.

The HA layout is much heavier: six node containers plus a load balancer. Give Docker at least 8 GB, preferably 12 GB.

## Key mechanisms

### How nodes join

Kind does not stop after starting several containers. During creation:

1. the first control plane generates certificates, a token and join configuration;
2. additional control planes join with `kubeadm join --control-plane` and synchronise certificates;
3. workers join with a regular `kubeadm join`;
4. every node starts `kubelet` and registers with the API server;
5. once the CNI is ready, nodes become `Ready`.

Node containers communicate over the Docker bridge network Kind creates. Pod networking is a separate overlay handled by `kindnetd`.

### Port mappings apply only to the node that declares them

`extraPortMappings` maps a host port to **one node container port**. It does not apply to every node. In a multi-node config it is usually declared only on the first control plane:

```yaml
extraPortMappings:
  - containerPort: 80
    hostPort: 8080
    protocol: TCP
  - containerPort: 443
    hostPort: 8443
    protocol: TCP
```

Traffic to host `8080` enters port `80` of the control-plane container. If an Ingress controller listens on `hostPort: 80` there, it is reachable from the host at `8080`.

If `8080` or `8443` is already in use, change the host port rather than removing the mapping; without it the service is unreachable from the host.

### Multi-node and image distribution

`kind load docker-image` imports into all nodes by default. Multi-node clusters need that: otherwise a Pod scheduled to a node without the image fails to pull it.

Loading only some nodes is possible with `--nodes`, but then Pods must be pinned to those nodes with affinity or a fixed schedule.

## Boundaries and pitfalls

| Pitfall | What actually happens | Fix |
| --- | --- | --- |
| Multi-node means multi-host | All containers still run on one host | Use it for local validation only |
| Editing the config updates an existing cluster | Kind reads the config only at creation time | Delete and recreate |
| Control planes do not run workloads by default | Kind removes the taint | Add the taint back when needed |
| Every node automatically has the local image | Images require an explicit `kind load` | Load after build and use fixed tags |
| HA is as fast as a single node | Three etcd members and a load balancer cost more | Size Docker resources accordingly |

Resource contention is another common issue: multiple `kubelet`, `containerd` and system Pods start at once. When Docker memory is short, nodes boot slowly, stay `NotReady`, or the create command times out instead of printing a clear error.

## Reference

| Field | Meaning |
| --- | --- |
| `nodes[].role` | `control-plane` or `worker` |
| `nodes[].image` | Node image for that node; pin `@sha256` |
| `nodes[].kubeadmConfigPatches` | Patches for labels, kubelet arguments and more |
| `nodes[].extraPortMappings` | Host port to node container port mapping |
| `networking.podSubnet` | Pod CIDR, default `10.244.0.0/16` |
| `networking.serviceSubnet` | Service CIDR, default `10.96.0.0/12` |
| `networking.kubeProxyMode` | `iptables`, `nftables` or `ipvs` |
| `--config` | Cluster configuration file |

## Requirements

- Docker 25 or newer, daemon running;
- Kind `v0.33.0`;
- kubectl 1.37.x;
- 4 CPUs and 8 GB RAM for the standard layout; 8 CPUs and 12 GB for HA.

## Standard deployment

The standard layout consists of one control plane and two workers. It is suitable for validating Pod scheduling, cross-node networking and taint behaviour. The configuration below maps host ports `8080` and `8443` to the control plane for Ingress or NodePort access.

### Create one control plane and two workers

Save as `kind-multi.yaml`:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    image: kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5
    kubeadmConfigPatches:
      - |
        kind: InitConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            node-labels: "ingress-ready=true"
    extraPortMappings:
      - containerPort: 80
        hostPort: 8080
        protocol: TCP
      - containerPort: 443
        hostPort: 8443
        protocol: TCP
  - role: worker
    image: kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5
  - role: worker
    image: kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5
```

Create:

```bash
kind create cluster --name kind-multi --config kind-multi.yaml --wait 180s
```

When `--name` and a config file are both used, the CLI name wins. Omitting `name` from the config avoids ambiguity.

### Verify nodes

```bash
kind get clusters
kind get nodes --name kind-multi
kubectl --context kind-kind-multi get nodes -o wide
kubectl --context kind-kind-multi get pods -A -o wide
```

Expect three nodes: one control plane and two workers, all `Ready`.

### Restore the control-plane taint

```bash
for node in $(kubectl --context kind-kind-multi get nodes \
  -l node-role.kubernetes.io/control-plane \
  -o jsonpath='{.items[*].metadata.name}'); do
  kubectl --context kind-kind-multi taint node "$node" \
    node-role.kubernetes.io/control-plane:NoSchedule --overwrite
done

kubectl --context kind-kind-multi get nodes -o wide
```

Workload Pods now land only on workers. To restore Kind's default:

```bash
for node in $(kubectl --context kind-kind-multi get nodes \
  -l node-role.kubernetes.io/control-plane \
  -o jsonpath='{.items[*].metadata.name}'); do
  kubectl --context kind-kind-multi taint node "$node" \
    node-role.kubernetes.io/control-plane:NoSchedule-
done
```

### Check cross-node scheduling

```bash
kubectl --context kind-kind-multi create deployment spread-demo \
  --image=nginx:1.27-alpine --replicas=2

kubectl --context kind-kind-multi rollout status deployment/spread-demo
kubectl --context kind-kind-multi get pods -o wide
```

The scheduler does not guarantee that two replicas land on two different workers. Add `topologySpreadConstraints` or Pod anti-affinity to enforce it; the sample project page shows a complete manifest.

Clean up:

```bash
kubectl --context kind-kind-multi delete deployment spread-demo
```

## High-availability deployment

The HA layout consists of three control planes and three workers. Each control plane runs an etcd member, together forming a quorum, while the API server is reached through the load balancer container created by Kind.

### Create the HA layout

Save as `kind-ha.yaml`:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    image: kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5
    extraPortMappings:
      - containerPort: 80
        hostPort: 8080
        protocol: TCP
      - containerPort: 443
        hostPort: 8443
        protocol: TCP
  - role: control-plane
    image: kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5
  - role: control-plane
    image: kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5
  - role: worker
    image: kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5
  - role: worker
    image: kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5
  - role: worker
    image: kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5
```

Create:

```bash
kind create cluster --name kind-ha --config kind-ha.yaml --wait 240s
```

### Verify high availability

Inspect etcd members:

```bash
kubectl --context kind-kind-ha -n kube-system get pods -l component=etcd -o wide
kubectl --context kind-kind-ha get nodes
```

Do not test HA by deleting a control-plane container unless you know exactly what you are doing. If you do test failover, first confirm kubeconfig points at the load balancer address, then stop one control-plane container and observe whether the API remains available.

## One-shot script

[`kind-multi-node.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/scripts/kind-multi-node.sh) generates the config, creates the cluster, waits for readiness and optionally applies the taint:

```bash
cd zq-xu.github.io/docs/public/demos/kind

# default: 1 control-plane + 2 workers
./scripts/kind-multi-node.sh

# HA: 3 control-planes + 3 workers
HA=true ./scripts/kind-multi-node.sh
```

The script:

1. checks Docker, kind and kubectl;
2. writes a temporary cluster config and removes it on exit;
3. creates the cluster when absent, otherwise reuses it;
4. waits for every node to become Ready;
5. taints control planes by default; set `TAINT_CONTROL_PLANE=false` to skip;
6. prints nodes and system Pod placement.

Override defaults:

```bash
CLUSTER_NAME=kind-dev HA=true ./scripts/kind-multi-node.sh
```

The script does not modify an existing cluster. To change the layout, delete the current cluster and recreate it.

## Clean up

```bash
kind delete cluster --name kind-multi
kind delete cluster --name kind-ha
```

## Troubleshooting

| Symptom | Usual cause | Action |
| --- | --- | --- |
| Only one node is Ready | Other nodes failed to join or the CNI is not ready | `kubectl describe node`, `kind export logs` |
| Create times out | Docker CPU/memory shortage or host port conflict | Raise resources; check `8080`/`8443` |
| Control planes still run workloads | The taint was not restored | Run the commands in “Restore the control-plane taint”. |
| HA cluster starts slowly | Six containers and etcd synchronisation | Increase timeout and Docker resources |
| YAML changes do not apply | Kind does not hot-reload existing clusters | Delete and recreate |

Export logs:

```bash
kind export logs --name kind-multi ./kind-multi-logs
```
