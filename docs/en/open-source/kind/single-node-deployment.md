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

The Kubernetes version comes from the node image, not from the kubectl binary on the host. This series uses:

```text
kindest/node:v1.37.0
```

`v1.37.0` is the node image tag and maps to Kubernetes v1.37.0. Reusing the same tag keeps the node version stable.

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

### Persistent storage

Kind installs `local-path-provisioner` and creates the `standard` StorageClass. Without extra configuration, PersistentVolume data is written to `/var/local-path-provisioner` inside the node container and disappears when that container is removed.

Mount this path to a host directory with `extraMounts` in the cluster configuration, and PV data is written to the host instead. A single-node cluster can use `${HOME}/.kind-single-node` directly; files on the host survive a node container stop and start.

This remains node-local storage: PVCs are bound to the node, and `kind delete cluster` removes the node container and the PV/PVC objects. Host files remain, but a new cluster does not automatically recognise the old PVC.

## Boundaries and pitfalls

| Pitfall | What actually happens | Fix |
| --- | --- | --- |
| A single node can test HA | One etcd member and one control plane; no failover | Use three control planes for HA tests |
| A successful create means the node is usable | `--wait` only covers the control plane | Also run `kubectl wait --for=condition=Ready nodes` |
| Local images are visible to Pods | Each node has its own containerd | Run `kind load docker-image` first |
| Data survives cluster deletion | Node containers are removed and in-container data disappears with them | Mount the storage path to a host directory when creating the cluster |
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

### Prerequisites

- macOS or Linux;
- Docker 25 or newer, daemon running;
- Kind `v0.33.0`;
- kubectl 1.37.x;
- at least 2 CPUs and 4 GB RAM for Docker; 8 GB recommended.

On Windows, use Docker Desktop with WSL2 and run the commands inside WSL2.

### Install the dependencies

Kind does not provide a container runtime. Docker must be installed and running before Kind can create a cluster. Kind creates the cluster, while kubectl provides access to it; install them separately.

#### macOS

```bash
brew install --cask docker-desktop
open -a Docker

# wait for Docker Desktop to finish its first start and authorization
brew install kind kubectl
```

Confirm that Docker is ready:

```bash
docker info
```

#### Linux

Install Docker Engine:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

`usermod` changes group membership. Sign out and back in for it to take effect, or run `newgrp docker` in the current terminal.

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

Check:

```bash
kind version
docker info
kubectl version --client
```

### Create the cluster

The single-node configuration is stored in [`installation/single-node/yaml/kind-single.yaml`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/single-node/yaml/kind-single.yaml). [`render-config.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/single-node/yaml/render-config.sh) in the same directory replaces `${NODE_IMAGE}` and `${DATA_DIR}`; the node image defaults to `kindest/node:v1.37.0` and the data directory to `${HOME}/.kind-single-node`.

Render the configuration:

```bash
cd zq-xu.github.io/docs/public/demos/kind
./installation/single-node/yaml/render-config.sh
```

This creates `${HOME}/.kind-single-node` and writes `installation/single-node/yaml/kind-single.local.yaml`.

To use another data directory:

```bash
cd zq-xu.github.io/docs/public/demos/kind
DATA_DIR="${HOME}/.kind-single-node-test" \
  ./installation/single-node/yaml/render-config.sh
```

Create the cluster:

```bash
kind create cluster \
  --name kind-single \
  --config installation/single-node/yaml/kind-single.local.yaml \
  --wait 120s
```

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

### Data persistence

The default StorageClass `standard` writes PVC data to `/var/local-path-provisioner` inside the node container. The configuration above mounts that path at `${HOME}/.kind-single-node` on the host, so PVC data is stored in that host directory.

Create a PVC and a Pod that writes to it. The manifest is [`installation/single-node/yaml/pvc-check.yaml`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/single-node/yaml/pvc-check.yaml):

```bash
kubectl --context kind-kind-single apply \
  -f zq-xu.github.io/docs/public/demos/kind/installation/single-node/yaml/pvc-check.yaml
```

Confirm that the file exists:

```bash
kubectl --context kind-kind-single wait \
  --for=condition=Ready pod/host-data-check --timeout=120s

kubectl --context kind-kind-single exec host-data-check -- cat /data/check.log
find "${HOME}/.kind-single-node" -maxdepth 2 -type f -name check.log
```

Stop and start the node container, then read the same file again. [`restart-node.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/single-node/scripts/restart-node.sh) resolves the container from the cluster name and waits for the node to become Ready:

```bash
cd zq-xu.github.io/docs/public/demos/kind
./installation/single-node/scripts/restart-node.sh
```

Wait for the Pod and read the data:

```bash
kubectl --context kind-kind-single wait \
  --for=condition=Ready pod/host-data-check --timeout=180s
kubectl --context kind-kind-single exec host-data-check -- cat /data/check.log
```

`kind delete cluster` removes the node container, etcd and the PV/PVC objects. Files under `${HOME}/.kind-single-node` remain on the host, but a new cluster does not automatically recognise the old PVC. Stopping and starting the node container keeps both the cluster objects and the PVC.

Do not delete the PVC unless the data is no longer needed; the default StorageClass uses the `Delete` reclaim policy.

### One-shot script

[`kind-single-node.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/single-node/scripts/kind-single-node.sh) runs the same steps:

```bash
cd zq-xu.github.io/docs/public/demos/kind
./installation/single-node/scripts/kind-single-node.sh
```

The script:

1. checks Docker and kubectl, and exits if Docker is not running;
2. installs `kind` v0.33.0 into `~/.local/bin` when missing;
3. generates a cluster config with a host data directory, and creates `kind-single` if it does not exist;
4. waits for every node to become Ready;
5. prints nodes, StorageClasses and system Pods.

The default data directory is `${HOME}/.kind-single-node`. It is idempotent: re-running does not delete an existing cluster. To recreate:

```bash
kind delete cluster --name kind-single
```

Override defaults with environment variables:

```bash
CLUSTER_NAME=kind-dev \
DATA_DIR="${HOME}/.kind-single-node-test" \
NODE_IMAGE=kindest/node:v1.36.4 \
./installation/single-node/scripts/kind-single-node.sh
```

### Clean up

```bash
kind delete cluster --name kind-single
```

This removes node containers, the Docker network, etcd and the kubeconfig context. Files under `${HOME}/.kind-single-node` are not deleted automatically, but a new cluster does not automatically recognise the old PVC or cluster objects.

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
