<h1 align="center">鸢涯</h1>
<p align="center">愿你出走半生，归来仍是少年</p>
<p align="center"><a href="https://zq-xu.github.io/" target="_blank">zq-xu.github.io</a></p>

云原生方向的技术笔记。主要技术栈 Kubernetes、Docker、Golang，内容围绕集群、容器运行时、消息中间件与 DevOps 工具链，每篇尽量配可复现的清单与脚本。

基于 VitePress 与 [@sugarat/theme](https://theme.sugarat.top/) 构建，中英双语。

## 目录结构

| 路径 | 说明 |
| --- | --- |
| `docs/zh`、`docs/en` | 中英文站点，文件名与层级一一对应 |
| `docs/public/demos` | 文档配套的清单、脚本与示例应用 |
| `DOCUMENT_GUIDE.md` | 写作规范，动笔与交付检查以此为准 |
| `ROADMAP.md` | 内容路线图：待写系列、篇目与进度 |

## 已发布

- **Kubernetes**：集群安装、CSI、CNI、常用配置与操作
- **Kind**：本地集群的单节点与多节点部署、示例应用
- **Kafka**：核心模型、本地部署、Golang 项目验证
- **Tekton**、**Vitess**：CI 流水线与数据库分片
- **工具**：kubectl、kubeadm、helm、harbor、docker、nfs、git

## 路线图

按依赖顺序推进，先有可观测、再有数据面与调度面、最后是发布面。详细篇目与验收标准见 [ROADMAP.md](./ROADMAP.md)。

| 阶段 | 系列 | 主题 |
| --- | --- | --- |
| P1 | Prometheus + Grafana | 集群可观测底座与整体信息面板 |
| P2 | Redis | 数据结构、部署、Golang 客户端接入 |
| P3 | KEDA | 事件驱动伸缩，副本数从 0 到 N |
| P4 | Argo CD + Kargo | GitOps 交付与环境间晋升 |

## 本地运行

需要 Node 20 及以上与 pnpm。

```bash
pnpm install
pnpm dev     # 本地预览
pnpm build   # 构建站点
```
