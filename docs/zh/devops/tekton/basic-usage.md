---
hidden: true
date: 2022-10-30
tag:
 - Tekton
tags:
 - Kubernetes
categories:
 - DevOps
---

# Tekton基本使用

## 概览

Tekton 是用于构建 CI/CD 的云原生解决方案，主要在 Kubernetes 集群上的安装和运行。开发者可以通过Tekton来定义自己的CI流程，从而实现从项目构建到项目发布的全流程。

Tekton定义了一组 CR(Kubernetes 自定义资源)，用户通过这些CR来定义自己的CI流程，Tekton的管理组件通过解析用户定义的CR来执行整个CI流程。

## 概念介绍

Tekton常用的基本概念如下，他们的关系如图所示：
- Step：步骤。步骤是整个CI/CD流程的最小单元，比如拉取代码、编译程序都可以是独立的一个步骤；
- Task：任务。任务是按顺序排列的Step的集合，每个Task在一个Pod中执行；
- TaskRun：TaskRun是Task的特定执行。可以通过TaskRun资源执行指定Task并查看执行情况;
- Pipeline：管道。管道按顺序排列的Task的集合，可以在Pipeline中定义Task的执行顺序和执行条件；
- PipelineRun：PipelineRun是Pipeline的特定执行。可以通过PipelineRun资源执行指定Pipeline并查看执行情况。  

![Tekton常用概念](/images/devops/tekton/tekton-concept.png)

其中，Task，TaskRun, Pipeline和PipelineRun为自定义资源。
PipelineResources资源在v0.30.0版本已启用，此处不做介绍。

## Tekton使用示例

当前在Gitlab上有一个名为tekton项目，项目内容为[tekton-master.zip](/downloads/devops/tektontekton-master.zip)

这个项目的CI/CD流程如下：
```
从Gitlab拉取代码  >> 构建Docker镜像 >> 推送Docker镜像到Harbor镜像仓库
```

以下将介绍如何使用Tekton实现上述CI/CD流程。

### 准备资源文件

[tekton-cicd.zip](/downloads/devops/tekton/tekton-cicd.zip)

以上zip包中包含以下文件：
- git-clone-task.yaml：用于拉取Gitlab代码的Task资源文件，为通用模板文件，将Gitlab仓库地址、分支等参数暴露出来；
- kaniko-task.yaml：用于构建并推送Docker镜像的Task资源文件，为通用模板文件，将Docker镜像名称、Tag等参数暴露出来；
- pipeline.yaml：CI/CD的流程文件，组合了拉取代码和构建镜像的Task，指定传入Task的参数，并将传入参数暴露出来，从而可以在执行pipeline时指定;
- pipelinerun.yaml：pipeline的执行资源文件，用于执行pipeline使用，并指定pipeline的执行参数，比如Gitlab仓库地址和分支、Docker镜像名称和Tag等；
- harbor-auth.yaml：用于推送Docker镜像到Harbor镜像仓库的身份认证；
- pipeline在执行CI/CD流程的时候，Gitlab仓库地址和分支、Docker镜像名称和Tag等参数可以在pipelinerun的资源文件中进行指定；
- pipeline.yaml中的runAfter字段可以定义task在某些其他task完成之后再开始执行；
    
常用的通用Task文件可参考：[tektoncd/catalog/task/](https://github.com/tektoncd/catalog/tree/main/task)

### 部署资源文件

1. 执行以下指令,部署基础资源文件：
    ``` sh
    kubectl -ntekton-pipelines apply -f git-clone-task.yaml
    kubectl -ntekton-pipelines apply -f kaniko-task.yaml
    kubectl -ntekton-pipelines apply -f harbor-auth.yaml
    kubectl -ntekton-pipelines apply -f pipeline.yaml
    ```

2. 执行以下指令，触发该CI流程：
    ``` sh
    kubectl -ntekton-pipelines apply -f pipelinerun.yaml
    ```

### 查看相关资源

执行以下指令，查看流水线相关资源：
``` sh
kubectl -ntekton-pipelines get task,pipeline,pipelinerun,secret,taskrun
NAME                        AGE
task.tekton.dev/git-clone   2m12s
task.tekton.dev/kaniko      2m12s

NAME                                AGE
pipeline.tekton.dev/test-pipeline   2m12s

NAME                                       SUCCEEDED   REASON      STARTTIME   COMPLETIONTIME
pipelinerun.tekton.dev/test-pipeline-run   True        Succeeded   109s        15s

NAME                                             TYPE                                  DATA   AGE
……
secret/harbor-auth                               kubernetes.io/dockerconfigjson        1      2m12s
……

NAME                                                  SUCCEEDED   REASON      STARTTIME   COMPLETIONTIME
taskrun.tekton.dev/test-pipeline-run-build-image      True        Succeeded   109s        15s
taskrun.tekton.dev/test-pipeline-run-fetch-from-git   True        Succeeded   109s        101s
```

如果你部署了Tekton-Dashboard, 也可以在Tekton-Dashboard的web页面上查看流水线及相关资源。