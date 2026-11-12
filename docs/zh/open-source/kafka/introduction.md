---
description: Kafka 的核心模型、典型用途与性能量级，以及如何用一条 docker run 在本机跑起单机 Kafka 3.9.1（KRaft 模式，无 ZooKeeper、无需 JDK）。
date: 2026-11-12
tag:
 - Kafka
tags:
 - Kafka
 - Docker
 - KRaft
categories:
 - Open Source
---

# Kafka介绍与本地运行

Kafka 是什么、为什么这么设计、适合什么场景，以及怎么在本机用一条 `docker run` 起一个可用的单机集群。
读完这篇，再到[第二篇：Golang项目验证Kafka](./golang-verification.md)把生产、消费、消费组、位点、分区逐项跑通。
返回[系列目录](./index.md)。

配套代码在仓库 [`public/demos/kafka`](https://github.com/zq-xu/zq-xu.github.io/tree/master/public/demos/kafka)，第二篇会展开讲它的结构。

## Kafka 是什么

一句话：**Kafka 是把消息顺序写进磁盘、并允许很多消费者各自按进度去读的分布式提交日志。**

理解这句话的三个关键词：

- **顺序写**：消息只会追加到日志末尾，磁盘顺序写的吞吐远高于随机写；
- **不投递即删**：消息按保留策略（时间或大小）删除，不是被谁读走就消失，所以同一份数据可以被反复回放；
- **各自按进度读**：每个消费者只维护自己的位点（offset），互不干扰，读多读少都不影响别人。

这三点决定了它的定位：**高吞吐的事件流平台**，而不是任务派发队列。

### 一条消息的旅程

1. 生产者决定分区：有 key 时按 `hash(key) % 分区数`，没有 key 时轮询或粘性分配；
2. 消息追加到该分区日志末尾，broker 返回这条消息的 offset（`acks=all` 时还要等 ISR 落盘）；
3. 分区内 offset 严格递增，跨分区不保证顺序；
4. 消费者按自己的位点拉取，处理完提交"下一条要读的位置"；
5. 消费组把分区分给组内成员，**一个分区同一时刻只属于一个成员**；
6. 到期的数据被保留策略删除，但位点还在，按旧位点读会得到"越界"错误。

### 核心模型

| 概念 | 含义 | 注意 |
|---|---|---|
| Broker | 一个服务节点 | 本机 demo 只有一个 |
| Topic | 逻辑分类 | 由若干分区组成 |
| Partition | 有序日志，**唯一并行单位** | 分区数决定最大消费并行度 |
| Offset | 分区内位置编号 | 提交的是"下一条要读的位点" |
| Replica / Leader / Follower | 副本 / 主 / 从 | 只有 leader 对外读写 |
| ISR | 与 leader 同步的副本集 | `acks=all` 写的是 ISR 全部 |
| Consumer Group | 消费组 | 一个分区同一时刻只给组内一个成员 |
| Rebalance | 分区重分配 | 成员进出触发，期间消费暂停 |
| `__consumer_offsets` | 存位点的内部 topic | 默认 50 分区 |

四条容易踩的规则：

- 分区数只能增加，不能减少；
- 同一 key 固定落同一分区（`HashPartitioner`），分区数一变映射就变；
- 消费并行度上限等于分区数，多出来的消费者只能空转；
- `MarkMessage` 等价于 `MarkOffset(offset+1)`，提交的是"下一条"。

### 主要功能

- **读写与持久化**：发布订阅、按 `retention.ms` 回放、日志压缩 compact（按 key 保留最新）
- **并行与容错**：分区并行、副本与 ISR、消费组与自动 rebalance
- **有序与可靠**：分区内有序、幂等生产、事务
- **生态与治理**：压缩（gzip / snappy / lz4 / zstd）、Kafka Connect、Kafka Streams、配额与多租户

### 典型用途

- 日志与指标采集
- 用户行为埋点
- CDC：binlog → Kafka → 缓存 / 搜索 / 数仓
- 事件驱动微服务
- 流计算入口（Flink / Kafka Streams）
- 削峰填谷、历史数据回放
- 事件溯源与审计

### 大概性能

| 指标 | 量级 | 影响因素 |
|---|---|---|
| 单 broker 写入 | 小消息数十万~百万条/秒，百 MB/s 级 | 消息大小、批量、压缩、`acks`、磁盘顺序写 |
| 单 broker 读取 | 与写入同量级或更高 | 页缓存、拉取批量、解压开销 |
| 延迟 | `acks=0` 亚毫秒；`acks=1` 1~3ms；`acks=all` 同机房几 ms | acks、副本数、跨机房 RTT |
| 单分区 | 常见 10MB/s 级 | 单分区是顺序瓶颈，靠多分区扩展 |
| 保留 | TB ~ PB | 磁盘容量 + 保留策略 + 压缩比 |

公开案例量级：LinkedIn 曾公开日均数万亿条消息，Netflix、Uber 也在每秒数百万事件的规模上使用。

本机实测（单机 Docker、单进程 Go 客户端、小消息、`acks=all` + 幂等）：

| 方式 | 结果 |
|---|---|
| 同步生产（逐条等 ACK） | 9~12 条 / 19~29ms ≈ **400 条/秒** |
| 异步生产（批量攒包） | 200 条 / 15ms ≈ **13000 条/秒** |

差 30 倍全部来自"是否逐条等一个网络往返"。吞吐不够时，先看客户端是不是在同步逐条发。

### 什么时候选 Kafka

**适合**：高吞吐事件流且要落盘可回放；多个下游各自按不同速度消费同一份数据；
需要按 key 有序；要做流处理入口或 CDC；能接受最终一致 + 异步。

**不太适合**：

| 场景 | 更合适 | 原因 |
|---|---|---|
| 复杂路由、延迟队列、优先级队列 | RabbitMQ | Kafka 没有 per-message 路由与优先级 |
| 单机轻量、只要"能用的队列" | Redis Stream / RabbitMQ | Kafka 组件多、调参多 |
| 任务派发（单条确认与重试） | RabbitMQ / SQS | Kafka 的确认粒度是分区位点 |
| 超大多租户 + 分层存储 | Pulsar | Kafka 需额外组件 |
| 服务间同步调用 | gRPC / HTTP | 中间件只会加延迟 |
| 数据量很小（每天几万条） | DB 表 / 定时任务 | 运维成本远大于收益 |

一句话：**日志/事件流 + 高吞吐 + 可回放 → Kafka；任务分发 + 精细路由 + 低延迟确认 → RabbitMQ 类。**

## 本地起一个单机 Kafka

下面这套用 Kafka 3.9.1 的官方镜像，KRaft 模式：单节点同时扮演 broker 和 controller，
不需要 ZooKeeper，也不需要宿主机装 JDK——一切都在容器里。

### 前置条件

| 项 | 要求 | 说明 |
|---|---|---|
| Docker | Docker Desktop / Engine | macOS 上建议用 Docker Desktop |
| 内存 | 给 Docker 至少 2GB | broker 默认堆 1GB 左右，余量留给页缓存 |
| 端口 | 宿主机 9092 空闲 | 容器内 9093 是 controller，不对外映射 |
| Java | **不需要** | 镜像自带 |
| 磁盘 | 建议留 5GB+ | 数据默认保留 7 天，日志会持续增长 |

### 方式一：一条 docker run

先建数据卷，再起容器：

```bash
docker volume create kafka-demo-data

docker run -d \
  --name kafka-demo \
  --restart unless-stopped \
  -p 9092:9092 \
  -v kafka-demo-data:/var/lib/kafka/data \
  -e CLUSTER_ID=4L6g3nShT-eMCtK--X86sw \
  -e KAFKA_NODE_ID=1 \
  -e KAFKA_PROCESS_ROLES=broker,controller \
  -e KAFKA_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT \
  -e KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER \
  -e KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT \
  -e KAFKA_CONTROLLER_QUORUM_VOTERS=1@localhost:9093 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  -e KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR=1 \
  -e KAFKA_TRANSACTION_STATE_LOG_MIN_ISR=1 \
  -e KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS=0 \
  -e KAFKA_NUM_PARTITIONS=3 \
  -e KAFKA_AUTO_CREATE_TOPICS_ENABLE=true \
  -e KAFKA_LOG_DIRS=/var/lib/kafka/data \
  --health-cmd '/opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list >/dev/null 2>&1 || exit 1' \
  --health-interval 10s \
  --health-timeout 10s \
  --health-retries 10 \
  --health-start-period 30s \
  apache/kafka:3.9.1
```

关键参数逐个说明：

| 参数 | 值 | 作用 |
|---|---|---|
| `--name` / `--restart` | kafka-demo / unless-stopped | 容器名固定，Docker 重启后自动拉起 |
| `-p` | 9092:9092 | 宿主机客户端走 9092 接入 |
| `-v` | kafka-demo-data:/var/lib/kafka/data | 数据放命名卷，容器重建不丢 |
| `CLUSTER_ID` | 固定字符串 | KRaft 集群 ID，格式化存储目录时用 |
| `KAFKA_NODE_ID` | 1 | 节点 ID |
| `KAFKA_PROCESS_ROLES` | broker,controller | 单节点兼任两者，不需要 ZooKeeper |
| `KAFKA_CONTROLLER_QUORUM_VOTERS` | 1@localhost:9093 | 单节点 quorum 只有自己 |
| `KAFKA_LISTENERS` | PLAINTEXT://:9092, CONTROLLER://:9093 | 客户端 9092，controller 9093 |
| `KAFKA_ADVERTISED_LISTENERS` | PLAINTEXT://localhost:9092 | **客户端拿到的地址**，写错就连不上 |
| `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR` | 1 | 单机必须为 1 |
| `KAFKA_TRANSACTION_STATE_LOG_*` | 1 / 1 | 事务 topic 的副本数与最小 ISR，单机同样必须为 1 |
| `KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS` | 0 | 去掉消费组首次 rebalance 的等待，本地调试更快 |
| `KAFKA_NUM_PARTITIONS` | 3 | 自动建 topic 的默认分区数 |
| `KAFKA_AUTO_CREATE_TOPICS_ENABLE` | true | demo 方便，生产建议关 |
| `KAFKA_LOG_DIRS` | /var/lib/kafka/data | 正好是数据卷挂载点 |

`--health-cmd` 用容器内的 `kafka-topics.sh --list` 做探针：能列出 topic 才说明 broker 真的可服务。
配合 `docker inspect` 可以等 `healthy` 再跑客户端，避免"连上了但 broker 没就绪"的假失败。

> 最常见的坑是 `ADVERTISED_LISTENERS`：客户端先连 9092 拿元数据，元数据返回的 broker 地址就是
> advertised 的地址。写成容器内主机名，宿主机上的客户端会去连一个解析不到的地址，
> 表现为"能连上但一直超时"。

### 方式二：用脚本管理

原始命令读一遍就够了。日常用随示例项目提供的脚本更省事，假设你已经把仓库 clone 到本地：

```bash
git clone https://github.com/zq-xu/zq-xu.github.io.git
cd zq-xu.github.io/public/demos/kafka

./scripts/kafka.sh start     # 没有容器就创建，然后等到 healthy 才返回
./scripts/kafka.sh status    # 容器状态 + 端口 + 数据卷
./scripts/kafka.sh logs      # 跟 broker 日志（排错第一步）
./scripts/kafka.sh stop      # 停容器，数据卷保留
./scripts/kafka.sh restart   # stop + start
./scripts/kafka.sh reset     # 删容器和数据卷，彻底回到初始状态
```

脚本支持环境变量覆盖，不用改文件：

```bash
KAFKA_PORT=19092 KAFKA_CONTAINER=kafka-test ./scripts/kafka.sh start
```

可用变量：`KAFKA_IMAGE`、`KAFKA_PORT`、`KAFKA_CONTAINER`、`KAFKA_VOLUME`、`CLUSTER_ID`。

### 确认集群真的可用

三步确认，从"进程在"到"能读写"：

```bash
# 1. 容器在且健康
docker ps --filter name=kafka-demo
docker inspect -f '{{.State.Health.Status}}' kafka-demo     # 期望 healthy

# 2. broker 能响应元数据请求
docker exec kafka-demo /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 --list

# 3. 用自带命令行做一次读写冒烟
docker exec kafka-demo /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 --create --topic quickstart --partitions 3

printf 'hello\nkafka\n' | docker exec -i kafka-demo /opt/kafka/bin/kafka-console-producer.sh \
  --bootstrap-server localhost:9092 --topic quickstart

docker exec kafka-demo /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 --topic quickstart --from-beginning \
  --max-messages 2 --timeout-ms 10000

docker exec kafka-demo /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 --delete --topic quickstart
```

能读到刚写的两行，说明"建 topic → 生产 → 消费"这条链路在本机是通的。
再往下验证消费组、位点、分区这些细节，就交给[第二篇](./golang-verification.md)的 Go 项目。

### 数据放在哪，重启会怎样

| 操作 | 数据 | 说明 |
|---|---|---|
| `docker stop` / `docker start` | 保留 | 容器和卷都在 |
| `docker rm` 容器后重新 `docker run` | 保留 | 只要卷名不变，日志还在 |
| `./scripts/kafka.sh reset` | **清空** | 删容器 + 删卷，下次 start 是全新集群 |
| 换镜像版本 | 保留 | 同一个卷可以被更高版本继续用；跨大版本降级不建议 |

卷的位置可以用 `docker volume inspect kafka-demo-data` 查。

### 常见问题

| 现象 | 大概率原因 | 怎么查 |
|---|---|---|
| `port is already allocated` | 9092 被别的进程占了 | `lsof -i :9092`，或换 `KAFKA_PORT` |
| 容器一直 `unhealthy` | 内部 topic 未建好、磁盘满、内存不足 | `./scripts/kafka.sh logs` 看 broker 日志 |
| 能连上但请求一直超时 | `ADVERTISED_LISTENERS` 不是 `localhost:9092` | `docker inspect` 看环境变量 |
| 客户端报 `NOT_LEADER_FOR_PARTITION` | 元数据没刷新（刚建完 topic 常见） | 稍等重试，或先查一次 `--describe` |
| 镜像拉取很慢 | 网络/镜像源 | 配置 Docker 镜像加速，或换机器网络 |
| Apple Silicon 上启动失败 | 拉到了不匹配的架构 | 确认拉的是多架构镜像 `apache/kafka:3.9.1` |

### 这套配置与生产的差距

| 项 | 本机 demo | 生产建议 |
|---|---|---|
| 节点数 | 1（broker + controller 同进程） | 至少 3 broker + 3 controller |
| 副本数 | 1 | 3（`min.insync.replicas=2`） |
| 自动建 topic | true | false，由平台统一建 |
| 安全 | PLAINTEXT | SASL_SSL / mTLS |
| 监控 | 无 | lag、ISR 收缩、UnderReplicatedPartitions、磁盘水位 |
| 保留 | 默认 7 天 | 按价值与容量定，必要时分层存储 |

本机这套的唯一目的是**功能验证与调试**，不要用它承载真实数据。

## 下一篇

集群起来之后，进入[Golang项目验证Kafka](./golang-verification.md)：项目结构、每个子命令验证什么、
七步端到端断言分别覆盖了哪些坑。
