---
description: "Build a multi-node Kubernetes cluster with Kind: prerequisites and installation, a one-control-plane-plus-two-workers layout, a three-control-plane HA layout, taints and scheduling checks, data persistence and a one-shot script."
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

A multi-node cluster provides several Kubernetes nodes on one host and is used to verify scheduling, cross-node networking, service discovery and high availability. Kind declares the node count and roles in the cluster configuration; the common layouts are one control plane with two workers, or three control planes with three workers.

All nodes still run on the same host, so a multi-node cluster does not replace a real multi-machine environment. Its value is reproducing node joins, taint changes and scheduling spread at low cost.

The steps below cover the standard layout and the HA layout in full: the standard layout uses the cluster name `kind-multi` with context `kind-kind-multi`, the HA layout uses `kind-ha` with `kind-kind-ha`. Cluster architecture and the creation flow are covered in [Kind Overview](./introduction).

## Cluster shape

### Roles

| Role | Components running | Purpose |
| --- | --- | --- |
| `control-plane` | API server, etcd, scheduler, controller manager, kubelet, containerd | Manages cluster state, serves API requests, schedules Pods |
| `worker` | kubelet, containerd, kube-proxy | Runs scheduled Pods |

Each role is still one Docker container. The number of node containers is the number of nodes; there is no extra "virtual machine" or host agent.

### How nodes join the cluster

Creating a multi-node cluster is not just starting several containers:

1. The first control-plane generates the cluster certificates, token and join configuration;
2. the other control planes join with `kubeadm join --control-plane` and sync the certificates;
3. workers join with a plain `kubeadm join`;
4. every node starts `kubelet` and registers with the API server;
5. once the CNI is ready, the node turns `Ready`.

Node containers talk to each other over the Docker bridge network that Kind creates; the Pod network is a separate overlay handled by `kindnetd`.

### Taints and scheduling

Kind removes the control-plane `NoSchedule` taint by default, so business Pods may land on control-plane nodes in a multi-node cluster. This is convenient for local verification but differs from the usual production convention.

To mimic "control planes only manage and never run workloads", restore the taint on every control-plane with [`control-plane-taint.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/multiple-node/scripts/control-plane-taint.sh):

```bash
cd zq-xu.github.io/docs/public/demos/kind
./installation/multiple-node/scripts/control-plane-taint.sh apply
```

After the taint is restored, only system components with a matching toleration (an Ingress controller, for example) can still be scheduled onto control planes.

### The HA layout

With 3 control planes each runs its own etcd member. etcd needs a majority to accept writes, so:

- with 1 control-plane down the remaining 2 still work;
- with 2 control planes down the cluster loses its majority and API writes stall.

Kind starts an extra load-balancer container on the Docker network, points the API server address in the kubeconfig at it, and it forwards requests to the surviving control planes. For you it is still one kubeconfig and one context.

The HA layout costs considerably more resources: six node containers plus one load-balancer container. Allocate at least 8 GB of memory to Docker, or 12 GB when possible.

## Configuration notes

### Port mappings apply only to the node that declares them

`extraPortMappings` maps a host port onto one node container port and is never applied to all nodes. Multi-node configurations usually declare it only on the first control plane:

```yaml
extraPortMappings:
  - containerPort: 80
    hostPort: 8080
    protocol: TCP
  - containerPort: 443
    hostPort: 8443
    protocol: TCP
```

This means traffic to host port `8080` reaches port `80` of the control-plane container. If an Ingress controller listens on `hostPort: 80` on the control plane, it becomes reachable at host port `8080`.

If host ports `8080` or `8443` are already taken, change them to other ports instead of deleting the mappings; without them those services are unreachable from the host.

### Image distribution

`kind load docker-image` imports the image into every node by default. Multi-node clusters depend on this behaviour: otherwise a Pod scheduled onto a node without the image fails to pull it.

Use `--nodes` to import into a subset only when node affinity or a fixed scheduler placement guarantees the Pod lands on a node that has the image.

### Node-local storage

Every node runs its own `local-path-provisioner`, and the PersistentVolumes it creates live only on that node under `/var/local-path-provisioner` inside the node container. Deleting the node container deletes that data.

Mount the path per node with `extraMounts` so PV data lands on the host. The multi-node scenario uses `${HOME}/.kind-multiple-node/<cluster-name>` as the root and one subdirectory per node, for example `kind-multi/control-plane` and `kind-multi/worker-1`.

Storage is never shared between nodes. After a Pod moves to another node do not assume it can read the old node's data; use node affinity, a StatefulSet or external shared storage when the data must stay in place.

## Prerequisites

| Item | Requirement |
| --- | --- |
| Operating system | macOS or Linux; on Windows use Docker Desktop with WSL2 and run the commands inside WSL2 |
| Docker | 25 or newer, daemon running |
| Kind | `v0.33.0` |
| kubectl | `1.37.x` |
| Resources | Standard layout: 4 CPU and 8 GB RAM recommended; HA layout: 8 CPU and 12 GB RAM recommended |

## Install the dependencies

Kind ships no container runtime: Docker provides the node containers, Kind creates the cluster, and kubectl accesses it. A multi-node cluster starts several node containers at once, so confirm Docker works before creating anything. Version numbers match the table above.

### macOS

```bash
brew install --cask docker-desktop
open -a Docker

# wait for Docker Desktop to finish its first start and authorization
brew install kind kubectl
```

Confirm Docker is ready:

```bash
docker info
```

### Linux

Install Docker Engine:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

`usermod` changes group membership, which takes effect after you log in again; run `newgrp docker` in the current terminal to enter a new shell immediately.

Install Kind:

```bash
KIND_VERSION=v0.33.0
ARCH=$(uname -m | sed 's/x86_64/amd64/; s/aarch64/arm64/')
curl -Lo kind "https://kind.sigs.k8s.io/dl/${KIND_VERSION}/kind-linux-${ARCH}"
chmod +x kind
sudo mv kind /usr/local/bin/kind
```

Install kubectl:

```bash
KUBECTL_VERSION=v1.37.0
ARCH=$(uname -m | sed 's/x86_64/amd64/; s/aarch64/arm64/')
KUBECTL_BASE="https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/${ARCH}"
curl -Lo kubectl "${KUBECTL_BASE}/kubectl"
curl -Lo kubectl.sha256 "${KUBECTL_BASE}/kubectl.sha256"
echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
chmod +x kubectl
sudo mv kubectl /usr/local/bin/kubectl
```

### Verify the installation

All three commands print a version:

```bash
kind version
docker info
kubectl version --client
```

## Standard deployment: 1 control plane + 2 workers

The standard layout suits verifying Pod scheduling, cross-node networking and taint behaviour, and it maps host ports `8080` and `8443` onto the control plane for Ingress or NodePort use.

### Render the configuration and create the cluster

The template is [`installation/multiple-node/yaml/kind-multi.yaml`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/multiple-node/yaml/kind-multi.yaml). The [`render-config.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/multiple-node/yaml/render-config.sh) next to it uses that template by default, takes `${HOME}/.kind-multiple-node/kind-multi` as the data root and creates one subdirectory for `control-plane`, `worker-1` and `worker-2`.

Render the configuration (writes `installation/multiple-node/yaml/kind-multi.local.yaml`, which is not committed):

```bash
cd zq-xu.github.io/docs/public/demos/kind
./installation/multiple-node/yaml/render-config.sh
```

Create the cluster:

```bash
kind create cluster \
  --name kind-multi \
  --config installation/multiple-node/yaml/kind-multi.local.yaml \
  --wait 180s
```

When `--name` is passed together with a configuration file, `--name` wins; leaving `name` out of the file avoids ambiguity.

### Verify the nodes

```bash
kind get clusters
kind get nodes --name kind-multi

# wait for every node to report Ready
kubectl --context kind-kind-multi wait \
  --for=condition=Ready nodes --all --timeout=300s

kubectl --context kind-kind-multi get nodes -o wide
kubectl --context kind-kind-multi get pods -A -o wide
```

Expect three nodes — one control plane and two workers — all `Ready`.

### Restore the control-plane taint

Restore the taint on every control-plane of `kind-multi`:

```bash
cd zq-xu.github.io/docs/public/demos/kind
./installation/multiple-node/scripts/control-plane-taint.sh apply
```

Confirm the taint took effect:

```bash
kubectl --context kind-kind-multi describe node kind-multi-control-plane | grep -A2 Taints
```

Business Pods now schedule onto workers only. To restore Kind's default behaviour, remove the taint:

```bash
cd zq-xu.github.io/docs/public/demos/kind
./installation/multiple-node/scripts/control-plane-taint.sh remove
```

For an HA cluster, select the context through `CONTEXT`:

```bash
cd zq-xu.github.io/docs/public/demos/kind
CONTEXT=kind-kind-ha ./installation/multiple-node/scripts/control-plane-taint.sh apply
```

### Check cross-node scheduling

Use a minimal Deployment to see Pods land on different workers:

```bash
kubectl --context kind-kind-multi create deployment spread-demo \
  --image=nginx:1.27-alpine --replicas=2

kubectl --context kind-kind-multi rollout status deployment/spread-demo
kubectl --context kind-kind-multi get pods -o wide
```

The scheduler does not guarantee that the two replicas spread across two workers; add `topologySpreadConstraints` or Pod anti-affinity to force it, see [Deploying a Simple Project](./deploy-simple-app) for the full snippet.

Clean up afterwards:

```bash
kubectl --context kind-kind-multi delete deployment spread-demo
```

## High-availability deployment: 3 control planes + 3 workers

The HA layout runs three control planes and three workers. Each control plane runs an etcd member and they form a majority, while the API server is exposed through Kind's load-balancer container.

### Render the configuration and create the cluster

The template is [`installation/multiple-node/yaml/kind-ha.yaml`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/multiple-node/yaml/kind-ha.yaml). The data root is `${HOME}/.kind-multiple-node/kind-ha`, with one subdirectory for each of the three control planes and three workers.

Render the configuration (writes `installation/multiple-node/yaml/kind-ha.local.yaml`):

```bash
cd zq-xu.github.io/docs/public/demos/kind
LAYOUT=ha ./installation/multiple-node/yaml/render-config.sh
```

Create the cluster:

```bash
kind create cluster \
  --name kind-ha \
  --config installation/multiple-node/yaml/kind-ha.local.yaml \
  --wait 240s
```

### Verify high availability

Confirm that all six nodes are ready and that `kube-system` runs three etcd replicas:

```bash
kubectl --context kind-kind-ha get nodes
kubectl --context kind-kind-ha -n kube-system get pods -l component=etcd -o wide
```

To verify failover, first confirm the kubeconfig points at the load-balancer address, then stop one control-plane container and watch whether the API stays available. Do not treat "delete a control-plane container" as a routine test unless you know exactly what you are doing.

## Data persistence

Both layouts mount `/var/local-path-provisioner` per node onto a dedicated host directory, so PersistentVolumes created by the default StorageClass `standard` land on the host. The standard cluster uses `${HOME}/.kind-multiple-node/kind-multi` as the root, the HA cluster `${HOME}/.kind-multiple-node/kind-ha`; every node uses its own subdirectory.

The directories are independent, and PVs stay bound to their node: a Pod scheduled elsewhere does not inherit the old node's data. Use a StatefulSet, node affinity or external shared storage when the data must stay in place.

The commands below use `kind-multi`; for the HA cluster swap the cluster name and context for `kind-ha` and `kind-kind-ha`.

Create a PVC and a writing test Pod. The manifest is [`installation/multiple-node/yaml/pvc-check.yaml`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/multiple-node/yaml/pvc-check.yaml):

```bash
kubectl --context kind-kind-multi apply \
  -f zq-xu.github.io/docs/public/demos/kind/installation/multiple-node/yaml/pvc-check.yaml
```

Confirm the data was written:

```bash
kubectl --context kind-kind-multi wait \
  --for=condition=Ready pod/host-data-check --timeout=120s

kubectl --context kind-kind-multi exec host-data-check -- cat /data/check.log
find "${HOME}/.kind-multiple-node/kind-multi" -maxdepth 3 -type f -name check.log
```

Stop and start every node container, then read the same file. [`restart-nodes.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/multiple-node/scripts/restart-nodes.sh) lists all node containers of the cluster, stops and starts them in turn, and waits for the nodes:

```bash
cd zq-xu.github.io/docs/public/demos/kind
./installation/multiple-node/scripts/restart-nodes.sh
```

Wait for the business Pod to become ready again and read the data:

```bash
kubectl --context kind-kind-multi wait \
  --for=condition=Ready pod/host-data-check --timeout=300s
kubectl --context kind-kind-multi exec host-data-check -- cat /data/check.log
```

`kind delete cluster` removes the node containers, etcd and the PV/PVC objects; files under the host directory remain, but a new cluster does not pick up old PVCs. Stopping and starting only the node containers keeps both the cluster objects and the PVC.

Do not delete the PVC when the test finishes unless you no longer need the data; the default StorageClass uses the `Delete` reclaim policy.

## One-shot script

[`kind-multi-node.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/multiple-node/scripts/kind-multi-node.sh) renders the configuration, creates the cluster, applies the taint when asked and waits for readiness:

```bash
cd zq-xu.github.io/docs/public/demos/kind

# default: 1 control-plane + 2 workers
./installation/multiple-node/scripts/kind-multi-node.sh

# HA: 3 control-planes + 3 workers
HA=true ./installation/multiple-node/scripts/kind-multi-node.sh
```

The script runs these steps in order:

1. check Docker, kind and kubectl, and exit with an error if one is missing;
2. create the host data directories and render a configuration with `extraMounts` in a temporary file, deleted on exit;
3. create the cluster if it does not exist, otherwise reuse it;
4. wait until every node is `Ready`;
5. restore the `NoSchedule` taint on control planes by default, disable with `TAINT_CONTROL_PLANE=false`;
6. print the distribution of nodes and system Pods.

By default one `${HOME}/.kind-multiple-node/<cluster>/<node>` data directory is created per node. Environment variables override the defaults:

```bash
CLUSTER_NAME=kind-dev \
DATA_DIR="${HOME}/.kind-multiple-node/kind-dev" \
HA=true \
./installation/multiple-node/scripts/kind-multi-node.sh
```

The script never reconfigures an existing cluster. To change the layout, delete the cluster and create it again.

## Clean up

```bash
kind delete cluster --name kind-multi
kind delete cluster --name kind-ha
```

Deleting removes the node containers, the Docker network, etcd and the matching kubeconfig contexts. Files under the host data directories are not removed automatically, but a new cluster does not pick up old PVCs.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Only 1 node is `Ready` | Other nodes failed to join, or the CNI is not ready | `kubectl describe node`, then `kind export logs` |
| Creation times out | Not enough Docker memory/CPU, or a host port conflict | Raise Docker resources and check the usage of `8080`/`8443` |
| Control planes still run workloads | The `NoSchedule` taint was never restored | Run `control-plane-taint.sh apply` |
| The HA cluster starts slowly | Six node containers starting at once, etcd needs to sync | Increase the wait timeout and Docker resources |
| Edits to the YAML have no effect | Kind only reads the configuration at creation time | Delete and recreate the cluster |

Export the logs:

```bash
kind export logs --name kind-multi ./kind-multi-logs
```

## Common pitfalls

| Pitfall | Actual behaviour | What to do |
| --- | --- | --- |
| Multi-node means multiple machines | Every node container still runs on one host | Use it for local verification only, never production |
| Editing the configuration updates a live cluster | Kind reads the configuration only at creation | Delete the cluster and recreate it |
| Control planes do not run workloads by default | Kind removes the taint by default | Restore the taint when needed |
| Every node has the local image automatically | `kind load` must be run explicitly | Load after building and use a fixed tag |
| The HA layout is as fast as a single node | Three etcd members plus the load balancer cost more | Choose as needed and allocate enough memory |

Another frequent problem is resource contention: a multi-node cluster starts several `kubelet`, `containerd` and system Pods at once. When Docker Desktop lacks memory this shows up as slow node startup, `NotReady` or a creation timeout rather than a clear error message.

## Configuration reference

| Field / flag | Meaning |
| --- | --- |
| `nodes[].role` | `control-plane` or `worker` |
| `nodes[].image` | Node image for that node; use the same tag as the rest of the cluster |
| `nodes[].kubeadmConfigPatches` | Patches passed to kubeadm for labels, kubelet parameters and more |
| `nodes[].extraPortMappings` | Host port to node container port mappings |
| `networking.podSubnet` | Pod CIDR, defaults to `10.244.0.0/16` |
| `networking.serviceSubnet` | Service CIDR, defaults to `10.96.0.0/12` |
| `networking.kubeProxyMode` | `iptables`, `nftables` or `ipvs` |
| `--config` | Path to the cluster configuration file |




