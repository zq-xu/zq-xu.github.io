---
description: 用 Kind 创建多节点 Kubernetes 集群：1 control-plane + 2 worker 的配置、3 control-plane 高可用布局、端口映射、调度验证与一键脚本。
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

# Kind 多节点部署

多节点集群在同一台主机上提供多个 Kubernetes 节点，用于验证调度、跨节点网络、服务发现和高可用行为。Kind 通过集群配置声明节点数量与角色，常见布局为 1 个 control-plane 加 2 个 worker，或 3 个 control-plane 加 3 个 worker。

所有节点仍然运行在同一台主机上，因此多节点集群不能替代真实的多机环境。它的价值在于以较低成本复现节点加入、污点调整和调度分布等行为。

## 核心概念

### 节点角色

| 角色 | 运行的组件 | 作用 |
| --- | --- | --- |
| `control-plane` | API Server、etcd、调度器、控制器管理器、kubelet、containerd | 管理集群状态、接收 API 请求、调度 Pod |
| `worker` | kubelet、containerd、kube-proxy | 运行被调度的 Pod |

每个角色仍然是一个 Docker 容器。节点容器的数量就是集群的节点数量，没有额外的“虚拟机”或“宿主机代理”。

### 集群配置

Kind 使用 `kind.x-k8s.io/v1alpha4` 的 YAML 描述集群。多节点配置的核心是 `nodes` 数组：

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
  - role: worker
```

每个节点还可以设置：

- `image`：该节点的 Kubernetes 版本；
- `kubeadmConfigPatches`：给 kubeadm 的补丁，例如节点标签、kubelet 参数；
- `extraPortMappings`：宿主机端口到该节点容器端口的映射；
- `extraMounts`：宿主机目录挂载到节点容器。

`networking` 字段用于设置 Pod CIDR、Service CIDR、API Server 监听地址、kube-proxy 模式等。没有特殊需求时保持默认即可。

### 污点与调度

Kind 默认移除 control-plane 的 `NoSchedule` 污点，因此多节点集群中的业务 Pod 也可能调度到 control-plane。这一行为在本地验证中较为便利，但与生产环境的常见约定不同。

如果希望模拟“control-plane 只承担管理职责、不运行工作负载”，需要手动恢复污点：

```bash
for node in $(kubectl --context kind-kind-multi get nodes \
  -l node-role.kubernetes.io/control-plane \
  -o jsonpath='{.items[*].metadata.name}'); do
  kubectl --context kind-kind-multi taint node "$node" \
    node-role.kubernetes.io/control-plane:NoSchedule --overwrite
done
```

加回污点后，只有带对应 toleration 的系统组件（例如 Ingress Controller）还能调度到 control-plane。

### 高可用布局

3 个 control-plane 时，每个 control-plane 都运行一个 etcd 成员。etcd 需要多数派才能写入，因此：

- 1 个 control-plane 故障，剩余 2 个仍可工作；
- 2 个 control-plane 故障，集群失去多数派，API 写入会受阻。

Kind 会在 Docker 网络里额外启动一个负载均衡容器，让 kubeconfig 中的 API Server 地址指向它，再由它把请求分发到存活的 control-plane。对用户来说，仍然是一个 kubeconfig、一个 context。

高可用布局的资源开销明显更高：6 个节点容器加 1 个负载均衡容器。建议为 Docker 分配至少 8 GB 内存，条件允许时分配 12 GB。

## 关键机制

### 节点如何加入集群

Kind 不是简单地“启动多个容器”就结束。创建过程中：

1. 第一个 control-plane 生成集群证书、token 和 join 配置；
2. 其他 control-plane 使用 `kubeadm join --control-plane` 加入，并同步证书；
3. worker 使用普通 `kubeadm join` 加入；
4. 所有节点启动 `kubelet`，向 API Server 注册；
5. CNI 就绪后，节点变为 `Ready`。

节点容器之间通过 Kind 创建的 Docker 桥接网络通信。Pod 网络是另一层覆盖网络，由 `kindnetd` 负责。

### 端口映射只作用于声明它的节点

`extraPortMappings` 是“宿主机端口 → 某个节点容器端口”的映射，不会自动应用到所有节点。多节点配置里通常只把它写在第一个 control-plane 上：

```yaml
extraPortMappings:
  - containerPort: 80
    hostPort: 8080
    protocol: TCP
  - containerPort: 443
    hostPort: 8443
    protocol: TCP
```

含义是：访问宿主机 `8080` 的流量进入 control-plane 容器的 `80` 端口。若 Ingress Controller 通过 `hostPort: 80` 监听在 control-plane 上，就可以从宿主机 `8080` 访问。

如果宿主机 `8080` 或 `8443` 已被占用，改成其他端口；不要直接删除映射，否则从宿主机无法访问这些服务。

### 多节点与镜像分布

`kind load docker-image` 默认把镜像导入所有节点。多节点集群尤其需要这个行为：否则 Pod 被调度到没有镜像的节点时会拉取失败。

如果只想导入部分节点，可以使用 `--nodes`，但必须配合节点亲和性或固定调度，否则 Pod 可能落到没有镜像的节点。

## 边界与常见误区

| 误区 | 实际行为 | 正确做法 |
| --- | --- | --- |
| 多节点等于多机 | 所有节点容器仍在一台宿主机上 | 只用于本地验证，不用于生产 |
| 改了配置，已有集群会自动更新 | Kind 只在创建时读取配置 | 删除集群后重新创建 |
| control-plane 默认不运行工作负载 | Kind 默认移除污点 | 需要时手动恢复污点 |
| 所有节点自动有本地镜像 | `kind load` 需要显式执行 | 构建后导入，并使用固定标签 |
| 高可用布局和单节点一样快 | 3 个 etcd 成员与额外负载均衡容器开销更大 | 按需选择，给足内存 |

另一个常见问题是资源竞争：多节点集群会同时启动多个 `kubelet`、`containerd` 和系统 Pod。Docker Desktop 内存不足时，表现为节点启动慢、`NotReady` 或创建超时，而不是明确的错误信息。

## 参数速查

| 参数 | 含义 |
| --- | --- |
| `nodes[].role` | `control-plane` 或 `worker` |
| `nodes[].image` | 该节点的节点镜像，建议固定 `@sha256` |
| `nodes[].kubeadmConfigPatches` | 传给 kubeadm 的补丁，用于标签、kubelet 参数等 |
| `nodes[].extraPortMappings` | 宿主机端口到该节点容器端口的映射 |
| `networking.podSubnet` | Pod CIDR，默认 `10.244.0.0/16` |
| `networking.serviceSubnet` | Service CIDR，默认 `10.96.0.0/12` |
| `networking.kubeProxyMode` | `iptables`、`nftables` 或 `ipvs` |
| `--config` | 指定集群配置文件 |

## 先决条件

- Docker 25 及以上，Docker 引擎正在运行；
- Kind `v0.33.0`；
- kubectl 1.37.x；
- 普通布局建议 4 CPU、8 GB 内存；高可用布局建议 8 CPU、12 GB 内存。

## 安装依赖

Kind 依赖 Docker 提供容器运行时。多节点集群会同时启动多个节点容器，安装完成后先确认 Docker 可用，再创建集群。

### macOS

```bash
brew install --cask docker-desktop
open -a Docker

# 等待 Docker Desktop 完成首次启动和授权
brew install kind kubectl
```

确认 Docker 已就绪：

```bash
docker info
```

### Linux

安装 Docker Engine：

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

`usermod` 修改的是组权限，需要重新登录后生效；也可以在当前终端执行 `newgrp docker` 进入新的 shell。

安装 Kind：

```bash
KIND_VERSION=v0.33.0
ARCH=$(uname -m | sed 's/x86_64/amd64/; s/aarch64/arm64/')
curl -Lo kind "https://kind.sigs.k8s.io/dl/${KIND_VERSION}/kind-linux-${ARCH}"
chmod +x kind
sudo mv kind /usr/local/bin/kind
```

安装 kubectl：

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

检查：

```bash
kind version
docker info
kubectl version --client
```

## 普通部署

普通多节点布局由 1 个 control-plane 和 2 个 worker 组成，适合验证 Pod 调度、跨节点网络和污点行为。以下配置同时将宿主机 `8080` 与 `8443` 映射到 control-plane，供 Ingress 或 NodePort 使用。

### 创建 1 control-plane + 2 worker

保存为 `kind-multi.yaml`：

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

创建：

```bash
kind create cluster --name kind-multi --config kind-multi.yaml --wait 180s
```

`--name` 与配置文件同时使用时，集群名以 `--name` 为准；配置里不写 `name` 可以避免歧义。

### 验证节点

```bash
kind get clusters
kind get nodes --name kind-multi
kubectl --context kind-kind-multi get nodes -o wide
kubectl --context kind-kind-multi get pods -A -o wide
```

期望看到 3 个节点，角色分别是 1 个 control-plane 和 2 个 worker。节点状态全部为 `Ready`。

### 恢复 control-plane 污点

```bash
for node in $(kubectl --context kind-kind-multi get nodes \
  -l node-role.kubernetes.io/control-plane \
  -o jsonpath='{.items[*].metadata.name}'); do
  kubectl --context kind-kind-multi taint node "$node" \
    node-role.kubernetes.io/control-plane:NoSchedule --overwrite
done

kubectl --context kind-kind-multi get nodes -o wide
```

之后业务 Pod 只会调度到 worker。若想恢复 Kind 的默认行为：

```bash
for node in $(kubectl --context kind-kind-multi get nodes \
  -l node-role.kubernetes.io/control-plane \
  -o jsonpath='{.items[*].metadata.name}'); do
  kubectl --context kind-kind-multi taint node "$node" \
    node-role.kubernetes.io/control-plane:NoSchedule-
done
```

### 验证跨节点调度

用一个最小的 Deployment 验证 Pod 能落到不同 worker：

```bash
kubectl --context kind-kind-multi create deployment spread-demo \
  --image=nginx:1.27-alpine --replicas=2

kubectl --context kind-kind-multi rollout status deployment/spread-demo
kubectl --context kind-kind-multi get pods -o wide
```

`scheduler` 不保证两个副本一定分散到两个 worker；如果需要强制分散，给 Deployment 加 `topologySpreadConstraints` 或 Pod 反亲和。示例项目页给出了完整写法。

验证完成后清理：

```bash
kubectl --context kind-kind-multi delete deployment spread-demo
```

## 高可用部署

高可用布局由 3 个 control-plane 和 3 个 worker 组成。三个 control-plane 分别运行 etcd 成员并形成多数派，API Server 通过 Kind 的负载均衡容器对外提供访问。

### 创建高可用布局

保存为 `kind-ha.yaml`：

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

创建：

```bash
kind create cluster --name kind-ha --config kind-ha.yaml --wait 240s
```

### 验证高可用

验证 etcd 成员：

```bash
kubectl --context kind-kind-ha -n kube-system get pods -l component=etcd -o wide
kubectl --context kind-kind-ha get nodes
```

高可用验证不应通过“删除一个 control-plane 容器”来做破坏性测试，除非明确知道自己在做什么。需要验证故障转移时，先确认 kubeconfig 指向的是负载均衡地址，再停一个 control-plane 容器并观察 API 是否仍可用。

## 一键脚本

脚本 [`kind-multi-node.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/scripts/kind-multi-node.sh)负责生成配置、创建集群、等待 Ready，并按需加污点：

```bash
cd zq-xu.github.io/docs/public/demos/kind

# default: 1 control-plane + 2 workers
./scripts/kind-multi-node.sh

# HA: 3 control-planes + 3 workers
HA=true ./scripts/kind-multi-node.sh
```

脚本行为：

1. 检查 Docker、kind、kubectl；
2. 在临时目录生成集群配置，退出时自动删除；
3. 集群不存在时创建；已存在时直接复用；
4. 等待所有节点 Ready；
5. 默认给 control-plane 加回 `NoSchedule` 污点，`TAINT_CONTROL_PLANE=false` 可关闭；
6. 打印节点与系统 Pod 分布。

可通过环境变量覆盖默认值：

```bash
CLUSTER_NAME=kind-dev HA=true ./scripts/kind-multi-node.sh
```

脚本不会修改已有集群的配置。更换布局时需先删除现有集群，再重新创建。

## 清理

```bash
kind delete cluster --name kind-multi
kind delete cluster --name kind-ha
```

## 故障排查

| 现象 | 常见原因 | 处理 |
| --- | --- | --- |
| 仅 1 个节点处于 `Ready` | 其他节点 join 失败或 CNI 未就绪 | `kubectl describe node`，`kind export logs` |
| 创建超时 | Docker 内存/CPU 不足，或宿主机端口冲突 | 提高 Docker 资源，检查 `8080`/`8443` 占用 |
| control-plane 仍运行工作负载 | 没有恢复 `NoSchedule` 污点 | 执行“恢复 control-plane 污点”中的命令 |
| 高可用集群启动缓慢 | 6 个节点容器同时启动，etcd 需要同步 | 增加等待时间与 Docker 资源 |
| 修改 YAML 后不生效 | Kind 不会热更新已有集群 | 删除并重新创建 |

导出日志：

```bash
kind export logs --name kind-multi ./kind-multi-logs
```
