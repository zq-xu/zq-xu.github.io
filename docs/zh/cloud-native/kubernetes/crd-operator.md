---
hidden: true
date: 2022-12-28
---

# CRD && Operator

`CRD && Operator`是指使用[CRD](#crd)来定义资源属性并由[Operator](#operator)服务组件进行解析和管理。
## CRD

[CRD(Custom Resource Definition)](https://kubernetes.io/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions)是 Kubernetes（v1.7+）为提高可扩展性，让开发者去自定义资源的一种方式。其存在形式与Pod、Service等Kubernetes原生资源相同，都是可以解析为`yaml`或`json`的属性集合。

## Operator

[Operator](https://kubernetes.io/zh-cn/docs/concepts/extend-kubernetes/operator/)是Kubernetes的一种扩展模式，可以监听Kubernetes环境中的资源变化(增删改等事件)，并快速做出反应。`Operator`通常由开发者自定义操作逻辑，以微服务的形式部署于kubernetes环境中。


`Operator`常用于解析`CRD`，可以将`CRD`资源解析为一系列Kubernetes原生资源、更新`CRD`状态等。

