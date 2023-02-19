---
date: 2022-11-26
---

# Helm仓库

Helm仓库是用来存放Chart包的平台。

`Chartmuseum`是常用来作为Helm仓库的工具，本文使用容器的方式来进行本地搭建。

## 安装Helm仓库

### 环境准备

- 安装机器：Linux系统服务器
- Helm工具：参考[安装Helm工具](./helm.md#安装helm工具)
- Helm Push插件：参考[安装Helm Push插件](./helm-push.md#安装helm-push插件)


### 本地持久化路径

准备用于Helm仓库的数据持久化的本地路径`$chartLocalPath`，并给予读写权限：
```bash
chmod -R 777 $chartLocalPath
```

### 容器启动Chartmuseum

```bash
# $chartLocalPath: 用于Helm仓库的数据持久化的本地路径
docker run 
  --name=chartmuseum \
  --restart=always -it -d \
  -p 8090:8080 \
  -e DEBUG=1 \
  -v $chartLocalPath:/charts \
  -e STORAGE=local \
  -e STORAGE_LOCAL_ROOTDIR=/charts \
  ghcr.io/helm/chartmuseum:v0.13.0
```

::: 参数说明
- 端口映射：本地`8090`端口映射到容器`8080`端口，可使用本地`8090`端口访问Helm仓库；
- Chartmuseum版本：此处使用`Chartmuseum`版本号为`v0.13.0`；
:::


## 使用Helm仓库

### 添加Helm仓库

将容器启动的`Chartmuseum`作为Helm仓库添加到本地`Helm`中：
```bash
# $ip: 本机ip
helm repo add chartmuseum  http://$ip:8090
```

### 上传Chart包至Helm仓库

参考[使用Helm Push插件上传Chart包](./helm-push.md#使用helm-push插件上传chart包)



### 清理Helm仓库中的Chart包

如果需要清理Helmc仓库中的多余chart包，可按照以下步骤完成：
- **步骤一** 进入仓库的chart包的持久化存储路径，删除该路径下需要清理的chart包；

- **步骤二** 在仓库的chart包的持久化存储路径中，删除名为”index-cache.yaml”的文件；

- **步骤三** 重启Helm仓库服务，如果是在容器中运行，使用如下指令重启该容器即可:
    ```bash
    # $containerID: 容器ID
    docker restart $containerID
    ```



