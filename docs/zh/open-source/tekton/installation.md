---
date: 2022-10-31
tag:
 - Tekton
tags:
 - Kubernetes
categories:
 - DevOps
---

# Tekton安装

## 概览

Tekton 是Kubernetes环境中常用的 CI/CD 工具，其主要提供了流水线功能，便于开发者进行项目打包。

Tekton环境主要包括以下内容：

- tekton-pipeline:
    - tekton-pipeline-controller:主要用于流水线的流程控制
    - tekton-pipeline-webhook：主要用于tekton定义的CRD的校验
- tekton-dashboard：tekton流水线的可视化界面
- tekton-triggers：tekton触发器，主要用于监听git commit/merge等事件，并对相应事件进行反应
    

Tekton相关资料如下：
- [Github项目](https://github.com/tektoncd/pipeline)
- [Github上的安装教程](https://github.com/tektoncd/pipeline/blob/main/docs/install.md)
- [官网文档](https://tekton.dev/docs/)
    

## 安装Tekton环境

安装信息总览：
- tekton-pipeline版本：v0.31.0
- tekton-dashboard版本：v0.23.0
- tekton-triggers版本：v0.17.1

## 获取安装文件

- ***方式1***
使用[tekton.zip](/downloads/open-source/tekton/tekton.zip)中文件，该包中所用镜像已调整为内网环境镜像.

- ***方式2***
从以下链接获取安装文件，该文件中所用镜像需联通外网环境方能拉取：

```
tekton-pipeline组件安装文件：
https://storage.googleapis.com/tekton-releases/pipeline/previous/v0.31.0/release.yaml

tekton-dashboard组件安装文件：
https://storage.googleapis.com/tekton-releases/dashboard/previous/v0.23.0/tekton-dashboard-release.yaml

tekton-triggers组件安装文件：
https://storage.googleapis.com/tekton-releases/triggers/previous/v0.17.0/release.yaml
```

## 执行安装脚本

执行以下脚本选择性安装需要的组件：
``` sh
kubectl apply -f $fileName
```

## 验证安装

按照以上安装过程操作完毕，Tekton相关组件会被安装在名为”tekton-pipelines”的namespace中，查看该namespace中的关键资源：
``` sh
kubectl get po,svc -ntekton-pipelines

NAME                                              READY   STATUS      RESTARTS   AGE
pod/tekton-dashboard-85b7b59f46-4nwvm             1/1     Running     0          125m
pod/tekton-pipelines-controller-5474ff4b7-pptr7   1/1     Running     0          125m
pod/tekton-pipelines-webhook-7fb8865445-6dbc4     1/1     Running     0          125m

NAME                                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                              AGE
service/tekton-dashboard              NodePort    10.97.2.217     <none>        9097:31805/TCP                       81d
service/tekton-pipelines-controller   ClusterIP   10.109.51.209   <none>        9090/TCP,8008/TCP,8080/TCP           81d
service/tekton-pipelines-webhook      ClusterIP   10.100.14.228   <none>        9090/TCP,8008/TCP,443/TCP,8080/TCP   81d
```

从控制台输出可知，Tekton-Dashboard通过NodePort 31805端口暴露服务，因此，可以通过该端口访问web界面：
```
http://$hostIP:31805
```

界面展示如下：
![tekton-dashboard](/images/open-source/tekton/tekton-dashboard.png)

