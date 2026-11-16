---
description: "Create and verify a single-node Kind Kubernetes cluster from scratch: install Kind, pin the node image, create the cluster, inspect kubeconfig and default components, with a one-shot script."
date: 2026-11-16
recommend: 3
tag:
 - Kind
tags:
 - Kubernetes
 - Docker
 - Kind
categories:
 - Open Source
---

# Kind Single-Node Deployment

A single-node Kind cluster provides a complete Kubernetes environment on one host. One control-plane node carries both cluster management and workload responsibilities, making it suitable for local development, manifest debugging and CI smoke tests.

A single node offers no high availability and cannot model multi-machine failures. Its value lies in validating, at low cost, that the cluster starts correctly, core components become ready, and workloads behave as expected.

## Core concepts

### Single node does not mean a stripped-down cluster

A single-node cluster is still a complete Kubernetes cluster. One node carries both control-plane and worker responsibilities: the API server, etcd, scheduler, controller manager, kubelet, containerd and kube-proxy all run in the same node container.

It can validate most manifests and controllers, but it cannot validate cross-node scheduling, node failover or real multi-machine networking.

### Role and taints

Kind creates one `control-plane` node and removes its `NoSchedule` taint by default, so workload Pods can schedule there. Without that, a single-node cluster would have nowhere to run workloads.

The same default means scheduling results on a single node do not represent a production cluster that keeps workloads off control planes.

### The node image determines the Kubernetes version

The Kubernetes version comes from the node image, not from the kubectl binary on the host. The pinned image is:

```text
kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5
```

Pinning the `@sha256` digest guarantees the image Kind built for that release. A tag alone usually works, but CI should pin the digest.

### kubeconfig and context

Kind writes access configuration to `~/.kube/config` with a context named `kind-<cluster>`. The default cluster name is `kind`, so without `--name` the context is `kind-kind`.

When several clusters exist, pass `--context` explicitly:

```bash
kubectl --context kind-kind-single get nodes
```

## Key mechanisms

### Creation

`kind create cluster` does more than it prints:

- pulls or reuses the node image;
- creates the Docker network and node containers;
- prepares certificates, kubeconfig, mounts and preloaded images inside the container;
- starts `systemd` and runs `kubeadm init`;
- installs the CNI and default StorageClass;
- merges kubeconfig into the host configuration.

`--wait 120s` blocks until the control plane is ready; it does not mean every node is Ready. Wait for node readiness separately.

### Default components

After startup, the `kube-system` namespace usually contains:

| Component | Role |
| --- | --- |
| `kube-apiserver` | Cluster API entry point |
| `etcd` | Cluster state store |
| `kube-scheduler` | Pod scheduling |
| `kube-controller-manager` | Controller loops |
| `coredns` | Cluster DNS |
| `kindnet` | Default CNI |
| `kube-proxy` | Service forwarding |
| `local-path-provisioner` | Backend for the default `standard` StorageClass |

Exact components can vary by Kind release; use `kubectl get pods -A` as the source of truth.

### Ports and networking

Kind maps the API server port to the host, and kubeconfig records a host-reachable address. Workload ports are not exposed automatically:

- use `kubectl port-forward` for ad-hoc access;
- declare `extraPortMappings` for fixed host ports;
- on macOS and Windows, node container IPs are not directly reachable from the host.

## Boundaries and pitfalls

| Pitfall | What actually happens | Fix |
| --- | --- | --- |
| A single node can test HA | One etcd member and one control plane; no failover | Use three control planes for HA tests |
| A successful create means the node is usable | `--wait` only covers the control plane | Also run `kubectl wait --for=condition=Ready nodes` |
| Local images are visible to Pods | Each node has its own containerd | Run `kind load docker-image` first |
| Data survives cluster deletion | Node containers and local volumes are removed | Mount a host path when data matters |
| An old Kind binary runs any new image | Kind and node images have compatibility limits | Follow the release notes |

Two resource boundaries also matter:

- The Docker Desktop memory limit is the cluster limit; below 4 GB even a single node can fail to start.
- Containers share the host kernel and `inotify` limits; increase `fs.inotify.max_user_watches` when many nodes or file watchers are involved.

## Reference

| Flag / command | Meaning |
| --- | --- |
| `--name` | Cluster name; also the container prefix and kubectl context |
| `--image` | Node image; determines Kubernetes version and architecture |
| `--wait` | Timeout for control-plane readiness; units are required |
| `--config` | YAML configuration for nodes, networking and port mappings |
| `kind get clusters` | List local Kind clusters |
| `kind export kubeconfig` | Re-export kubeconfig for a cluster |
| `kind delete cluster` | Remove containers, network and kubeconfig entry |
| `kind export logs` | Export node logs for troubleshooting |

## Practice

### Requirements

Verified with:

- macOS or Linux;
- Docker 25 or newer, daemon running;
- kubectl 1.37.x;
- at least 2 CPUs and 4 GB RAM for Docker; 8 GB recommended.

On Windows, use Docker Desktop with WSL2 and run the commands inside WSL2.

### Install Kind and kubectl

macOS:

```bash
brew install kind kubectl
```

Linux or a fixed version:

```bash
# KIND_VERSION: the release to install, for example v0.33.0
KIND_VERSION=v0.33.0
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m | sed 's/x86_64/amd64/; s/aarch64/arm64/')
curl -Lo kind "https://kind.sigs.k8s.io/dl/${KIND_VERSION}/kind-${OS}-${ARCH}"
chmod +x kind
sudo mv kind /usr/local/bin/kind
```

Check:

```bash
kind version
docker info
kubectl version --client
```

### Create the cluster

```bash
kind create cluster \
  --name kind-single \
  --image kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5 \
  --wait 120s
```

The first run pulls the node image; duration depends on the network.

### Verify

```bash
# list all local kind clusters
kind get clusters

# check the API server endpoint
kubectl --context kind-kind-single cluster-info

# check node status and container IP
kubectl --context kind-kind-single get nodes -o wide

# check system components
kubectl --context kind-kind-single get pods -A

# check the default storage class
kubectl --context kind-kind-single get storageclass
```

Expected:

- `kind get clusters` prints `kind-single`;
- the node is `Ready`;
- core Pods in `kube-system` are `Running`;
- the StorageClass list contains `standard (default)`.

Optional DNS smoke test:

```bash
kubectl --context kind-kind-single run dns-test \
  --image=busybox:1.36 --restart=Never --rm -i --command \
  -- nslookup kubernetes.default
```

### One-shot script

[`kind-single-node.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/scripts/kind-single-node.sh) runs the same steps:

```bash
cd zq-xu.github.io/docs/public/demos/kind
./scripts/kind-single-node.sh
```

The script:

1. checks Docker and kubectl, and exits if Docker is not running;
2. installs `kind` v0.33.0 into `~/.local/bin` when missing;
3. creates `kind-single` if it does not exist, otherwise reuses it;
4. waits for every node to become Ready;
5. prints nodes, StorageClasses and system Pods.

It is idempotent: re-running does not delete an existing cluster. To recreate:

```bash
kind delete cluster --name kind-single
```

Override defaults with environment variables:

```bash
CLUSTER_NAME=kind-dev \
NODE_IMAGE=kindest/node:v1.36.4@sha256:099e049362a1526b2db71494e1947aae99bd16290d7c895f2b7ea312e3cbfaed \
./scripts/kind-single-node.sh
```

### Clean up

```bash
kind delete cluster --name kind-single
```

This removes node containers, the Docker network and the kubeconfig context. Cluster data is not preserved.

### Troubleshooting

| Symptom | Usual cause | Action |
| --- | --- | --- |
| `Cannot connect to the Docker daemon` | Docker is stopped or the user lacks permission | Start Docker Desktop / `dockerd`; confirm `docker info` |
| Node image pull fails | The network cannot reach Docker Hub | Pull the image manually or configure a mirror |
| `timed out waiting for control plane` | Not enough Docker memory, low `inotify` limits | Raise Docker memory to 8 GB; adjust `fs.inotify.*` |
| Node stays `NotReady` | CNI not ready or node boot failed | `kubectl describe node`, then `kind export logs --name kind-single` |
| `bind: address already in use` | Host port used by another cluster or process | Delete the old cluster or change `hostPort` |
| kubectl cannot find the context | kubeconfig was not merged or `KUBECONFIG` is wrong | `kind export kubeconfig --name kind-single` |

Keep a failed cluster for inspection:

```bash
kind create cluster --name kind-debug --retain --wait 120s
kind export logs --name kind-debug ./kind-logs
```
