---
description: Argo CD 与 Kargo 系列写作计划：GitOps 部署、环境晋升、与 Tekton 串成完整交付链。
date: 2026-11-21
stage: P4
---

# Argo CD + Kargo

**目标目录**：`docs/zh/open-source/argocd-kargo/`，英文对应 `docs/en/open-source/argocd-kargo/`，demos 放 `docs/public/demos/argocd-kargo/`。

## 定位

发布面。Argo CD 解决“集群状态向 Git 声明对齐”，Kargo 解决“哪个已验收的产物在什么时候进入哪个环境”。二者是分工而非替代：Argo CD 管部署，Kargo 管晋升。

## 与 Tekton 的边界

Tekton 管构建与测试，产出镜像与清单；Argo CD 管部署，持续比对；Kargo 管环境间晋升。三者的接缝是“谁改 Git 里的镜像 tag”，这是本系列最后需要讲清楚的一点。

## 取舍说明

按规范第 1 节，概念、部署、操作不合并到一篇。Argo CD 与 Kargo 合为一个系列，但各自独立成篇。若希望单篇覆盖，需放弃可复现的部署步骤。

## 版本基准

Argo CD 3.6.x（3.6.0 于 2026 年 11 月发布，3.7 尚未 GA），Kargo v1.11 及以上。

## 前置条件

已定方案如下。

- **Git 远端用本地 Gitea**，部署在 kind 集群内（Deployment 加 SQLite），Argo CD 与 Kargo 通过 Service 访问。原因是 Kargo 的晋升步骤默认包含 `git-push`，任何会往读者自己仓库推 commit 的方案都不适合做示例；本地仓库可随意重置，整体清理无残留。GitHub 私有仓库不写进正文，只在“迁移到真实仓库”一节说明需要改的三处：`repoURL`、仓库凭据 Secret、镜像前缀与 `imagePullSecret`。
- **镜像仓库用 `registry:2`**，跑在宿主机 Docker。它是本系列的配角，越轻越好；需要 `htpasswd` 基础认证，让仓库凭据与 pull secret 的写法成立；需要开启 `REGISTRY_STORAGE_DELETE_ENABLED` 并配 GC，保证清理收得干净。kind 侧通过 `containerdConfigPatches` 配 `insecure-registries` 接入。
- 更接近生产的镜像仓库（项目、robot account、复制、扫描、Web UI）另立独立文章，见仓库根 `ROADMAP.md` 的 Harbor 待办，不作为本系列依赖。

## 篇目

| 篇目 | 内容 | 依赖 |
| --- | --- | --- |
| `introduction.md` | GitOps 的比对模型（desired 与 live）、Application 与 AppProject、health 与 sync status 的差别、与 Tekton 的职责切分 | 无 |
| `installation.md` | kind 上安装 Argo CD 3.6.x、CLI 登录、仓库凭据、第一个 Application、组件与端口 | kind 集群 |
| `application.md` | 多环境目录布局、Sync Wave 与 Phase 的执行顺序、自动同步与 selfHeal/prune 的取舍 | 上一篇 |
| `rollback.md` | 回滚到历史 revision 的两种方式、漂移来源识别、禁止手改集群的边界 | 前两篇 |
| `kargo-promotion.md` | Kargo 架构：Warehouse 订阅产物 → Freight 成为不可变发布单元 → Stage 对应环境 → Promotion 执行步骤序列；自动与手动晋升、验证步骤、回滚保持 | 前三篇 |
| `tekton-argocd-kargo.md` | 全链路：Tekton 构建并推送镜像 → Warehouse 发现新 Freight → dev 自动晋升 → 验证通过后手动晋升 prod | 全部 |

## demos

`docs/public/demos/argocd-kargo/` 下分五块：

- `prerequisites/`：Gitea 与 registry 的编排文件、kind 的 insecure registry 配置与创建脚本。
- `installation/`、`kargo/`：各含 `yaml/` 与 `scripts/`。
- `app/`：示例 Go 服务与其清单。
- `pipeline/`：Tekton 流水线与 Kargo 资源的联调。

## 验收

- 改 Git 中的镜像 tag 后，集群按预期自动同步。
- 改错 revision 或断开仓库时，sync 状态可见，且能回滚到上一可用版本。
- Kargo 的 Freight 能从一个 Stage 晋升到下一个，晋升记录可查、可追溯。
- 全链路跑完后，清理脚本能把 Gitea、registry、Argo CD 与 Kargo 一并移除。
