---
hidden: true
date: 2022-12-23
---

# FAQ

## 安装Kubernetes遇到CNI冲突问题

使用如下指令移除CNI后重新安装：

```
ifconfig cni0 down
ip link delete cni0
```