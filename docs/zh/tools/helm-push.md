---
date: 2022-11-25
---

# Helm-Push插件

Helm Push插件本质上是一个二进制可执行文件,主要用于将Chart包推送到Chart仓库中。

## 安装Helm Push插件

### 获取Helm插件路径

```bash
# 通过指令查看helm环境变量
helm env

# 终端打印信息如下
HELM_BIN="helm"
HELM_CACHE_HOME="/root/.cache/helm"
HELM_CONFIG_HOME="/root/.config/helm"
HELM_DATA_HOME="/root/.local/share/helm"
HELM_DEBUG="false"
HELM_KUBEAPISERVER=""
HELM_KUBEASGROUPS=""
HELM_KUBEASUSER=""
HELM_KUBECAFILE=""
HELM_KUBECONTEXT=""
HELM_KUBETOKEN=""
HELM_MAX_HISTORY="10"
HELM_NAMESPACE="default"
HELM_PLUGINS="/root/.local/share/helm/plugins"
HELM_REGISTRY_CONFIG="/root/.config/helm/registry.json"
HELM_REPOSITORY_CACHE="/root/.cache/helm/repository"
HELM_REPOSITORY_CONFIG="/root/.config/helm/repositories.yaml"
```

以上打印信息中的`HELM_PLUGINS`，其值为`/root/.local/share/helm/plugins`，代表Helm插件路径。
::: tip 
如果Helm插件路径实际上并不存在，则手动创建：
```bash
mkdir -p /root/.local/share/helm/plugins
```
:::

### 下载并安装Helm Push插件

此处选择的Helm Push插件的`v0.10.0`版本，更多Helm版本可参考 [Helm Push Realease](https://github.com/chartmuseum/helm-push/releases).
```bash
# 从GitHub上进行下载Helm Push插件安装包
wget https://github.com/chartmuseum/helm-push/releases/download/v0.10.0/helm-push_0.10.0_linux_amd64.tar.gz

# 将下载好的helm-push插件解压到helm插件路径下的helm-push文件夹中
mkdir -p /root/.local/share/helm/plugins/helm-push
tar -zxvf helm-push_0.10.0_linux_amd64.tar.gz -C /root/.local/share/helm/plugins/helm-push

# 通过指令查看已安装的helm插件
helm plugin list

# 终端打印信息如下，表示helm-push安装完成
NAME   	VERSION	DESCRIPTION                      
cm-push	0.10.0 	Push chart package to ChartMuseum
```


## 使用Helm Push插件上传Chart包

```bash
# chartName: 本地chart包路径， `.`表示当前路径
# $repoName Chart仓库的名称；
helm cm-push $chartName $repoName
```

::: tip
如果本地没有chart包，可通过helm指令创建：
```bash
# $chartName: chart名称
helm create $chartName
```
:::