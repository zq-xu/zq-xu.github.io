---
date: 2022-11-27
---

# Helm工具

[Helm工具](https://helm.sh/zh/docs/)本质上是一个二进制可执行文件，主要用于在Kubernetes环境中安装`Chart包`。

## 安装Helm工具

此处选择的Helm工具的`v3.7.1`版本，更多Helm版本可参考 [Helm Realease](https://github.com/helm/helm/releases).
```bash
# 从GitHub上进行下载Helm安装包
wget https://get.helm.sh/helm-v3.7.1-linux-amd64.tar.gz

# 解压下载的helm压缩包
tar -zxvf helm-v3.7.1-linux-amd64.tar.gz

# 将解压后的helm可执行文件移动至$PATH路径下
cp linux-amd64/helm /usr/local/bin

# 通过helm指令查看helm version
helm version

#终端打印信息正常，表示helm工具可正常使用
version.BuildInfo{Version:"v3.7.1"……
```

## Helm工具常用操作

### Chart仓库添加
```bash
# $repoName 添加的Chart仓库的名称；
# $helmRepoUrl： 添加的Chart仓库的地址。
helm repoUrl add $repoName $repoUrl
```

### Chart仓库更新
```bash
helm repo update
```

### Chart仓库列表展示
```bash
helm repo list

# 终端打印信息
NAME        	URL                           
rook-release	https://charts.rook.io/release
chartmuseum 	http://192.168.1.240:8090 
```

### Chart仓库移除
```bash
# $repoName 添加的Chart仓库的名称；
helm repo remove $repoName
```

### 在Chart仓库中查找Chart包
helm版本号符合[语义化版本2标准](https://semver.org/spec/v2.0.0.html):
- 正式发布版本示例：v1.0.0;
- 预发布版本号示例：v1.0.0-alpha;

```bash
# $keyWord 需要查找的Chart包的名称或者其他关键字(模糊搜索)；
# 默认展示最新正式版本号
helm search repo $keyWord

# 终端打印信息
# $repoName Chart包所在Chart仓库的名称；
# $chartName 查找到的Chart包的名称
NAME                CHART VERSION	APP VERSION	DESCRIPTION                
$repoName/$chartName	1.0.0        	1.0.0      	A Helm chart for Kubernetes
```

::: tip 参数
- --version $chartVersion: 指定版本号；
- --devel: 展示包括预发布版本号在内的最新的预发布版本号;
- --versions: 展示所有正式发布的版本号;
- --versions --devel: 展示所有包括预发布版本号的所有版本号;
:::


### 从Chart仓库下载Chart包到本地
```bash
# $repoName Chart包所在Chart仓库的名称；
# $chartName Chart包名称
helm pull $repoName/$chartName
```


### 安装Chart包
```bash
# $name: 安装名称
# $chartPath 本地Chart包路径，或Chart仓库中的Chart(格式为`repoName/chartName`)
helm install $name $chartPath
```


### 升级Chart包
```bash
# $name: 安装名称
# $chartPath 本地Chart包路径，或Chart仓库中的Chart(格式为`repoName/chartName`)
helm upgrade $name $chartPath
```

::: tip
升级Chart包时，安装时指定的所有参数会失效，需要重新指定所有需要的参数。
:::


## Helm工具常用参数

### -n $namespace

参数`-n $namespace`表示指定操作的namespace;

### --create-namespace

参数`--create-namespace`表示如果指定的namespace不存在，则新建这个namespace.

### --verision $chartVersion

参数`--verision $chartVersion`表示指定安装的Chart包的版本号
