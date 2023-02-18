---
hidden: true
date: 2022-10-30
---

# 跳过健康检查为Pod分配Endpoints

Kubernetes中的Pod通常会绑定Service资源，Kubernetes通过Service资源来做网络转发、负载均衡等网络操作，使得用户无需知道Pod的实际ip，对Service资源发起的网络请求会被转发到相应的Pod.

在Kubernetes环境中，对于一般的Service资源，其与Pod绑定后，会生成相应的Endpoints资源，用户访问Service资源时，Service资源根据Endpoints资源上记录的Pod信息进行网络转发:
- Pod在准备就绪之后，pod的ip信息会被记录到该Endpoints资源上;
- Pod在未准备就绪时，pod的ip信息会被从Endpoints资源上移除。
    
Pod是否准备就绪，通常通过Pod的业务探针(ReadinessProbe)来进行判断。而Pod的业务探针往往需要在Pod启动一段时间之后(默认30s)才会生效。

对于某些业务场景而言，需要在初始化过程中使用到Pod的地址信息，并不需要等待Pod的业务服务就绪。因此需要Pod在创建时就分配Endpoints，这种情况下就需要跳过业务探针的健康检查。此处就需要设置service的“`spec.publishNotReadyAddresses`”字段，将该字段设置为true即可。

![publishNotReadyAddresses](/images/cloud-native/kubernetes/publish-not-ready-addresses.png)