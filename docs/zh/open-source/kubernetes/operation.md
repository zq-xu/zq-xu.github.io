---
recommend: 5
---

# Kubernetes常用操作

## 查看Kubelet日志

```bash
journalctl -xefu kubelet
```

## 强行删除Pod

```bash
kubectl -n $namespace delete pod $podName --force --grace-period=0
```