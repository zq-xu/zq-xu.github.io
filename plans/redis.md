---
description: Redis 系列写作计划：数据结构与边界、单机与高可用部署、go-redis 客户端接入。
date: 2026-11-21
stage: P2
---

# Redis

**目标目录**：`docs/zh/open-source/redis/`，英文对应 `docs/en/open-source/redis/`，demos 放 `docs/public/demos/redis/`。

## 定位

数据面。内存键值存储，重点是数据结构的选择与使用边界，而不是把它当缓存黑盒。

## 为什么排在第二位

KEDA 的伸缩示例需要一个“可观测积压量”作为触发源，Redis List 是最短路径。先写 Redis，KEDA 那一篇可以直接复用，不必再搭一套消息系统。

同时缓存穿透、击穿、雪崩与分布式锁这几类问题在生产中高频，值得一次讲透，而不是散落在各篇。

## 版本基准

Redis Open Source 8.10（2026 年 8 月发布，镜像 `redis:8.10`），Go 客户端 go-redis v9。

## 篇目

| 篇目 | 内容 | 依赖 |
| --- | --- | --- |
| `introduction.md` | 单线程模型与为什么快、八种数据结构与典型用途、持久化 RDB/AOF 的取舍、主从/Sentinel/Cluster 三种拓扑、与 Kafka 的边界 | 无 |
| `deployment.md` | 单机拓扑的完整部署：配置文件、密码、持久化、资源限制、验证；kind 与 Docker 两种方式的差异 | kind 集群 |
| `ha-deployment.md` | 主从复制加 Sentinel 的部署与故障转移验证 | 上一篇 |
| `golang-client.md` | go-redis v9：连接与连接池参数、Pipeline、Lua 原子脚本、分布式锁（`SET NX PX` 与续期）、缓存穿透/击穿/雪崩的写法、List 作为队列 | 前两篇 |

Cluster 拓扑不单独成篇，只在 `introduction.md` 的选型部分讲清它与 Sentinel 的分界与代价，避免篇幅膨胀。

## demos

`docs/public/demos/redis/` 下分两块：

- `installation/`：`single/` 与 `sentinel/` 两个场景，各自含 `yaml/` 与 `scripts/`，不建 `shared/`。
- `app/`：cobra 命令行项目，一个能力一个子命令，覆盖字符串、哈希、List 队列、Pipeline、Lua、分布式锁与缓存兜底。

## 验收

- Sentinel 故障转移后客户端能自动重连，日志可见切换过程。
- 分布式锁在并发压测下只有一个持有者，超时与续期行为可复现。
- 缓存穿透场景有明确的兜底行为，且能在指标或日志上被观察到。
- 数据持久化在重启后按配置保留，清理步骤能把容器与数据目录一并删净。
