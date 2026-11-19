---
description: "Deploy a small Go service to a multi-node Kind cluster: local image build and loading, Deployment, Service, probes, resource limits, verification and one-shot deployment."
date: 2026-11-16
recommend: 5
tag:
 - Kind
tags:
 - Kubernetes
 - Docker
 - Kind
categories:
 - Open Source
---

# Deploying a Simple Project on Kind

Deploying a local project on Kind requires one step beyond ordinary Kubernetes operations: the local image must be delivered to the nodes. The deployment flow below runs from building the image to reaching the workload through a Service, and establishes configuration conventions suitable for local development and CI.

The following steps assume a multi-node cluster named `kind-multi`.

## Deployment flow

![Deploying a sample project on Kind](/images/open-source/kind/kind-demo-flow.svg)

1. Build the image in the project directory with a fixed tag, for example `kind-demo:v1`.
2. Import the image into every node with `kind load docker-image`.
3. Apply the Namespace, ConfigMap, Deployment and Service.
4. The Deployment creates two Pods; only Pods that pass readiness join the Service.
5. Expose the Service to the host with `kubectl port-forward`, then verify health and business responses.
6. To update, build, load, update the image and wait for the rollout to complete.

In one sentence: **Kind has no built-in registry, so the local image must be loaded explicitly; beyond that, deployment is ordinary Kubernetes.**

## Sample service and resources

### Sample service

The sample is a dependency-free Go service with two endpoints:

| Endpoint | Purpose | Response |
| --- | --- | --- |
| `/` | Business response | Hostname and version |
| `/healthz` | Health check | `ok` |

It reads `PORT` and `APP_VERSION` from the environment and supports graceful shutdown. It is small enough to keep attention on the deployment path rather than business logic.

### Deployed resources

| Object | Purpose |
| --- | --- |
| Namespace | Isolate demo resources and delete them as a group |
| ConfigMap | Supply `APP_VERSION`, separating configuration from the image |
| Deployment | Manage two Pods, probes, resources and rolling updates |
| Service | Provide a stable in-cluster endpoint |
| Image | Built by Dockerfile and loaded into nodes with `kind load` |

### Images and node image stores

Each Kind node runs its own `containerd`. The host Docker image store and the node image stores are separate:

```text
host docker build ──> host image store
                         │
                         │ kind load docker-image
                         ▼
              node containerd image store (all nodes)
```

A successful build does not mean the cluster can use the image. Run `kind load`, and make sure the node that runs the Pod has the image.

## Deployment configuration

### Image loading and tag policy

```bash
docker build -t kind-demo:v1 ./app
kind load docker-image kind-demo:v1 --name kind-multi
```

By default the image is imported into every node. Confirm with `docker exec kind-worker crictl images`.

Use a fixed tag. Avoid `:latest`: Kubernetes defaults to `Always` for it and bypasses the local image. Also declare:

```yaml
image: kind-demo:v1
imagePullPolicy: IfNotPresent
```

### Readiness and liveness probes

| Probe | Action on failure | Purpose |
| --- | --- | --- |
| `readinessProbe` | Remove the Pod from Service endpoints; do not restart | Stop traffic while the app is starting or a dependency is unavailable |
| `livenessProbe` | Restart the container | Recover from deadlocks or stuck processes |

The sample uses the same `/healthz` for both, but the semantics differ: readiness decides "can this Pod serve traffic", liveness decides "should this container be restarted". Production liveness checks should not depend on external services, or an outage can trigger a restart storm.

### Requests and limits

```yaml
resources:
  requests:
    cpu: 50m
    memory: 64Mi
  limits:
    cpu: 200m
    memory: 128Mi
```

- `requests` participates in scheduling and decides whether the Pod fits on a node;
- `limits` is the runtime ceiling; CPU overuse is throttled, memory overuse is OOM-killed.

On Kind, values that are too small cause restarts; values that are too large can leave Pods `Pending` because the node has no room.

### Multi-node scheduling

The sample uses `topologySpreadConstraints` to spread two replicas across nodes:

```yaml
topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: kubernetes.io/hostname
    whenUnsatisfiable: ScheduleAnyway
    labelSelector:
      matchLabels:
        app.kubernetes.io/name: kind-demo
```

`ScheduleAnyway` still schedules when perfect spreading is impossible, avoiding `Pending` on small clusters. Use `DoNotSchedule` for strict spreading, but first make sure enough workers exist.

If control planes have the `NoSchedule` taint, the two replicas land on the two workers. Without the taint, one can land on a control plane.

### Service access

Kind does not expose workload ports automatically. Common options:

| Method | Use case | Advantage | Limitation |
| --- | --- | --- | --- |
| `kubectl port-forward` | Local development, one-off checks | No configuration, cross-platform | Dies with the process; not for sharing |
| NodePort + `extraPortMappings` | Fixed port, LAN access | No extra components | Host ports must be planned |
| Ingress | Multiple services, host/path routing | Closer to production ingress | Kind has no built-in Ingress controller |
| LoadBalancer | External IP semantics | Close to cloud behaviour | Kind has no LoadBalancer implementation by default |

`port-forward` needs no cluster changes and directly validates whether the image and manifests are correct.

### Container security context

```yaml
securityContext:
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  runAsNonRoot: true
  runAsUser: 10001
  capabilities:
    drop:
      - ALL
```

These settings match `USER 10001:10001` in the Dockerfile. Changing only the manifest can still leave a root process; changing only the image loses the Kubernetes-side guardrails.

### Persistent data

The sample service does not write to local disk, so its manifests contain no PVC. A workload that needs durable data cannot rely on the container filesystem alone: data inside a Kind node container disappears when that container is removed, and a PV from the default StorageClass is node-local and `ReadWriteOnce`, so it cannot be mounted by replicas on different nodes.

Use `extraMounts` to mount `/var/local-path-provisioner` to a host directory when creating the cluster, and PV data from the default StorageClass is written to the host. On the application side, a single-replica Deployment or a StatefulSet fits a PVC better; sharing one dataset across replicas requires external shared storage.

## Common deployment issues and fixes

The issues below are common when deploying workloads on Kind. Most stem from local image distribution, host access to Services, or node architecture rather than from the Kubernetes manifests themselves.

| Issue | Symptom | Action |
| --- | --- | --- |
| `docker build` then `kubectl apply` | The image is absent; Pods report `ErrImagePull` | Run `kind load docker-image` |
| Use `:latest` | Default `Always` pull ignores the local image | Use a fixed tag and `IfNotPresent` |
| Load only one node | Pods on other nodes fail to pull | Load all nodes or use node affinity |
| Use `port-forward` as a long-term entry | Connections drop when the terminal closes | Use NodePort or Ingress for shared access |
| Treat a PVC as shared storage | The default StorageClass is node-local | Use external storage or pin the Pod |
| Build amd64 on Apple Silicon | Architecture mismatch; the container cannot start | Build for the same architecture as the node image |

Ingress is another common issue: Kind does not install an Ingress controller. The official docs now recommend `cloud-provider-kind` for Ingress and LoadBalancer support; third-party controllers such as ingress-nginx also work. Either way, node labels and port mappings must match.

## Commands and configuration

| Flag / command | Meaning |
| --- | --- |
| `docker build -t <tag>` | Build a local image |
| `kind load docker-image <tag> --name <cluster>` | Import the image into all nodes of a cluster |
| `imagePullPolicy: IfNotPresent` | Use the local image when present |
| `kubectl rollout status` | Wait for a Deployment rollout |
| `kubectl port-forward svc/<name> <local>:<remote>` | Forward a Service port to the host |
| `kubectl get endpoints` | Check whether the Service has Ready Pods |
| `kubectl rollout undo` | Roll back to the previous ReplicaSet |

## Deployment steps

### Project layout

```text
docs/public/demos/kind/
├── app/
│   ├── deploy/
│   │   └── kind-demo.yaml
│   ├── Dockerfile
│   ├── go.mod
│   └── main.go
└── installation/
    ├── single-node/
    │   ├── yaml/
    │   │   ├── kind-single.yaml
    │   │   ├── pvc-check.yaml
    │   │   └── render-config.sh
    │   └── scripts/
    │       ├── kind-single-node.sh
    │       └── restart-node.sh
    ├── multiple-node/
    │   ├── yaml/
    │   │   ├── kind-multi.yaml
    │   │   ├── kind-ha.yaml
    │   │   ├── pvc-check.yaml
    │   │   └── render-config.sh
    │   └── scripts/
    │       ├── kind-multi-node.sh
    │       ├── control-plane-taint.sh
    │       └── restart-nodes.sh
    └── application/
        └── scripts/
            └── kind-demo-deploy.sh
```

`app/` holds the sample application and its deploy manifest. `installation/single-node/` and `installation/multiple-node/` each keep layout-specific `yaml/` templates, rendering scripts and persistence check manifests plus `scripts/` create and operational scripts. The application deployment script lives in `installation/application/scripts/`. Generated `*.local.yaml` files stay next to their templates and are not versioned.

All resources live in one `kind-demo.yaml`, separated by `---`. `kubectl apply` processes documents in order, so the Namespace comes first and the remaining resources are created in the same pass.

### Build the image

```bash
cd zq-xu.github.io/docs/public/demos/kind
docker build -t kind-demo:v1 ./app
```

The Dockerfile is a two-stage build:

- build with `golang:1.27-alpine` into a static binary;
- run on `alpine:3.22` as non-root UID 10001;
- copy only the binary, not the source or toolchain.

### Load and deploy

First load the image into every node. Kind nodes run their own containerd and cannot read the host Docker image store directly:

```bash
kind load docker-image kind-demo:v1 --name kind-multi
```

Apply all resources in one pass. `kind-demo.yaml` orders them as Namespace, ConfigMap, Deployment and Service:

```bash
kubectl --context kind-kind-multi apply -f app/deploy/kind-demo.yaml
```

Wait for the Deployment rollout and confirm that both Pods become Ready:

```bash
kubectl --context kind-kind-multi -n kind-demo rollout status \
  deployment/kind-demo --timeout=180s
```

Show the node, IP and status of each Pod:

```bash
kubectl --context kind-kind-multi -n kind-demo get pods -o wide
```

Expected:

- two Pods are `Running` with `READY 2/2`;
- the Pods are spread across different workers when possible;
- the `kind-demo` Service Endpoints contain both Pod IPs.

Inspect the Service:

```bash
kubectl --context kind-kind-multi -n kind-demo get service kind-demo
kubectl --context kind-kind-multi -n kind-demo get endpoints kind-demo
```

### Verify

```bash
kubectl --context kind-kind-multi -n kind-demo port-forward \
  svc/kind-demo 18080:80
```

In another terminal:

```bash
curl -i http://127.0.0.1:18080/healthz
curl -i http://127.0.0.1:18080/
```

The response looks like:

```text
hello from kind
host: kind-demo-7c9f8d6b5-xxxxx
version: v1
```

Calling `/` repeatedly shows the `host` alternating between the two Pods, which confirms the Service is distributing traffic.

### One-shot deployment

[`kind-demo-deploy.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/application/scripts/kind-demo-deploy.sh) chains build, load, deploy and verify:

```bash
cd zq-xu.github.io/docs/public/demos/kind
./installation/application/scripts/kind-demo-deploy.sh
```

The script:

1. checks Docker, kind, kubectl and curl;
2. creates `kind-multi` through `kind-multi-node.sh` when missing;
3. builds `kind-demo:v1` and loads it into all nodes;
4. applies `kind-demo.yaml`, creating the Namespace and all resources in one pass;
5. waits for the Deployment rollout;
6. starts a temporary `port-forward` on `127.0.0.1:18080` and calls `/healthz` and `/`;
7. closes the temporary forward and prints the long-lived access command.

Override defaults:

```bash
CLUSTER_NAME=kind-dev IMAGE=kind-demo:v1 LOCAL_PORT=18081 \
  ./installation/application/scripts/kind-demo-deploy.sh
```

The script does not delete the namespace, so you can keep investigating.

### Update and roll back

```bash
docker build -t kind-demo:v2 ./app
kind load docker-image kind-demo:v2 --name kind-multi

kubectl --context kind-kind-multi -n kind-demo set image \
  deployment/kind-demo app=kind-demo:v2

kubectl --context kind-kind-multi -n kind-demo rollout status \
  deployment/kind-demo
```

Roll back:

```bash
kubectl --context kind-kind-multi -n kind-demo rollout undo deployment/kind-demo
```

After a ConfigMap change, restart the Pods to pick up the new value:

```bash
kubectl --context kind-kind-multi -n kind-demo rollout restart deployment/kind-demo
```

### Clean up application resources

```bash
kubectl --context kind-kind-multi delete namespace kind-demo
```

Deleting the namespace removes its Deployment, Service, ConfigMap and Pods. The Kind cluster and other namespaces are unaffected.

### Troubleshooting

| Symptom | Usual cause | Action |
| --- | --- | --- |
| `ErrImagePull` / `ImagePullBackOff` | Image not loaded, tag mismatch, or `:latest` | Re-run `kind load`; check the Pod's node and tag |
| Pod `Pending` | Resource shortage, taint, affinity, port conflict | `kubectl describe pod` and read Events |
| `CrashLoopBackOff` | App fails to start or probes are too strict | `kubectl logs`, `kubectl describe pod` |
| `port-forward` connection refused | Service port or targetPort mismatch | `kubectl get svc -o yaml`; check `targetPort: http` |
| Empty response | Pod not Ready or Endpoints empty | `kubectl get endpoints`; wait for readiness |
| `exec format error` | Image architecture differs from the node | Build with the same `--platform` as the node image |

Check images inside a node:

```bash
docker exec kind-multi-worker crictl images | grep kind-demo
```

Inspect Pod events:

```bash
kubectl --context kind-kind-multi -n kind-demo describe pod <pod-name>
```
