---
date: 2022-12-31
---

# Minikube集群安装

Minikube是单节点的Kubernetes环境，常用于学习使用或作为开发环境。

## 搭建环境

服务器信息和基础环境如下：
- OS: Linux
- Kubectl: v1.22.3
- Minikube: v1.24.0
- Golang: 1.15.15
- Docker: 1.41 ([Docker安装](/zh/tools/docker.md))

::: tip
如果使用中国境内网络，为避免网络影响，可以设置GOPROXY为以下任意一个：
- export GOPROXY="https://proxy.golang.org,direct"
- export GOPROXY="https://goproxy.cn"
:::

## 安装Kubectl

- **步骤一** 下载二进制文件

```bash
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
```

- **步骤二** 修改二进制文件权限及路径

```bash
sudo chmod +x kubectl 
sudo mv ./kubectl /usr/local/bin/kubectl
```

## 安装Minikube
- **步骤一** 下载二进制文件

```bash
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
```


- **步骤二** 修改二进制文件权限及路径

```bash
sudo chmod +x minikube
sudo install minikube /usr/local/bin/
```

- **步骤二** 安装依赖工具`conntrack`

```bash
sudo yum install conntrack
```

## 使用Minikube启动集群

```bash
minikube start --vm-driver=none --image-repository=registry.cn-hangzhou.aliyuncs.com/google_containers
```

启动参数说明：
- --vm-driver: 虚拟机驱动，如果使用本地服务器环境启动，设置为node即可；
- --image-repository: 指定镜像仓库源，主要用于中国网络/私有网络无法访问google镜像的场景；
- --kubernetes-version: 指定Kubernetes版本，如"v1.18.20"；

## 查看集群状态

```bash
minikube status

## 健康的集群状态示例如下：
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

## 配置Kubeconfig

配置`Kubeconfig`,方可使用`Kubectl`指令直接操作Kubernetes集群：

- **步骤一** 修改二进制文件权限及路径
```bash
# USER: 操作用户的名称，取自环境变量$USER即可
# HOME: 操作用户的HOME路径，取自环境变量$HOME即可
sudo mv /root/.kube /root/.minikube $HOME
sudo chown -R $USER $HOME/.kube $HOME/.minikube
```

- **步骤二** 修改文件`$HOME/.kube/config`,将其中的"/root"字段修改为`$HOME`对应路径。

## 可视化界面

`Minikube Dashboard`是使用Minikube启动的Kubernetes自带的可视化界面，可使用以下指令启动：
```bash
minikube dashboard --url

# 启动成功示例如下：
* Verifying dashboard health ...
* Launching proxy ...
* Verifying proxy health ...
http://127.0.0.1:44509/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/
```

在安装Minikube的执行机上，使用本地浏览器中访问打印信息中的地址即可。

若需要在非安装机器上远程访问可视化界面，则可以使用`Kubectl`指令开启访问代理：
```bash
# 指定执行机的8001号端口作为代理
 nohup kubectl proxy --port=8001  --address='0.0.0.0' --accept-hosts='^*$'  >/dev/null 2>&1&
```

开启代理之后，即可使用以下地址远程访问可视化界面(ip为执行机ip)：
```bash
http://$ip:8001/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/
```

