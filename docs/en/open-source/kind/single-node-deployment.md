---
description: "Create and verify a single-node Kind Kubernetes cluster from scratch: install the dependencies, render the config, create the cluster, verify the core components, access it, persist data, with a one-shot script and troubleshooting."
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

A Kind single-node cluster provides a complete Kubernetes environment on one host. A single control-plane node carries both cluster management and workload scheduling, which suits local development, manifest debugging and CI smoke tests.

A single node offers no high availability and cannot simulate machine failures. Its value is verifying at low cost that a cluster starts, that the core components become ready, and that workloads behave as expected.

The steps below run from dependency installation to cluster cleanup. Every command uses the cluster name `kind-single` and the kubectl context `kind-kind-single`. Cluster architecture and the creation flow are covered in [Kind Overview](./introduction).

## The shape of a single-node cluster

### A single node is still a complete cluster

A single-node cluster is a complete Kubernetes cluster: one node plays both control-plane and worker. The API server, etcd, scheduler, controller manager, kubelet, containerd and kube-proxy all run inside the same node container.

So a single node can verify most manifests and controller behaviour, but not cross-node scheduling, node failover or real multi-host networking.

### Role and taints

A Kind single-node cluster has one `control-plane` node. Kind removes the control-plane `NoSchedule` taint by default so that business Pods can schedule onto this node; otherwise no node would accept workloads.

This default also means the scheduling you observe on a single node does not represent production clusters, where control-plane nodes usually do not run workloads.

### The node image determines the Kubernetes version

The Kubernetes version is decided by the node image, not by the kubectl on your host. This series uses:

```text
kindest/node:v1.37.0
```

`v1.37.0` is the node image tag and maps to Kubernetes v1.37.0. Keep the same tag when creating the cluster and the node version stays fixed.

### kubeconfig and context

Kind writes the cluster credentials into `~/.kube/config` under the context `kind-<cluster-name>`. The default cluster name is `kind`, so without `--name` the context is `kind-kind`.

With several clusters present, always pass `--context`:

```bash
kubectl --context kind-kind-single get nodes
```

## Prerequisites

| Item | Requirement |
| --- | --- |
| Operating system | macOS or Linux; on Windows use Docker Desktop with WSL2 and run the commands inside WSL2 |
| Docker | 25 or newer, daemon running |
| Kind | `v0.33.0` |
| kubectl | `1.37.x` |
| Resources | At least 2 CPU and 4 GB RAM for Docker; 8 GB recommended |

## Install the dependencies

Kind ships no container runtime: Docker provides the node containers, Kind creates the cluster, and kubectl accesses it, so all three must be installed separately. Version numbers match the table above.

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

All three commands print a version, and the Docker desktop icon reports a running state:

```bash
kind version
docker info
kubectl version --client
```

## Create the cluster

The single-node template lives at [`installation/single-node/yaml/kind-single.yaml`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/single-node/yaml/kind-single.yaml). The `${NODE_IMAGE}` and `${DATA_DIR}` placeholders are replaced by [`render-config.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/single-node/yaml/render-config.sh) in the same directory; the node image defaults to `kindest/node:v1.37.0` and the data directory to `${HOME}/.kind-single-node`.

Render the configuration (the script creates the data directory and writes `installation/single-node/yaml/kind-single.local.yaml`, which is not committed):

```bash
cd zq-xu.github.io/docs/public/demos/kind
./installation/single-node/yaml/render-config.sh
```

To use a different data directory, override the environment variable:

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

`--wait 120s` blocks until the control plane is ready so that scripts do not continue too early. It does not mean the node is `Ready`; node status must be awaited separately in the next step.

## Verify the cluster

Check in order: the cluster exists, the API is reachable, the node is ready, the system components are running, and the default storage class exists:

```bash
# list all local kind clusters
kind get clusters

# check the API server endpoint
kubectl --context kind-kind-single cluster-info

# wait for the node to report Ready
kubectl --context kind-kind-single wait \
  --for=condition=Ready nodes --all --timeout=180s

# check node status and container IP
kubectl --context kind-kind-single get nodes -o wide

# check system components
kubectl --context kind-kind-single get pods -A

# check the default storage class
kubectl --context kind-kind-single get storageclass
```

Expected results:

- `kind get clusters` prints `kind-single`;
- the node reports `Ready`;
- the core Pods under `kube-system` are `Running`;
- the StorageClass list contains `standard (default)`.

A freshly created single-node cluster usually contains these components under `kube-system`:

| Component | Purpose |
| --- | --- |
| `kube-apiserver` | cluster API entry point |
| `etcd` | cluster state store |
| `kube-scheduler` | Pod scheduling |
| `kube-controller-manager` | controller loops |
| `coredns` | cluster DNS |
| `kindnet` | default CNI |
| `kube-proxy` | Service forwarding |
| `local-path-provisioner` | default StorageClass `standard` |

Exact contents vary between Kind versions; trust the output of `kubectl get pods -A`.

An optional DNS smoke test — resolving `kubernetes.default` shows that cluster DNS and the Service network work:

```bash
kubectl --context kind-kind-single run dns-test \
  --image=busybox:1.36 --restart=Never --rm -i --command \
  -- nslookup kubernetes.default
```

## Access the cluster from the host

Kind maps the API server port to the host, and the kubeconfig records a host-reachable address. Business ports are not exposed automatically:

- For temporary access to a Service use `kubectl port-forward svc/<name> <local>:<remote>`; it needs no cluster configuration and suits development and verification.
- For a fixed port declare `extraPortMappings` in the cluster configuration to map a host port onto a node container port.
- On macOS and Windows the node container IPs are not routable from the host, so use port mappings or `port-forward`.

## Data persistence

The default StorageClass `standard` writes PVC data into `/var/local-path-provisioner` inside the node container. The configuration above maps that path to `${HOME}/.kind-single-node` on the host, so PVC data actually lands in that host directory.

Create a PVC and a writing test Pod. The manifest is [`installation/single-node/yaml/pvc-check.yaml`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/single-node/yaml/pvc-check.yaml):

```bash
kubectl --context kind-kind-single apply \
  -f zq-xu.github.io/docs/public/demos/kind/installation/single-node/yaml/pvc-check.yaml
```

Confirm the data was written both in the container and on the host:

```bash
kubectl --context kind-kind-single wait \
  --for=condition=Ready pod/host-data-check --timeout=120s

kubectl --context kind-kind-single exec host-data-check -- cat /data/check.log
find "${HOME}/.kind-single-node" -maxdepth 2 -type f -name check.log
```

Stop and start the node container, then read the same file. [`restart-node.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/single-node/scripts/restart-node.sh) finds the node container of the cluster and waits for the node after starting it:

```bash
cd zq-xu.github.io/docs/public/demos/kind
./installation/single-node/scripts/restart-node.sh
```

Wait for the business Pod to become ready again and read the data:

```bash
kubectl --context kind-kind-single wait \
  --for=condition=Ready pod/host-data-check --timeout=180s
kubectl --context kind-kind-single exec host-data-check -- cat /data/check.log
```

`kind delete cluster` removes the node container, etcd and the PV/PVC objects; the files under `${HOME}/.kind-single-node` remain, but a new cluster does not pick up old PVCs. Stopping and starting only the node container keeps both the cluster objects and the PVC.

Do not delete the PVC when the test finishes unless you no longer need the data; the default StorageClass uses the `Delete` reclaim policy.

## One-shot script

[`kind-single-node.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/single-node/scripts/kind-single-node.sh) chains the steps above into a single run:

```bash
cd zq-xu.github.io/docs/public/demos/kind
./installation/single-node/scripts/kind-single-node.sh
```

The script runs these steps in order:

1. check Docker and kubectl, and exit with an error if Docker is not running;
2. download `v0.33.0` of `kind` into `~/.local/bin` when it is missing;
3. render a configuration with a host directory mount in a temporary file, create `kind-single` if it does not exist, otherwise reuse it;
4. wait until every node is `Ready`;
5. print nodes, StorageClass and system Pods.

The default data directory is `${HOME}/.kind-single-node`. The script is idempotent: rerunning it never deletes an existing cluster. To rebuild, delete first:

```bash
kind delete cluster --name kind-single
```

Environment variables override the defaults:

```bash
CLUSTER_NAME=kind-dev \
DATA_DIR="${HOME}/.kind-single-node-test" \
NODE_IMAGE=kindest/node:v1.36.4 \
./installation/single-node/scripts/kind-single-node.sh
```

## Clean up

```bash
kind delete cluster --name kind-single
```

Deleting removes the node containers, the Docker network, etcd and the matching kubeconfig context. Files under `${HOME}/.kind-single-node` are not removed automatically, but a new cluster does not pick up old PVCs or old cluster objects.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `Cannot connect to the Docker daemon` | Docker not running or no permission for the current user | Start Docker Desktop / `dockerd` and confirm `docker info` works |
| Node image pull fails | Docker Hub is unreachable from your network | Pull the node image manually with `docker pull`, or configure a registry mirror |
| `timed out waiting for control plane` | Too little Docker memory or a low `inotify` limit | Raise Docker memory to 8 GB and adjust `fs.inotify.*` as described in the official known issues |
| Node stays `NotReady` | CNI not ready or node startup failure | `kubectl describe node`, then `kind export logs --name kind-single` |
| `bind: address already in use` | Host port taken by another cluster or process | Delete the old cluster, or use another `hostPort` in the configuration |
| kubectl cannot find the context | kubeconfig not merged, or a wrong `KUBECONFIG` | `kind export kubeconfig --name kind-single` |

Preserve the scene when creation fails, then export the logs:

```bash
kind create cluster --name kind-debug --retain --wait 120s
kind export logs --name kind-debug ./kind-logs
```

## Common pitfalls and resource limits

| Pitfall | Actual behaviour | What to do |
| --- | --- | --- |
| A single node can verify high availability | One etcd and one control-plane, no failover | Use a 3-control-plane layout for HA checks |
| Creation success means the node is ready | `--wait` only covers the control plane | Also run `kubectl wait --for=condition=Ready nodes` |
| Local images are usable by Pods directly | Nodes run their own containerd and cannot see host Docker images | Run `kind load docker-image` first |
| Data survives cluster deletion | The node container is deleted together with its data | Mount the storage path to a host directory at creation |
| An older Kind runs any newer node image | Kind and node images are compatible only within a range | Pick matching versions from the release notes |

Two resource limits remain on a single node:

- The Docker Desktop memory cap is the cluster cap; below 4 GB even a single node can fail to start for lack of memory;
- Containers share the host kernel and its `inotify` limits; with many nodes or many watched files, raise `fs.inotify.max_user_watches` on the host.

## Command and flag reference

| Flag / command | Meaning |
| --- | --- |
| `--name` | cluster name, sets the container prefix and the kubectl context |
| `--image` | node image, sets the Kubernetes version and architecture |
| `--wait` | timeout for the control plane to become ready; a unit is required |
| `--config` | YAML configuration for nodes, networking and port mappings |
| `kind get clusters` | list all local Kind clusters |
| `kind export kubeconfig` | re-export the kubeconfig of a cluster |
| `kind delete cluster` | delete cluster containers, network and kubeconfig entries |
| `kind export logs` | export node logs for failed creation debugging |


