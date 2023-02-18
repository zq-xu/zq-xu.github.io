---
sticky: 999
hidden: true
date: 2022-12-31
---

# Kubernetes基础

## 概览

[Kubernetes](https://kubernetes.io/zh-cn/docs/home/)是:
- Google基于[Borg](https://research.google/pubs/pub43438/) 开源的容器编排引擎，提供了面向应用的容器部署和管理系统。
- [CNCF(Cloud Native Computing Foundation)](https://www.cncf.io/)的核心组件，被誉为云时代的操作系统。
- 目前使用最广泛的容器编排方案，在容器编排、服务治理、DevOps等诸多领域有着深远影响。

Kubernetes作为容器编排引擎，简单来说就是负责容器的网络、存储、资源、权限、调度等全生命周期管理。
其本质上是一些以容器形式存在的微服务组件，主要分为负责存储、调度、API等功能的管理面组件和用于网络处理、任务执行的客户端组件。

Kubernetes往往由多台节点组成集群，这些节点主要分为两类：
- Master节点（常简称为`Master`）：主要用于部署Kubernetes管理面组件；
- Worker节点(常简称为`Node`)：主要用于部署工作负载(需要运行的业务应用)。

::: tip
- Kubernetes的管理面组件只运行在Master节点上；
- Kubernetes的客户端组件在每个节点上都会有一个实例；
- 工作负载可以运行在所有节点上，也可以通过配置使工作负载只运行在Worker节点上。
:::

Kubernetes也可以部署在单台节点上([Minikube](./installation/minikube.md))，或者部署在单个容器里([Kind](https://kind.sigs.k8s.io/))。

## 架构概览

![Kubernetes高可用集群整体架构](/images/cloud-native/kubernetes/kubernetes-high-level-component-archtecture.jpeg)


## 核心组件

- [Etcd](https://kubernetes.io/zh-cn/docs/concepts/overview/components/#etcd): 集群数据的后台数据库，保存了整个集群的状态；
- [ApiServer](https://kubernetes.io/zh-cn/docs/concepts/overview/components/#kube-apiserver): 提供了资源操作的唯一入口，并提供认证、授权、访问控制、API 注册和发现等机制；
- [Controller Manager](https://kubernetes.io/zh-cn/docs/concepts/overview/components/#kube-controller-manager): 负责维护集群的资源和状态，比如资源管理、故障检测等；
- [Scheduler](https://kubernetes.io/zh-cn/docs/concepts/overview/components/#kube-scheduler): 负责资源的调度，按照预定的调度策略将Pod调度到相应的机器上；
- [Kubelet](https://kubernetes.io/zh-cn/docs/concepts/overview/components/#kubelet): 负责维护容器的生命周期，同时也负责Volume(CSI)和网络(CNI)的管理；
- [KubeProxy](https://kubernetes.io/zh-cn/docs/concepts/overview/components/#kube-proxy): 负责提供集群内部的服务发现和负载均衡，使用EBPF网络时可以没有此组件；
- [CoreDNS](https://kubernetes.io/zh-cn/docs/concepts/overview/components/#dns): 负责为整个集群提供DNS服务；

## 常用插件
- [CRI](https://kubernetes.io/zh-cn/docs/concepts/architecture/cri/): 容器运行时接口，负责容器的真正运行，常用`Docker`或`Podman`等；
- [CNI](https://kubernetes.io/zh-cn/docs/concepts/cluster-administration/networking/):容器网络接口，负责集群网络，默认使用`Flannel`，常用的还有`Calico`、`Cilium/EBPF`；
- [CSI](https://kubernetes-csi.github.io/docs/): 容器存储接口，主要负责文件系统的容器挂载，常用`LocalPath`、`NFS`、`Ceph`等；
- [Ingress Controller](https://kubernetes.io/zh-cn/docs/concepts/services-networking/ingress-controllers/): 为服务提供内部自定义域名和外网入口，常用`Nginx`等。

## 学习干货

- [32深入剖析Kubernetes.zip](/downloads/cloud-native/kubernetes/32-dinglei-study-kubernetes.zip)