---
description: 在 Kind 多节点集群中部署一个 Go 示例项目：先决条件、镜像构建与加载、Deployment 与 Service 清单要点、部署与访问验证、更新回滚、一键部署脚本与常见问题处理。
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

# 在 Kind 中部署简单项目

在 Kind 中部署本地项目，除常规 Kubernetes 操作外，还需要把本地镜像送入节点：Kind 不提供镜像仓库，节点内的 containerd 与宿主机 Docker 是两套独立的镜像存储。

示例是一个无外部依赖的 Go 服务，部署过程覆盖从构建镜像到通过 Service 访问工作负载，并给出适用于本地开发与 CI 的配置约定。命令以多节点集群 `kind-multi`、context `kind-kind-multi` 为例。

## 先决条件

| 项目 | 要求 | 检查命令 |
| --- | --- | --- |
| Docker | 25 及以上，引擎正在运行 | `docker info` |
| Kind | `v0.33.0` | `kind version` |
| kubectl | `1.37.x` | `kubectl version --client` |
| 集群 | 一个已就绪的 `kind-multi` 多节点集群 | `kubectl --context kind-kind-multi get nodes` |

Docker、Kind 与 kubectl 的安装命令见 [Kind 单节点部署](./single-node-deployment.md)的“安装依赖”；`kind-multi` 集群的创建见 [Kind 多节点部署](./multi-node-deployment.md)的“普通部署”。节点全部为 `Ready` 后再继续。

示例应用代码、Dockerfile、Kubernetes 清单和脚本位于仓库 [`docs/public/demos/kind`](https://github.com/zq-xu/zq-xu.github.io/tree/master/docs/public/demos/kind)。

## 示例服务与部署资源

### 示例服务

示例是一个无外部依赖的 Go 服务，提供两个端点：

| 端点 | 作用 | 返回 |
| --- | --- | --- |
| `/` | 业务响应 | 主机名与版本号 |
| `/healthz` | 健康检查 | `ok` |

服务读取 `PORT` 与 `APP_VERSION` 两个环境变量，并支持优雅退出。服务规模较小，便于把验证重点放在部署流程而非业务代码上。

### 部署资源

| 对象 | 作用 |
| --- | --- |
| Namespace | 隔离示例资源，便于整组删除 |
| ConfigMap | 提供 `APP_VERSION`，把配置与镜像解耦 |
| Deployment | 管理 2 个 Pod 副本、探针、资源和滚动更新 |
| Service | 为 Pod 提供稳定的集群内访问入口 |
| 镜像 | 由 Dockerfile 构建，经 `kind load` 进入节点 |

### 项目结构

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

`app/` 存放示例应用代码与部署清单；`installation/single-node/` 与 `installation/multiple-node/` 分别存放对应布局的 `yaml/` 模板、渲染脚本、持久化校验清单与 `scripts/` 创建、运维脚本；应用部署脚本放在 `installation/application/scripts/`。生成的 `*.local.yaml` 与模板同目录，不纳入版本控制。

全部资源写在同一个 `kind-demo.yaml` 中，用 `---` 分隔。`kubectl apply` 按文件内顺序处理，因此 Namespace 放在最前面，其余资源可以一次创建。

## 镜像如何进入节点

宿主机的 Docker 镜像库与节点镜像库是两套存储：

```text
host docker build ──> host image store
                         │
                         │ kind load docker-image
                         ▼
              node containerd image store (all nodes)
```

因此，“构建成功”不等于“集群可用”，必须显式执行 `kind load` 把镜像送进每个节点（具体命令见下方“构建与加载镜像”）。`kind load docker-image` 默认导入所有节点，可用 `docker exec kind-multi-worker crictl images` 确认节点内已有镜像；只导入部分节点时，必须通过节点亲和性或固定调度保证 Pod 落在已有镜像的节点上。

镜像标签必须固定，不要使用 `:latest`：Kubernetes 对 `:latest` 默认采用 `Always` 拉取策略，会绕过本地镜像去访问仓库。Deployment 中同时显式声明：

```yaml
image: kind-demo:v1
imagePullPolicy: IfNotPresent
```

## 清单配置要点

以下配置都写在 [`app/deploy/kind-demo.yaml`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/app/deploy/kind-demo.yaml) 中。

### 就绪探针与存活探针

| 探针 | 失败后的动作 | 适用目的 |
| --- | --- | --- |
| `readinessProbe` | 把 Pod 从 Service Endpoints 摘除，不重启 | 启动未完成、依赖未就绪时停止接流量 |
| `livenessProbe` | 重启容器 | 进程卡死、死锁等无法自愈的故障 |

示例使用同一个 `/healthz`，但语义不同：readiness 决定“能不能接流量”，liveness 决定“要不要重启”。生产环境应避免让 liveness 依赖外部服务，否则外部故障会引发重启风暴。

### 资源请求与限制

```yaml
resources:
  requests:
    cpu: 50m
    memory: 64Mi
  limits:
    cpu: 200m
    memory: 128Mi
```

- `requests` 参与调度，决定 Pod 能否放到节点；
- `limits` 是运行时上限，超过 CPU 会被限流，超过内存会被 OOM 杀死。

在 Kind 中取值过小或过大都不利于验证：过小会导致 Pod 频繁重启，过大则可能因为节点资源不足而 `Pending`。

### 多节点调度

示例用 `topologySpreadConstraints` 让 2 个副本尽量落在不同节点：

```yaml
topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: kubernetes.io/hostname
    whenUnsatisfiable: ScheduleAnyway
    labelSelector:
      matchLabels:
        app.kubernetes.io/name: kind-demo
```

`ScheduleAnyway` 表示即使无法完美分散也要调度，避免因为节点不足而 Pending。需要严格分散时改为 `DoNotSchedule`，但要先确认 worker 数量足够。

如果已经给 control-plane 加了 `NoSchedule` 污点，2 个副本会落在 2 个 worker 上；如果没有加，副本也可能落到 control-plane。

### 容器安全上下文

示例容器以非 root 运行，并限制写权限：

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

这些设置与 Dockerfile 中的 `USER 10001:10001` 配套。只改清单不改镜像，容器仍可能以 root 启动；只改镜像不改清单，则缺少 Kubernetes 侧的兜底。

### Service 访问方式

Kind 不自动暴露业务端口：

| 方式 | 适用场景 | 优点 | 限制 |
| --- | --- | --- | --- |
| `kubectl port-forward` | 本地开发、一次性验证 | 零配置、跨平台 | 进程退出即失效，不适合共享 |
| NodePort + `extraPortMappings` | 固定端口、局域网访问 | 不依赖额外组件 | 需要提前规划宿主机端口 |
| Ingress | 多服务、按域名或路径路由 | 更接近生产入口 | Kind 不内置 Ingress Controller，需要额外安装 |
| LoadBalancer | 需要外部 IP | 语义接近云环境 | Kind 默认没有 LoadBalancer 实现 |

这里的验证使用 `port-forward`，它不依赖集群配置，适合确认镜像与清单是否正确。

### 持久化数据

示例服务不写本地磁盘，因此清单中没有 PVC。需要持久化数据的业务不能只依赖容器文件系统：Kind 节点容器被删除后，容器内数据随容器消失；默认 StorageClass 的 PV 位于节点本地，访问模式为 `ReadWriteOnce`，不同节点上的副本无法同时挂载。

创建集群时使用 `extraMounts` 把 `/var/local-path-provisioner` 挂载到宿主机目录后，默认 StorageClass 创建的 PV 数据会写到宿主机。应用侧使用 PVC 时，单副本 Deployment 或 StatefulSet 更合适；多副本共享同一份数据需要外部共享存储。

## 部署流程

![Kind 部署示例项目流程](/images/open-source/kind/kind-demo-flow-zh.svg)

1. 在项目目录构建镜像，使用固定标签 `kind-demo:v1`；
2. 通过 `kind load docker-image` 将镜像导入集群所有节点；
3. 使用 `kubectl apply` 创建 Namespace、ConfigMap、Deployment 和 Service；
4. Deployment 创建 2 个 Pod，readiness 通过后接入 Service；
5. 通过 `kubectl port-forward` 把 Service 暴露到宿主机，验证健康检查与业务响应；
6. 更新镜像时依次执行构建、加载、更新镜像和等待滚动完成。

## 构建与加载镜像

构建示例镜像：

```bash
cd zq-xu.github.io/docs/public/demos/kind
docker build -t kind-demo:v1 ./app
```

Dockerfile 采用两阶段构建：

- 构建阶段用 `golang:1.27-alpine` 编译静态二进制；
- 运行阶段用 `alpine:3.22`，创建 UID 10001 的非 root 用户；
- 只复制二进制，不把源码和编译工具带进运行镜像。

把镜像导入集群所有节点：

```bash
kind load docker-image kind-demo:v1 --name kind-multi
```

确认节点内已有镜像：

```bash
docker exec kind-multi-worker crictl images | grep kind-demo
```

## 部署资源

一次性应用全部资源。`kind-demo.yaml` 内按 Namespace、ConfigMap、Deployment、Service 的顺序排列：

```bash
kubectl --context kind-kind-multi apply -f app/deploy/kind-demo.yaml
```

等待 Deployment 完成滚动更新，确认 2 个 Pod 都进入 Ready：

```bash
kubectl --context kind-kind-multi -n kind-demo rollout status \
  deployment/kind-demo --timeout=180s
```

查看 Pod 所在节点、IP 和运行状态：

```bash
kubectl --context kind-kind-multi -n kind-demo get pods -o wide
```

期望结果：

- 2 个 Pod 均为 `Running`，且 `READY` 为 `2/2`；
- 两个 Pod 尽量分布在不同的 worker 节点；
- Service `kind-demo` 的 Endpoints 包含两个 Pod IP。

检查 Service 与 Endpoints：

```bash
kubectl --context kind-kind-multi -n kind-demo get service kind-demo
kubectl --context kind-kind-multi -n kind-demo get endpoints kind-demo
```

## 访问验证

把 Service 转发到宿主机 `18080` 端口，命令保持运行：

```bash
kubectl --context kind-kind-multi -n kind-demo port-forward \
  svc/kind-demo 18080:80
```

另开一个终端发起请求：

```bash
curl -i http://127.0.0.1:18080/healthz
curl -i http://127.0.0.1:18080/
```

业务响应类似：

```text
hello from kind
host: kind-demo-7c9f8d6b5-xxxxx
version: v1
```

多次请求 `/` 可以看到 `host` 在两个 Pod 之间轮换，说明 Service 正在把流量分发到两个副本。

## 一键部署

[`kind-demo-deploy.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/application/scripts/kind-demo-deploy.sh) 把构建、加载、部署和验证串成一次执行：

```bash
cd zq-xu.github.io/docs/public/demos/kind
./installation/application/scripts/kind-demo-deploy.sh
```

脚本按顺序完成：

1. 检查 Docker、kind、kubectl、curl；
2. 集群不存在时调用 `kind-multi-node.sh` 创建；
3. 构建 `kind-demo:v1` 并导入所有节点；
4. 应用 `kind-demo.yaml`，一次创建 Namespace 与全部资源；
5. 等待 Deployment 滚动完成；
6. 在 `127.0.0.1:18080` 启动临时 `port-forward`，请求 `/healthz` 与 `/`；
7. 退出时关闭临时转发，并打印长期访问命令。

可用环境变量覆盖默认值：

```bash
CLUSTER_NAME=kind-dev IMAGE=kind-demo:v1 LOCAL_PORT=18081 \
  ./installation/application/scripts/kind-demo-deploy.sh
```

脚本不会自动删除命名空间，便于继续排查。

## 更新与回滚

修改代码后构建新标签，加载并更新镜像：

```bash
# build the new tag and load it into every node
docker build -t kind-demo:v2 ./app
kind load docker-image kind-demo:v2 --name kind-multi

# point the deployment at the new image and wait for the rollout
kubectl --context kind-kind-multi -n kind-demo set image \
  deployment/kind-demo app=kind-demo:v2

kubectl --context kind-kind-multi -n kind-demo rollout status \
  deployment/kind-demo
```

回滚到上一个版本：

```bash
kubectl --context kind-kind-multi -n kind-demo rollout undo deployment/kind-demo
```

更新 ConfigMap 后需要重启 Pod 才会读取新值：

```bash
kubectl --context kind-kind-multi -n kind-demo rollout restart deployment/kind-demo
```

## 清理应用资源

```bash
kubectl --context kind-kind-multi delete namespace kind-demo
```

删除 Namespace 会一并删除该命名空间下的 Deployment、Service、ConfigMap 与 Pod，不影响 Kind 集群及其他命名空间。清理只针对应用资源，集群保留。

## 常见问题与故障排查

这些问题多与本地镜像分发、宿主机访问 Service 和节点架构有关，而不是应用清单本身的写法。

| 问题 | 表现 | 处理 |
| --- | --- | --- |
| `docker build` 后直接 `kubectl apply` | 节点内没有镜像，Pod 报 `ErrImagePull` | 先 `kind load docker-image` |
| 使用 `:latest` | 默认 `Always` 拉取，本地镜像被忽略 | 固定标签并设置 `IfNotPresent` |
| 只给一个节点加载镜像 | Pod 调度到其他节点时拉取失败 | 默认加载所有节点，或配合节点亲和 |
| Pod `Pending` | 资源不足、污点、亲和性或端口冲突 | `kubectl describe pod` 查看 Events |
| `CrashLoopBackOff` | 应用启动失败、探针配置过严 | `kubectl logs`、`kubectl describe pod` |
| `port-forward` 连接被拒绝 | Service 端口或 targetPort 不匹配 | `kubectl get svc -o yaml`，检查 `targetPort: http` |
| 请求返回空响应 | Pod 未 Ready 或 Endpoints 为空 | `kubectl get endpoints`，等待 readiness 通过 |
| 用 `port-forward` 做长期入口 | 终端关闭后连接断开 | 共享访问使用 NodePort 或 Ingress |
| 把 PVC 当共享存储 | 默认 StorageClass 是节点本地盘 | 需要共享时使用外部存储或固定调度 |
| 容器启动报 `exec format error` | 镜像架构与节点不一致（如 Apple Silicon 构建 amd64） | 构建与节点镜像一致的 `--platform` |

另一个常见问题是 Ingress：Kind 本身不安装 Ingress Controller。官方文档现在推荐 `cloud-provider-kind` 提供 Ingress 与 LoadBalancer 能力，也可以自行安装 ingress-nginx 等第三方控制器。无论哪种方式，都需要节点标签与端口映射配合。

查看 Pod 事件定位失败原因：

```bash
kubectl --context kind-kind-multi -n kind-demo describe pod <pod-name>
```




