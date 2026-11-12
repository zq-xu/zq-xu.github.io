---
description: Kafka 本地实践系列：先弄清核心模型与选型，再用一条 docker run 在本地跑起单机 Kafka，最后用一个 Golang 项目逐项验证生产、消费、消费组与位点。
date: 2026-11-12
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

这个系列用一个真实的本地环境把 Kafka 走一遍：先搞清楚它是什么、为什么这么设计、什么时候该用，
再用一条 `docker run` 在本机起一个可用的单机集群，最后落到代码，用一个 Golang 项目把基础能力逐项验证。

* [Kafka介绍与本地运行](./introduction.md)：核心模型（topic / partition / offset / 副本 / 消费组）、
  典型用途、性能量级与选型建议，以及单机 KRaft 集群的完整 `docker run`、参数解释、冒烟自测和排错。
* [Golang项目验证Kafka](./golang-verification.md)：cobra 命令行项目，一个能力一个子命令，
  覆盖 topic 管理、同步/异步生产、按分区直读、消费组精确限额、lag，以及七步端到端断言。

建议按顺序读：先把集群跑起来，再验证功能。已经有可用集群的，可以直接跳到第二篇。
