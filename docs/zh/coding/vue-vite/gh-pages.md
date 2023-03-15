---
sticky: 995
date: 2022-08-29
tag:
 - docs
tags:
 - Vue
 - Vite
categories:
 - Web
recommend: 3
---

# Github Pages部署

要将项目的Web示例/文档部署到[Github Pages](https://docs.github.com/en/pages)，主要需要完成以下两步：
- [项目打包配置](#项目打包配置)：项目内部配置，实现本地手动/`Github Action`自动的打包推送；
- [Github配置](#github配置)：在`Github`上进行配置，主要配置用于展示的分支/路径以及权限。

示例项目：[Warehouse Page](https://zq-xu.github.io/warehouse-page)

## 项目打包配置

### Vite项目

基于`Vite`构建的项目发布到`Github Pages`可以参考：
- [Github Pages](https://cn.vitejs.dev/guide/static-deploy.html#github-pages)：此处是基于`Github Action`触发流水线自动打包并推送；
- [v3.GitHub Pages](https://v3.vitejs.dev/guide/static-deploy.html#github-pages)：此处是在本地通过执行脚本进行打包，并推送打包好的静态文件至公开的`Github`仓库的指定分支。比较适合私有项目，可以只对外暴露打包好的文件，而不暴露私有项目的源代码。

### VitePress文档

基于`VitePress`构建的博客或者文档可以参考[VitePress官方文档Github Pages配置](https://vitepress.vuejs.org/guide/deploying#github-pages)。

此博客亦是基于`VitePress`构建，打包推送需结合`ACCESS_TOKEN`实现，相关配置与官方文档略有不同，详见[deploy.yml](https://github.com/zq-xu/zq-xu.github.io/blob/master/.github/workflows/deploy.yml)。

其中参数`ACCESS_TOKEN`生成及配置可参考[ACCESS_TOKEN](#access_token).


### VuePress文档

基于`VuePress`(`v2版本`)构建的博客或者文档可以参考[VuePress官方文档Github Pages配置](https://v2.vuepress.vuejs.org/guide/deployment.html#github-pages)。

亦可参考本人实践过得项目配置：[docs.yml](https://github.com/zq-xu/dolphindb-cloud-docs/blob/main/.github/workflows/docs.yml)

## Github配置

### 配置发布源

在公开的Github项目中配置用于展示`Github Pages`的分支及路径。

详情参考[为 GitHub Pages 站点配置发布源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

当有新的commit提交到配置的分支/路径时，`Github Action`会自动触发部署。

### ACCESS_TOKEN

如果打包配置中没有用到`ACCESS_TOKEN`,可跳过此步骤。

参数`ACCESS_TOKEN`需在Github项目中进行配置：
- 生成方式：可参考[创建 personal access token](https://docs.github.com/zh/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)(此token需具有推送权限，因此权限选中repo即可)。
- 配置方式：可参考[为存储库创建加密的Secrets](https://docs.github.com/zh/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository)


## 踩坑记录

### Github Pages展示404错误

基于`Vite`打包好了Web示例，本地执行`vite preview`指令，Web示例本地运行正常。

使用脚本将其推送到`Github Pages`，示例网页加载失败，查看`console`显示类似以下错误：
- `Failed to load resource: the server responded with a status of 404`
- `net::ERR_ABORTED 404`

反复检查之后，最终发现是问题是因为移除了脚本中的如下内容：
```sh
# place .nojekyll to bypass Jekyll processing
echo > .nojekyll
```

上述脚本作用及原因如下(摘自[.nojekyll 文件是什么](https://www.jianshu.com/p/ac9b54176dbe))：

`Github Pages`默认是基于`Jekyll`构建，`Jekyll`是一个将纯文本转换为静态网站的工具，它构建的网站下各种目录都是特定的以下划线开头命名的文件夹，例如 _layouts、_posts ，它会忽略掉其它的以下划线开头的文件夹和文件。

`.nojekyll`就是告诉`Github Pages`当前网站不是基于`Jekyll`构建的，不要忽略掉下划线开头的文件和文件夹。


