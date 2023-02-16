---
hidden: true
date: 2022-12-30
---

# Kubernetes集群安装

Kubernetes集群分为单Master节点集群和高可用集群:
- 单Master节点集群：一个Master节点和若干个Worker节点组成，常用于开发或测试环境；
- [高可用集群](./kubernetes-cluster-ha.md)：至少3个Master节点和若干Worker节点组成，常用于测试或生产环境。

本文使用`Kubeadm`工具在多台服务器之间安装单Master节点Kubernetes集群。

## 搭建环境

服务器信息如下：
- 192.168.1.241: centos 7.9, 用作Master节点
- 192.168.1.242: centos 7.9, 用作Worker节点
- 192.168.1.243: centos 7.9, 用作Worker节点

::: tip
可以通过指令`cat /etc/redhat-release`查看服务器系统信息
:::


## 配置服务器
在安装Kubernetes集群之前，我们需要在所有服务器上进行环境配置。

### 服务器基础配置

在安装 Kubernetes 集群之前，我们需要为所有服务器执行以下配置：
- 停止`Firewalld`；
- 禁止`SeLinux`；
- 关闭`Swap`；
- 为`k8s.conf`配置网络

以上操作可以通过执行以下脚本完成：
```bash
#!/bin/bash

# Stop the firewall and forbid starting the firewall after computer startup.
systemctl stop firewalld
systemctl disable firewalld

# Stop the SeLinux temporarily, lose efficacy after reboot.
setenforce 0
# Change the config of SeLinux, disable the SeLinux forever.
sed -i 's/^SELINUX=.*/SELINUX=disabled/' /etc/selinux/config

# Stop the Swap temporarily.
swapoff -a
# Change /etc/fstab, delete or annotate the mount of swap to stop the Swap forever.
sed -i '/swap/s/^/#/' /etc/fstab

# Change k8s.conf
cat <<EOF >  /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system
```

### 配置Yum源

如果使用中国大陆网络，则可以通过以下脚本配置Yum源，以避免拉取不到Kubernetes相关镜像的问题：
```bash
#!/bin/bash

# Install part of dependencies.
yum install -y yum-utils device-mapper-persistent-data lvm2

# Add docker yum source
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# Add kubernetes yum source
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF

# Cache the packages of added yum source.
yum makecache
```

### 配置Docker

此处使用`Docker`作为Kubernetes的容器运行时，安装Docker可参考[Docker安装](/zh/tools/docker.md)。

通过文件`/etc/docker/daemon.json`(如果没有，请创建)修改Docker配置：
```bash
{
  "graph": "/home/docker",
  "exec-opts": ["native.cgroupdriver=systemd"],
  "insecure-registries": ["192.168.1.240"],
  "registry-mirrors": ["https://b6ie2kuq.mirror.aliyuncs.com"]
}
```

参数说明：
- graph: Docker文件路径，用于Docker镜像等数据的保存，该路径尽量不要太小；
- exec-opts: Docker驱动,此处与Kubernetes保持一致，使用`systemd`；
- insecure-registries: 私有仓库，主要用于从私有仓库拉取或推送镜像；
- registry-mirrors: 镜像加速器，此处使用阿里云的镜像加速器，提升拉取镜像速度。

修改好配置文件之后，通过以下命令使配置生效：
```bash
systemctl daemon-reload
systemctl restart docker
```

### 安装Kubernetes相关工具

通过以下脚本安装`Kubeadm`、`Kubelet`和`Kubectl`工具：
```bash
#!/bin/bash

# Install related services for kubernetes.
yum install -y kubelet kubeadm kubectl

#Set the kubelet start Automatically
systemctl enable kubelet
systemctl start kubelet
```

## 安装Master节点

在Master节点上执行以下脚本安装Kubernetes环境(根据实际环境修改脚本中broadcast值)：
```bash
# should edit broadcast first
broadcast=192.168.1.255
host=`ifconfig -a|grep $broadcast|grep -v 127.0.0.1|grep -v inet6|awk '{print $2}'|tr -d "addr:"`
echo "host is $host"

# --apiserver-advertise-address: set the address of apiServer
# --image-repository: set the image repository, we use the repository of aliyuncs
# --pod-network-cidr: set the CIDR of pods network, we use the net 10.244 for the flannel
kubeadm init --apiserver-advertise-address=$host  \
--image-repository registry.aliyuncs.com/google_containers  \
--pod-network-cidr=10.244.0.0/16
```

::: warning
如果此前执行过以上脚本或者`Kubeadm`安装指令，则应在执行以上脚本之前执行以下命令：
```bash
kubeadm reset
```
:::

安装完成后，将打印如下消息：
```bash
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.1.241:6443 --token 8kfjbo.fhitoq5xe0oc69x3 \
	--discovery-token-ca-cert-hash sha256:9a8f0ac267ab413da6e4d07b102764b33d5e4c25342a3e2c646adf4a778241ea 
```
### 配置Kubeconfig

根据Master节点安装完成后的打印信息配置`Kubeconfig`,方可使用`Kubectl`指令：
```bash
# 根据用户身份选择执行

# 非root用户
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# root用户
export KUBECONFIG=/etc/kubernetes/admin.conf
```

### 安装Kubernetes网络组件
根据Master节点安装完成后的打印信息安装网络组件，此处选择`Flannel`（Kubernetes v1.17+）:
```bash
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

# 以上指令若不可用，可分开执行，如下：
wget  https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
kubectl apply -f kube-flannel.yml
```

::: tip 网络组件应与安装步骤中的网络匹配
[安装Master节点](#安装master节点)中的`pod-network-cidr=10.244.0.0/16` 匹配`Flannel`网络。
:::

## 查看集群信息
### 查看Pod信息
```bash
kubectl get po -A

# 控制台打印如下信息：
NAMESPACE     NAME                           READY   STATUS    RESTARTS   AGE
kube-system   coredns-7f6cbbb7b8-dgpnw       1/1     Running   0          55s
kube-system   coredns-7f6cbbb7b8-shr25       1/1     Running   0          55s
kube-system   etcd-ib-1                      1/1     Running   1          68s
kube-system   kube-apiserver-ib-1            1/1     Running   1          68s
kube-system   kube-controller-manager-ib-1   1/1     Running   1          67s
kube-system   kube-proxy-mx2ll               1/1     Running   0          55s
kube-system   kube-scheduler-ib-1            1/1     Running   1          68s
```

### 查看节点信息
```bash
kubectl get nodes -owide

# 控制台打印如下信息：
NAME   STATUS   ROLES                  AGE   VERSION   INTERNAL-IP      EXTERNAL-IP   OS-IMAGE                KERNEL-VERSION           CONTAINER-RUNTIME
ib-1   Ready    control-plane,master   15m   v1.23.4   192.168.1.241   <none>        CentOS Linux 7 (Core)   3.10.0-1160.el7.x86_64   docker://20.10.12
```

## 添加Worker节点

根据Master节点安装完成后的打印信息可以将Worker节点加入到Master节点所在Kubernetes集群。

在需要加入的Worker节点上执行以下指令(指令取自Master节点安装完成后的打印信息)：
```bash
kubeadm join 192.168.1.241:6443 --token 8kfjbo.fhitoq5xe0oc69x3 \
	--discovery-token-ca-cert-hash sha256:9a8f0ac267ab413da6e4d07b102764b33d5e4c25342a3e2c646adf4a778241ea 
```

::: tip 
- Kubeadm更多参数参考[Kubeadm参数](/zh/tools/kubeadm.md#参数);
- 若Token已过期，参考[重新生成增加节点的Token](../installation.md#重新生成增加节点的token);
- 添加Worker节点之后，亦需要配置`Kubeconfig`，参考[配置Kubeconfig](../installation.md#配置kubeconfig).
:::


## 卸载Kubernetes集群
在服务器上执行以下脚本，卸载当前服务器上的Kubernetes环境：

```bash
kubeadm reset -f
modprobe -r ipip
lsmod
rm -rf ~/.kube/
rm -rf /etc/kubernetes/
rm -rf /etc/systemd/system/kubelet.service.d
rm -rf /etc/systemd/system/kubelet.service
rm -rf /usr/bin/kube*
rm -rf /etc/cni
rm -rf /opt/cni
rm -rf /var/lib/etcd
rm -rf /var/etcd

yum remove -y kubelet kubeadm kubectl

ifconfig cni0 down
ip link delete cni0
```

::: tip 
如果修改了`Kubelet`的工作路径，记得手动清理。(参考[更改Kubelet工作路径](../installation.md#更改Kubelet工作路径))
:::



