---
hidden: true
date: 2022-12-29
---

# Kubernetes高可用集群安装

高可用K8S集群是指K8S的Master节点个数不少于3个，K8S管理面每个组件副本数不少于3个的Kubernetes集群。


## 整体架构
![Kubernetes高可用集群整体架构](/images/kubernetes/architecture-ha-k8s-cluster.png)

## 环境信息
- Master节点：
    - 192.168.100.13 cnserver20
    - 192.168.100.14 cnserver21
    - 192.168.100.15 cnserver22

- Worker节点：
    - 192.168.100.10 cnserver17
    - 192.168.100.11 cnserver18
    - 192.168.100.12 cnserver19

- 虚拟ip:
    - kubernetes-vip：192.168.100.99

::: tip
`kubernetes-vip`用于Keepalived的虚拟vip配置，与机器在同一网段，使用同一网卡
:::


## 配置服务器

### 基础环境配置

参考[Kubernetes集群-配置服务器](./kubernetes-cluster.md#配置服务器)。

### 配置/etc/hosts

配置/etc/hosts非必要操作，该配置是为了便于后续直接通过主机名称/vip名称进行操作，如不配置，后续操作中的域主机名称/vip名称需要替换成相应ip.

配置方式为在所有节点的`/etc/hosts`文件中添加节点信息和vip信息：
```
192.168.100.10 cnserver17
192.168.100.11 cnserver18
192.168.100.12 cnserver19

192.168.100.13 cnserver20
192.168.100.14 cnserver21
192.168.100.15 cnserver22

192.168.100.99 kubernetes-vip
```

## 安装Keepalived
Keepalived是一种高可用方案，通过VIP(虚拟IP)和心跳检测来实现高可用。

Keepalived通常有Master和Backup两个角色，一般情况下有1个master和多个backup.

Master会绑定VIP到自己网卡上，对外提供服务。

Master和Backup会定时确定对方状态，当Master不可用的时候，Backup会通知网关，并把VIP绑定到自己的网卡上，实现服务不中断，即为高可用。

### 环境信息

搭建Keepalied的机器(Kubernetes高可用集群的Master节点)：
- 192.168.100.13 cnserver20
- 192.168.100.14 cnserver21
- 192.168.100.15 cnserver22


### Keepalived配置文件

在每个节点上配置相应的keepalived.conf，见附件[Keepalived配置](/downloads/kubernetes/installation/Keepalived配置.zip)。

配置文件中需要修改的有如下部分：
```
……
vrrp_instance VI_1 {
  interface em3 # 此处通过ip addr命令根据实际填写，本机ip所在网卡

  state BACKUP# 一台节点配置为MASTER，其他节点配置为BACKUP

  unicast_src_ip 192.168.100.15  #设置本机内网ip
  
  #其他两台master ip
  unicast_peer {
        192.168.100.13
        192.168.100.14
  }

  virtual_ipaddress {
    192.168.100.99  # vip 虚拟ip
  }
……
```

### 容器启动Keepalived
```bash
# $keepalivedConfPath: keepalived.conf文件路径
docker run \
    --name=keepalived \
    --cap-add=NET_ADMIN \
    --cap-add=NET_BROADCAST \
    --cap-add=NET_RAW \
    --net=host \
    --restart=always \
    --volume $keepalivedConfPath:/container/service/keepalived/assets/keepalived.conf \
    -d osixia/keepalived:2.0.20 \
    --copy-service
```

## 安装HAProxy

HAProxy 是一款提供高可用性、负载均衡以及基于TCP（第四层）和HTTP（第七层）应用的代理软件。

HAProxy作为负载均衡时，可以按照指定策略（比如轮询）将流量转发到相应服务中。

例如当前Server有三个副本由HAProxy进行负载均衡，HAProxy可将客户端对Server的访问请求路由到这三个副本中的一个。这样做有以下好处：

- 避免所有请求集中转发到某个server，有效降低单个服务组件的压力;
- 当某个server副本宕机，HAProxy可将流量转发到健康的server端，从而保证服务的高可用。


### 环境信息
搭建HAProxy的机器(Kubernetes高可用集群的Master节点)：
- 192.168.100.13 cnserver20
- 192.168.100.14 cnserver21
- 192.168.100.15 cnserver22


### HAProxy配置文件
在每个节点上配置`haproxy.cfg`，见附件[HAProxy配置](/downloads/kubernetes/installation/haproxy.cfg)。

其中，主要的负载相关配置如下：
```
……
#---------------------------------------------------------------------
# main frontend which proxys to the backends
#---------------------------------------------------------------------
frontend  kubernetes-apiserver
    mode tcp
    bind *:9443  ## 监听9443端口
    # bind *:443 ssl # To be completed ....

    acl url_static       path_beg       -i /static /images /javascript /stylesheets
    acl url_static       path_end       -i .jpg .gif .png .css .js

    default_backend             kubernetes-apiserver

#---------------------------------------------------------------------
# round robin balancing between the various backends
#---------------------------------------------------------------------
backend kubernetes-apiserver
    mode        tcp  # 模式tcp
    balance     roundrobin  # 采用轮询的负载算法
# k8s-apiservers backend  # 配置apiserver，端口6443
 server cnserver20 192.168.100.13:6443 check
 server cnserver21 192.168.100.14:6443 check
 server cnserver22 192.168.100.15:6443 check
```

### 准备socket文件

准备一个空的文件夹路径`$statsDirPath`用于haproxy持久化stats文件。

### 容器启动HAProxy
```bash
# $haproxyConfDirPath: haproxy.conf文件所在文件夹路径
# $statsDirPath: 用于haproxy持久化stats文件的文件夹路径
docker run \
    --name=haproxy \
    --net=host \
    --restart=always \
    --volume $haproxyConfDirPath:/usr/local/etc/haproxy:ro \
    --volume $statsDirPath:/var/lib/haproxy \
    -d haproxy:2.3.6
```

### 查看HAProxy监控

在配置文件`haproxy.cfg`中定义了HAProxy的监控配置如下：
```
#---------------------------------------------------------------------
# haproxy monitor
#---------------------------------------------------------------------
listen admin_stats
        stats   enable
        bind    *:9445    #监听的ip端口号
        mode    http    #开关
        option  httplog
        log     global
        maxconn 10
        stats   refresh 30s   #统计页面自动刷新时间
        stats   uri /haproxy#访问的uri   ip:9445/haproxy
        stats   realm haproxy
        stats   auth admin:admin  #认证用户名和密码
        stats   hide-version   #隐藏HAProxy的版本号
        stats   admin if TRUE   #管理界面，如果认证成功了，可通过webui管理节点
```

容器启动之后可以在web上访问来查看haproxy的监控信息，访问地址如下：
```
# $ip: 由于容器启动命令中制定了--net=host，因此此处的$ip指HAProxy运行的主机的ip
# 登录用户名密码为配置中的`stats auth`指定，均为admin
http://$ip:9445/haproxy
```

## 安装Master节点

此处选择先安装Master节点`192.168.100.13 cnserver20`，从而完成高可用Kubernetes集群的初始化。

### 准备Kubeadm配置文件

Kubeadm的配置文件`kubeadm.yaml`内容如下：
```
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.23.1
imageRepository: registry.cn-hangzhou.aliyuncs.com/google_containers
controlPlaneEndpoint: "kubernetes-vip:9443"
networking:
  dnsDomain: cluster.local
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.211.0.0/12
```
::: tip
- `kubernetes-vip`为`/etc/hosts`文件中配置Keepalived虚拟IP域名，详见[配置/etc/hosts](#配置etchosts).
- 此处使用`Flannel`作为网络组件,对应的"podSubnet"为`10.244.0.0/16`；
- 若使用`Calico`作为网络组件,对应的"podSubnet"为`192.168.0.0/16`.
:::

### 执行初始化指令
```bash
kubeadm init --config kubeadm.yaml --upload-certs
```

::: warning
如果此前执行过以上脚本或者`Kubeadm`安装指令，则应在执行以上脚本之前执行以下命令：
```bash
kubeadm reset
```
:::

初始化完成后，将打印如下消息：
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

You can now join any number of the control-plane node running the following command on each as root:

  kubeadm join kubernetes-vip:9443 --token grv9o6.75venx9x7sajjowp \
        --discovery-token-ca-cert-hash sha256:ea92e650eed7e5df76ab99ac545f61713d3f1ff9001a3281a1f5c71ece7309a5 \
        --control-plane --certificate-key 1e610197e25fbb02e695db6124f21874ff865044cd17b2a3fe5ca73b0d8a791c

Please note that the certificate-key gives access to cluster sensitive data, keep it secret!
As a safeguard, uploaded-certs will be deleted in two hours; If necessary, you can use
"kubeadm init phase upload-certs --upload-certs" to reload certs afterward.

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join kubernetes-vip:9443 --token grv9o6.75venx9x7sajjowp \
        --discovery-token-ca-cert-hash sha256:ea92e650eed7e5df76ab99ac545f61713d3f1ff9001a3281a1f5c71ece7309a5
```

### 配置Kubeconfig

参考[Kubernetes集群-配置Kubeconfig](./kubernetes-cluster.md#配置kubeconfig).
### 安装Kubernetes网络组件

参考[Kubernetes集群-安装Kubernetes网络组件](./kubernetes-cluster.md#安装kubernetes网络组件)。

## 查看集群信息

参考[Kubernetes集群-查看集群信息](./kubernetes-cluster.md#查看集群信息)。

## 添加Master节点

集群初始化完成后打印出的信息中含有`--control-plane`参数的指令可用于添加`Master`节点。

在需要作为Master节点添加到集群中的节点上执行:
```bash
kubeadm join kubernetes-vip:9443 --token grv9o6.75venx9x7sajjowp \
      --discovery-token-ca-cert-hash sha256:ea92e650eed7e5df76ab99ac545f61713d3f1ff9001a3281a1f5c71ece7309a5 \
      --control-plane --certificate-key 1e610197e25fbb02e695db6124f21874ff865044cd17b2a3fe5ca73b0d8a791c
```

::: tip
- Kubeadm更多参数参考[Kubeadm参数](/zh/tools/kubeadm.md#参数);
- 若Token已过期，参考[重新生成增加节点的Token](../installation.md#重新生成增加节点的token);
- 若Certificate已过期，参考[重新生成增加节点的Certificate](../installation.md#重新生成增加节点的certificate);
- 添加Master节点之后，亦需要配置`Kubeconfig`，参考[配置Kubeconfig](../installation.md#配置kubeconfig).
:::

## 添加Worker节点

集群初始化完成后打印出的信息中不含有`--control-plane`参数的指令可用于添加`Worker`节点。

参考[Kubernetes集群-添加Worker节点](./kubernetes-cluster.md#添加worker节点)。

## 卸载Kubernetes集群

参考[Kubernetes集群-卸载Kubernetes集群](./kubernetes-cluster.md#卸载kubernetes集群)。