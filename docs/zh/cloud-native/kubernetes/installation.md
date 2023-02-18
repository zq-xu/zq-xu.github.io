---
hidden: true
date: 2022-12-30
---

# Kubernetes安装

## Kubernetes安装

- [安装Minikube集群](./installation/minikube.md)： 单节点Kubernetes环境，常用于学习使用或作为开发环境。
- [安装Kubernetes集群](./installation/kubernetes-cluster.md)：一个Master节点和若干Worker节点组成，常用于开发或测试环境。
- [安装Kubernetes高可用集群](./installation/kubernetes-cluster-ha.md)：至少3个Master节点和若干Worker节点组成，常用于测试或生产环境。

## CSI安装
- [安装LocalPath CSI](./installation/csi-localpath.md): 使用宿主机本地路径作为存储类；
- [安装Ceph CSI](./installation/csi-ceph.md): 使用`Ceph`存储作为存储类；
- [安装NFS CSI](./installation/csi-nfs.md): 使用`NFS`存储作为存储类；


## CNI安装
- [安装Calico CNI](./installation/cni-calico.md): 使用`Calico`作为集群网络框架；
- [安装Cilium/EBPF CNI](./installation/cni-cilium-ebpf.md): 使用Cilium/EBPF`作为集群网络框架；

## FAQ
- [安装Kubernetes遇到CNI冲突问题](./installation/faq.md#安装kubernetes遇到cni冲突问题)