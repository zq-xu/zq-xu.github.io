---
description: 从零创建并验证一个 Kind 单节点 Kubernetes 集群：安装依赖、生成配置、创建集群、验证核心组件、访问与数据持久化，并附一键脚本与故障排查。
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

# Kind 单节点部署

Kind 单节点集群在一台主机上提供完整的 Kubernetes 环境。一个 control-plane 节点同时承担集群管理与工作负载运行职责，适合本地开发、清单调试和 CI 冒烟测试。

单节点集群不提供高可用，也无法模拟多机故障。它的价值在于以最低成本验证集群能否正常启动、核心组件是否就绪，以及工作负载的基本行为。

以下步骤从安装依赖开始，到清理集群结束，命令统一以集群名 `kind-single`、kubectl context `kind-kind-single` 为例。集群架构与创建流程见 [Kind 项目介绍](./introduction.md)。

## 单节点集群的形态

### 单节点仍是完整集群

单节点集群仍然是一个完整的 Kubernetes 集群：一个节点同时承担 control-plane 与 worker 的职责，API Server、etcd、调度器、控制器管理器、kubelet、containerd、kube-proxy 都运行在同一个节点容器里。

因此单节点可以验证绝大多数清单和控制器行为，但无法验证跨节点调度、节点故障转移和多机网络。

### 节点角色与污点

Kind 创建的单节点集群只有一个 `control-plane` 角色。Kind 默认去掉 control-plane 的 `NoSchedule` 污点，使业务 Pod 可以直接调度到这个节点，否则单节点集群将没有可运行工作负载的节点。

这个默认行为也意味着：单节点上观察到的调度结果，不能直接代表生产环境中“control-plane 不运行工作负载”的行为。

### 节点镜像决定 Kubernetes 版本

Kind 的 Kubernetes 版本由节点镜像决定，而不是由宿主机上的 kubectl 决定。本系列使用的节点镜像为：

```text
kindest/node:v1.37.0
```

`v1.37.0` 是节点镜像标签，对应 Kubernetes v1.37.0。创建集群时保持同一标签，节点版本就不会变化。

### kubeconfig 与 context

Kind 把集群访问配置写入 `~/.kube/config`，context 名为 `kind-<集群名>`。默认集群名是 `kind`，所以不指定 `--name` 时 context 是 `kind-kind`。

多个集群并存时，所有操作都应带 `--context`：

```bash
kubectl --context kind-kind-single get nodes
```

## 先决条件

| 项目 | 要求 |
| --- | --- |
| 操作系统 | macOS 或 Linux；Windows 使用 Docker Desktop + WSL2，命令在 WSL2 终端执行 |
| Docker | 25 及以上，引擎正在运行 |
| Kind | `v0.33.0` |
| kubectl | `1.37.x` |
| 资源 | 至少 2 CPU、4 GB 内存分配给 Docker；建议 8 GB |

## 安装依赖

Kind 不提供容器运行时：Docker 提供节点容器，Kind 负责创建集群，kubectl 负责访问集群，三者需要分别安装。版本号与上表保持一致。

### macOS

```bash
brew install --cask docker-desktop
open -a Docker

# wait for Docker Desktop to finish its first start and authorization
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

### 安装检查

三个命令都能返回版本号，Docker 桌面图标处于运行状态：

```bash
kind version
docker info
kubectl version --client
```

## 创建集群

单节点配置模板位于 [`installation/single-node/yaml/kind-single.yaml`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/single-node/yaml/kind-single.yaml)。模板中的 `${NODE_IMAGE}` 与 `${DATA_DIR}` 由同目录的 [`render-config.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/single-node/yaml/render-config.sh) 替换，节点镜像默认 `kindest/node:v1.37.0`，数据目录默认 `${HOME}/.kind-single-node`。

生成配置（脚本会创建数据目录，并输出 `installation/single-node/yaml/kind-single.local.yaml`，该文件不入库）：

```bash
cd zq-xu.github.io/docs/public/demos/kind
./installation/single-node/yaml/render-config.sh
```

需要自定义数据目录时，用环境变量覆盖：

```bash
cd zq-xu.github.io/docs/public/demos/kind
DATA_DIR="${HOME}/.kind-single-node-test" \
  ./installation/single-node/yaml/render-config.sh
```

创建集群：

```bash
kind create cluster \
  --name kind-single \
  --config installation/single-node/yaml/kind-single.local.yaml \
  --wait 120s
```

`--wait 120s` 让命令阻塞到 control plane 就绪，避免脚本在集群尚未就绪时继续执行。该参数不代表节点已 `Ready`，节点状态需要在下一步单独等待。

## 验证集群

按“集群存在 → API 可达 → 节点就绪 → 系统组件正常 → 默认存储就绪”的顺序检查：

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

期望结果：

- `kind get clusters` 输出 `kind-single`；
- 节点状态为 `Ready`；
- `kube-system` 下的核心 Pod 为 `Running`；
- StorageClass 列表中存在 `standard (default)`。

单节点集群启动后，`kube-system` 命名空间通常包含以下组件：

| 组件 | 作用 |
| --- | --- |
| `kube-apiserver` | 集群 API 入口 |
| `etcd` | 集群状态存储 |
| `kube-scheduler` | Pod 调度 |
| `kube-controller-manager` | 控制器循环 |
| `coredns` | 集群 DNS |
| `kindnet` | 默认 CNI |
| `kube-proxy` | Service 转发 |
| `local-path-provisioner` | 默认 StorageClass `standard` |

不同 Kind 版本可能略有差异，以 `kubectl get pods -A` 的实际输出为准。

可选的 DNS 冒烟测试，能解析 `kubernetes.default` 说明集群 DNS 与 Service 网络正常：

```bash
kubectl --context kind-kind-single run dns-test \
  --image=busybox:1.36 --restart=Never --rm -i --command \
  -- nslookup kubernetes.default
```

## 从宿主机访问集群

Kind 把 API Server 端口映射到宿主机，kubeconfig 中记录的是宿主机可访问的地址。业务端口不会自动暴露：

- 临时访问 Service：`kubectl port-forward svc/<name> <本地端口>:<服务端口>`，不修改集群配置，适合开发与验证；
- 固定端口：在集群配置中声明 `extraPortMappings`，把宿主机端口映射到节点容器端口；
- macOS 与 Windows 上节点容器 IP 不可从宿主机直接路由，必须使用端口映射或 `port-forward`。

## 数据持久化

默认 StorageClass `standard` 把 PVC 数据写入节点容器的 `/var/local-path-provisioner`。上面的配置已把该路径映射到宿主机的 `${HOME}/.kind-single-node`，因此 PVC 数据实际存放在这个宿主机目录。

创建一个 PVC 和写入测试 Pod。清单位于 [`installation/single-node/yaml/pvc-check.yaml`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/single-node/yaml/pvc-check.yaml)：

```bash
kubectl --context kind-kind-single apply \
  -f zq-xu.github.io/docs/public/demos/kind/installation/single-node/yaml/pvc-check.yaml
```

确认数据已写入容器内与宿主机目录：

```bash
kubectl --context kind-kind-single wait \
  --for=condition=Ready pod/host-data-check --timeout=120s

kubectl --context kind-kind-single exec host-data-check -- cat /data/check.log
find "${HOME}/.kind-single-node" -maxdepth 2 -type f -name check.log
```

停止并重新启动节点容器，再读取同一个文件。[`restart-node.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/single-node/scripts/restart-node.sh) 按集群名查找节点容器，并在启动后等待节点就绪：

```bash
cd zq-xu.github.io/docs/public/demos/kind
./installation/single-node/scripts/restart-node.sh
```

等待业务 Pod 重新就绪并读取数据：

```bash
kubectl --context kind-kind-single wait \
  --for=condition=Ready pod/host-data-check --timeout=180s
kubectl --context kind-kind-single exec host-data-check -- cat /data/check.log
```

`kind delete cluster` 会删除节点容器、etcd 和 PV/PVC 对象；宿主机 `${HOME}/.kind-single-node` 中的文件仍在，但新集群不会自动识别旧 PVC。只停止再启动节点容器时，集群对象和 PVC 都会保留。

测试完成后不要直接删除 PVC，除非确认数据不再需要；默认 StorageClass 的回收策略是 `Delete`。

## 一键脚本

[`kind-single-node.sh`](https://github.com/zq-xu/zq-xu.github.io/blob/master/docs/public/demos/kind/installation/single-node/scripts/kind-single-node.sh) 把上面的步骤串成一次执行：

```bash
cd zq-xu.github.io/docs/public/demos/kind
./installation/single-node/scripts/kind-single-node.sh
```

脚本按顺序完成：

1. 检查 Docker 与 kubectl，Docker 未运行时直接报错退出；
2. 本机没有 `kind` 时，下载 `v0.33.0` 到 `~/.local/bin`；
3. 在临时目录生成带宿主机目录挂载的集群配置，集群不存在时创建 `kind-single`，已存在则复用；
4. 等待所有节点 `Ready`；
5. 打印节点、StorageClass 与系统 Pod。

默认数据目录是 `${HOME}/.kind-single-node`。脚本是幂等的：重复执行不会删除已有集群。需要重建时先执行：

```bash
kind delete cluster --name kind-single
```

可用环境变量覆盖默认值：

```bash
CLUSTER_NAME=kind-dev \
DATA_DIR="${HOME}/.kind-single-node-test" \
NODE_IMAGE=kindest/node:v1.36.4 \
./installation/single-node/scripts/kind-single-node.sh
```

## 清理

```bash
kind delete cluster --name kind-single
```

删除会移除节点容器、Docker 网络、etcd 和 kubeconfig 中对应的 context。宿主机挂载目录 `${HOME}/.kind-single-node` 中的文件不会自动删除，但新集群不会自动识别旧 PVC 和旧集群对象。

## 故障排查

| 现象 | 常见原因 | 处理 |
| --- | --- | --- |
| `Cannot connect to the Docker daemon` | Docker 未启动或当前用户无权限 | 启动 Docker Desktop / `dockerd`，确认 `docker info` 可用 |
| 拉取节点镜像失败 | 网络无法访问 Docker Hub | 先手动 `docker pull` 节点镜像，或配置镜像加速 |
| `timed out waiting for control plane` | Docker 内存不足、`inotify` 限额过低 | 提高 Docker 内存到 8 GB；按官方 known issues 调整 `fs.inotify.*` |
| 节点持续处于 `NotReady` | CNI 未就绪或节点启动失败 | `kubectl describe node`，并 `kind export logs --name kind-single` |
| `bind: address already in use` | 宿主机端口被其他集群或进程占用 | 删除旧集群，或在配置中改用其他 `hostPort` |
| kubectl 找不到 context | kubeconfig 未合并或使用了错误的 `KUBECONFIG` | `kind export kubeconfig --name kind-single` |

创建失败时保留现场再导出日志：

```bash
kind create cluster --name kind-debug --retain --wait 120s
kind export logs --name kind-debug ./kind-logs
```

## 常见误区与资源边界

| 误区 | 实际行为 | 正确做法 |
| --- | --- | --- |
| 单节点可以验证高可用 | 只有一个 etcd 与一个 control-plane，没有故障转移 | 高可用验证使用 3 control-plane 配置 |
| 创建成功就代表节点可用 | `--wait` 只等到 control plane 就绪 | 再执行 `kubectl wait --for=condition=Ready nodes` |
| 本地镜像可以直接被 Pod 使用 | 节点内是独立的 containerd，看不到宿主机 Docker 镜像 | 先 `kind load docker-image` |
| 删除集群后数据还在 | 节点容器被删除，容器内数据随容器消失 | 创建集群时把存储路径挂载到宿主机目录 |
| 旧版 Kind 可以运行任意新节点镜像 | Kind 与节点镜像存在兼容范围 | 按 release notes 选择匹配版本 |

单节点还有两个资源边界：

- Docker Desktop 的内存上限就是集群上限；低于 4 GB 时，单节点也可能因内存不足启动失败；
- 容器共享宿主机内核与 `inotify` 限额；节点较多或监听文件较多时，需要调整宿主机 `fs.inotify.max_user_watches`。

## 命令与参数速查

| 参数 / 命令 | 含义 |
| --- | --- |
| `--name` | 集群名，决定容器名前缀与 kubectl context |
| `--image` | 节点镜像，决定 Kubernetes 版本与架构 |
| `--wait` | 等待 control plane 就绪的超时时间，必须带单位 |
| `--config` | 使用 YAML 配置节点、网络和端口映射 |
| `kind get clusters` | 列出本机所有 Kind 集群 |
| `kind export kubeconfig` | 重新导出指定集群的 kubeconfig |
| `kind delete cluster` | 删除集群容器、网络与 kubeconfig 条目 |
| `kind export logs` | 导出节点日志，用于创建失败排查 |


