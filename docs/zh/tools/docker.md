---
date: 2022-11-31
---

# Docker

- [Docker官方文档](https://docs.docker.com/)
- Docker实践可参考[Docker-从入门到实践](https://github.com/yeasy/docker_practice)

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

## Docker常用指令

### 特权模式下以entrypoint命令运行镜像

```sh
docker run --privileged=true -d --entrypoint sh $image -c "sleep 9999" 
```

### 指定端口和volume挂载运行镜像

```sh
docker run --name $name -p $hostPort:$containerPort -v $hostPath:$containerPath -d $image /bin/sh "sleep 999"
```

### 删除所有tage为none的容器

```sh
docker images|grep none|awk '{print $3}'|xargs docker rmi -f
```

### 容器转储为tgz文件

```sh
docker save $image1 $image2 | gzip > $name.tgz
```

### 登录docker仓库

```sh
docker login $hostname -u $name -p $password
```

### 查看Docker服务日志

```sh
journalctl -u docker --no-pager
```

### 为当前用户赋予Docker权限

```sh
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker 
```
