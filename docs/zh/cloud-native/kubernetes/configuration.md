---
hidden: true
date: 2022-12-29
---

# Kubernetes常用配置

## 增加节点

创建集群时控制台打印信息中含有新增节点的指令，可按照该指令增加节点至集群。

若遗失该指令，或`token`/`certificate-key`等参数过期，可参考如下方式重新生成指令：
- [增加Worker节点](#增加worker节点)
- [增加Master节点](#增加master节点)

### 增加Worker节点

在集群中任意Master节点通过以下命令生成join命令：
```bash
kubeadm token create --print-join-command

# 控制台打印信息如下：
kubeadm join kubernetes-vip:9443 --token grv9o6.75venx9x7sajjowp \
    --discovery-token-ca-cert-hash sha256:ea92e650eed7e5df76ab99ac545f61713d3f1ff9001a3281a1f5c71ece7309a5
```

::: warning
如果`token`过期，join命令需要重新生成。
:::

### 增加Master节点

- **步骤一**

先按照[增加Worker节点](#增加worker节点)的操作生成join命令。

- **步骤二**

在集群中任意Master节点执行以下节点生成`certificate-key`:
```bash
kubeadm init phase upload-certs --upload-certs
# 控制台输出如下：
[upload-certs] Storing the certificates in Secret "kubeadm-certs" in the "kube-system" Namespace
[upload-certs] Using certificate key:
1e610197e25fbb02e695db6124f21874ff865044cd17b2a3fe5ca73b0d8a791c
```

::: warning
`certificate-key`有效期为2h, 如果超过了2h, 需要重新生成。
:::

- **步骤三**

使用`--control-plane --certificate-key`将步骤一和步骤二中获取到的信息拼接：
```bash
kubeadm join kubernetes-vip:9443 --token grv9o6.75venx9x7sajjowp \
    --discovery-token-ca-cert-hash sha256:ea92e650eed7e5df76ab99ac545f61713d3f1ff9001a3281a1f5c71ece7309a5 \
    --control-plane --certificate-key 1e610197e25fbb02e695db6124f21874ff865044cd17b2a3fe5ca73b0d8a791c
```


## 移除节点
可使用如下指令从Kubernetes集群移除节点：
```bash
# 获取集群中的节点
kubectl  get nodes

# 移除指定节点
kubectl  delete nodes $nodeName
```

## 设置节点角色

- 将节点角色设置为`Master`：
```bash
kubectl label nodes $NodeName node-role.kubernetes.io/master=
```

- 将节点角色设置为`Worker`：
```bash
kubectl label nodes $NodeName node-role.kubernetes.io/node=
```

## 设置污点

为`Master`节点设置污点，从而工作负载`Pod`不会被调度到该`Master`节点上：
```bash
kubectl taint nodes $NodeName node-role.kubernetes.io/master=:NoSchedule
```

## 移除污点

移除`Master`节点的污点，从而工作负载`Pod`允许被调度到该`Master`节点上：
```bash
kubectl taint nodes $NodeName node-role.kubernetes.io/master-
```

## 配置Kubeconfig

从`Master`节点的`/etc/cloud-native/kubernetes/admin.conf`复制到目的节点上的$kubeconfigPath，然后参考以下脚本：
```bash
mkdir -p $HOME/.kube
sudo cp -i $kubeconfigPath $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

## 更改Kubelet工作路径

在Kubernetes环境中，`Pod`的卷、日志和其他一些信息将存储在节点的`Kubelet`工作路径中。

在Kubernetes节点上，默认的`Kubelet`工作路径是`/var/lib/kubelet`，如果该路径所在磁盘比较小，则不能运行很多`Pod`。如果需要将其修改为其他路径(如`/home/k8s/kubelet`)，则可参照以下步骤：

- **步骤一** 编辑`kubeadm.conf`,将`root-dir`标志添加到环境中：
```bash
vim /usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf

# find the Environment KUBELET_CONFIG_ARGS and add flag --root-dir=/home/k8s/kubelet
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml --root-dir=/home/k8s/kubelet"
```

- **步骤二** 重新加载守护进程
```bash
systemctl daemon-reload
重新启动多维数据集
```

- **步骤三** 重启`Kubelet`
```bash
systemctl restart kubelet
```

- **步骤四** 查看当前`Kubelet`工作路径
```bash
ps aux|grep kubelet|grep --  --root-dir

# 控制台打印如下信息，其中--root-dir对应值即为Kubelet的工作目录
root      58574  8.2  0.0 5980920 118788 ?      Ssl  00:03   2:29 /usr/bin/kubelet --bootstrap-kubeconfig=/etc/cloud-native/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/cloud-native/kubernetes/kubelet.conf --config=/var/lib/kubelet/config.yaml --root-dir=/home/k8s/kubelet --network-plugin=cni --pod-infra-container-image=registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.6
```

现在，当前节点的`Kubelet`工作路径已更改为`/home/k8s/kubelet`.
