---
date: 2022-10-31
---

# StatefulSet资源的Pod域名解析延迟问题验证

在k8s环境中，服务地址常常以域名表示，需要k8s环境中DNS进行解析。

K8S环境中的DNS通常使用CoreDNS，其存在30s缓存。

因此，新创建的StatefulSet资源生成的Pod实例对应的headless service域名常常需要在pod创建完成之后30s左右的时间才可以被解析。

## 官方解释

[Stable Network ID](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#stable-network-id)，整体可参考下图：

![statefulset-stable-network-id](/images/cloud-native/kubernetes/statefulset-stable-network-id.png)

## 操作体验

根据官方文档说明，在pod启动后解析pod域名，并调整CoreDNS的缓存时间，检查解析时间是否变化。

### 启动后域名解析

StatefulSet资源生成的Pod实例启动后解析本Pod的域名。解析脚本如下：
``` sh
#!/bin/sh
waitSeconds=0
while :
do
  parse=$(nslookup ddb-xzq-dn-0-0.ddb-xzq-dn.develop.svc.cluster.local)
  result=$(echo $parse | grep "server can't find")
  if [[ "$result" != "" ]]
  then
    sleep 1
    let waitSeconds++
    echo "wait... ${waitSeconds}s"
  else
    echo "$parse"
    exit 1
  fi
done
```

Pod启动后日志如下：

```
wait... 1s
wait... 2s
wait... 3s
wait... 4s
wait... 5s
wait... 6s
wait... 7s
wait... 8s
wait... 9s
wait... 10s
wait... 11s
wait... 12s
wait... 13s
wait... 14s
wait... 15s
wait... 16s
wait... 17s
wait... 18s
wait... 19s
wait... 20s
wait... 21s
wait... 22s
wait... 23s
wait... 24s
wait... 25s
wait... 26s
wait... 27s
wait... 28s
wait... 29s
wait... 30s
Server:		10.96.0.10
Address:	10.96.0.10:53

Name:	ddb-xzq-dn-0-0.ddb-xzq-dn.develop.svc.cluster.local
Address: 172.17.0.27
```

## 修改CoreDNS缓存时间

查看CoreDNS缓存：

```
$ kubectl -nkube-system get cm coredns -oyaml
apiVersion: v1
data:
  Corefile: |
    .:53 {
        errors
        health {
           lameduck 5s
        }
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           pods insecure
           fallthrough in-addr.arpa ip6.arpa
           ttl 30
        }
        prometheus :9153
        hosts {
           127.0.0.1 host.minikube.internal
           fallthrough
        }
        forward . /etc/resolv.conf {
           max_concurrent 1000
        }
        cache 30
        loop
        reload
        loadbalance
    }
kind: ConfigMap
metadata:
  creationTimestamp: "2022-05-26T08:41:00Z"
  name: coredns
  namespace: kube-system
  resourceVersion: "8885014"
  uid: 2b7d5f37-c8d9-428f-a250-df9fd3cb18dc
```

将第24行的”cache 30”修改为”cache 10”.

## 重新创建Pod

重启创建Pod并查看Pod日志：

```
wait... 1s
wait... 2s
wait... 3s
wait... 4s
wait... 5s
wait... 6s
wait... 7s
wait... 8s
wait... 9s
wait... 10s
Server:		10.96.0.10
Address:	10.96.0.10:53

Name:	ddb-xzq-dn-0-0.ddb-xzq-dn.develop.svc.cluster.local
Address: 172.17.0.27
```

由此可见，StatefulSet资源的Pod资源对应的Pod域名解析时间基本与CoreDNS缓存时间一致，验证官方解释。