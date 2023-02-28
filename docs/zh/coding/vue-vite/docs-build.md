---
sticky: 996
date: 2022-08-30
tag:
 - docs
tags:
 - Vue
 - Vite
categories:
 - Web
---

# Web示例/文档/博客构建

以`Vue`或`Vite`为基础，可以构建Web示例/项目文档，并部署到[Github Pages](https://docs.github.com/en/pages)等多种平台。

Web项目可以打包好的静态文件（接口以`mock`代替）作为Web示例。

文档/博客如果是以`Markdown`格式撰写，则可以借助框架[VuePress](https://v2.vuepress.vuejs.org/zh/)或[VitePress](https://vitepress.vuejs.org/)来进行构建。

部署到`Github Pages`的方式可参考[Github Pages部署](./gh-pages.md)。

## Web示例构建

`Vue`的项目构建，默认使用webpack，官方推荐使用`Vite`工具(高性能)。

基于`Vite`的项目示例发布可以参考[Vite构建生产版本](https://cn.vitejs.dev/guide/build.html)、[Vite部署静态站点](https://cn.vitejs.dev/guide/static-deploy.html#github-pages)；

::: tip
`Vite`的文档需注意版本：
- 官方文档：[Vite构建生产版本](https://cn.vitejs.dev/guide/build.html)、[Vite部署静态站点](https://cn.vitejs.dev/guide/static-deploy.html)；
- V3版本(最新)文档(当前貌似只有英文版本)：[Vite构建生产版本](https://v3.vitejs.dev/guide/build.html)、[Vite部署静态站点](https://v3.vitejs.dev/guide/static-deploy.html)；
:::

仅基于`Vue`构建项目示例可参考[Vue生产部署](https://cn.vuejs.org/guide/best-practices/production-deployment.html)（本人没有尝试过）。

## 博客/文档构建

当前基于`Vue`或`Vite`最流行的文档/博客框架当属[VuePress](https://v2.vuepress.vuejs.org/zh/)和[VitePress](https://vitepress.vuejs.org/)了。

二者均属于开箱即用的文档框架，用户可以通过配置文件调整相应的主题/样式，将更多的精力投入到文档内容(Markdown格式)中。

### VuePress

此处搜集了`VuePress`的基础文档和个人相对比较喜欢的几个主题：
- [VuePress](https://v2.vuepress.vuejs.org/zh/)：一个以 Markdown 为中心的静态网站生成器，有良好的生态，当前为v2版本；
- [Awesome VuePress V2](https://github.com/vuepress/awesome-vuepress/blob/main/v2.md)：与`VuePress v2` 相关的插件、主题等精选清单；
- [VuePress Theme Hope](https://theme-hope.vuejs.press/zh/)：一个功能强大的`VuePress v2`主题，支持文档和博客，由[Mr.Hope](https://mrhope.site/)发起；
- [Gungnir](https://v2-vuepress-theme-gungnir.vercel.app/)：是一个基于`VuePress v2`的博客主题，个人感觉比较美观丝滑，但没有找到直接构建文档的脚手架，需要根据文档一点点地手动配置；
- [vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing)：是一个基于`VuePress v1`的博客主题，个人感觉比较美观,但其基础一直停留在`VuePress v1`版本，尚未升级到v2版本。

### VitePress

`VitePress`是基于`Vite`的`VuePress`兄弟版，比`VuePress`启动快,当前还在基础开发阶段。

此处搜集了`VitePress`的基础文档和个人相对比较喜欢的几个主题：
- [VitePress](https://vitepress.vuejs.org/)：简单、强大、高性能的现代SSG框架;
- [@sugarat/theme](https://theme.sugarat.top/)：基于`VitePress`定制的博客主题，个人觉得用起来非常丝滑;
- [Chodocs](https://chodocs.cn/)：基于`VitePress`构建的一站式前端内容网站，内容丰富；
- [Vue3 入门指南与实战案例](https://vue3.chengpeiquan.com/)：基于`VitePress`构建的学习`Vue3`的网站，风格简约。


