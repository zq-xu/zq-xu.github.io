---
description: Kind（Kubernetes in Docker）本地 Kubernetes 集群：项目定位、架构机制、单节点与多节点部署，以及示例项目部署实践。
date: 2026-11-16
recommend: 1
tag:
 - Kind
tags:
 - Kubernetes
 - Docker
 - Kind
categories:
 - Open Source
---

# Kind

Kind 是用 Docker 容器承载 Kubernetes 节点的本地集群工具。它由 Kubernetes SIG Testing 维护，能够在一台主机上创建单节点或多节点集群，并保持与上游 Kubernetes 一致的行为。

## 文档导航

- [Kind 项目介绍](./introduction.md)：项目定位、总体架构、集群创建流程、网络与镜像机制、能力边界及同类工具对比。
- [Kind 单节点部署](./single-node-deployment.md)：安装、创建单节点集群、验证核心组件，并提供一键脚本。
- [Kind 多节点部署](./multi-node-deployment.md)：1 control-plane 加 2 worker，以及 3 control-plane 高可用布局。
- [在 Kind 中部署简单项目](./deploy-simple-app.md)：镜像构建与加载、Deployment、Service、探针、资源限制与一键部署脚本。

示例服务、Dockerfile、Kubernetes 清单和脚本位于仓库 [`docs/public/demos/kind`](https://github.com/zq-xu/zq-xu.github.io/tree/master/docs/public/demos/kind)。
