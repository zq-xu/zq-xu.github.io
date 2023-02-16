---
hidden: true
date: 2022-11-31
---

# Docker环境


[Docker官方文档](https://docs.docker.com/)

## 安装Docker

### 脚本安装
```bash
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

### 配置用户
```bash
sudo groupadd docker
sudo gpasswd -a $USER docker
newgrp docker 
```

### 启动Docker
```bash
systemctl start docker
```

## 配置Docker

Docker的配置文件通常为`/etc/docker/daemon.json`(不存在的话可以创建)。

::: warning
- JSON格式，格式错误Docker会启动不起来；
- 修改配置后通常需要[重启Docker](#重启docker)方可生效;
:::


### 配置镜像仓库
```bash
{
    "insecure-registries":[
        "$hostname"
    ]
}
```

## 重启Docker
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```