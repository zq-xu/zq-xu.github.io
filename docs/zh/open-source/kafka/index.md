---
description: Kafka 本地实践系列：核心模型与选型、用一条 docker run 起单机 KRaft 集群、再用一个 Golang 项目逐项验证生产、消费、消费组与位点。
date: 2026-11-12
recommend: 1
tag:
 - Kafka
tags:
 - Kafka
 - Golang
 - Docker
categories:
 - Open Source
---

# Kafka

这个系列用一个真实的本地环境把 Kafka 走一遍：先弄清它是什么、为什么这么设计、什么时候该用；再用一条 `docker run` 在本机起一个可用的单机集群；最后落到代码，用一个 Golang 项目把基础能力逐项验证。

* [Kafka 核心模型与选型](./introduction.md)：一张全链路图串起 producer → topic → partition → offset → consumer group 的关系，以及副本角色、日志存储与 acks 写入确认，再给出核心能力、典型用途、性能量级与选型对比。
* [Kafka 本地部署与运行](./local-deployment.md)：单机 KRaft（Kafka Raft）集群的完整 `docker run`、参数解释、脚本管理、冒烟自测、数据持久化与排错。
* [Golang 项目验证 Kafka](./golang-verification.md)：cobra 命令行项目，一个能力一个子命令，覆盖 topic 管理、同步 / 异步生产、按分区直读、消费组精确限额、lag，以及七步端到端断言。

建议按顺序阅读：先把概念建立起来，再把集群跑起来，最后验证功能。已经有可用集群的，可以直接看 Golang 项目验证 Kafka。

