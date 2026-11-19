---
description: 在本机用官方镜像跑起单机 Kafka 3.9.1（KRaft 模式，无 ZooKeeper、宿主机无需 JDK）：先决条件与 Docker 安装、docker run 与脚本两种启动方式、运行验证、数据持久化、常见问题与生产环境差异。
date: 2026-11-12
recommend: 3
tag:
 - Kafka
tags:
 - Kafka
 - Docker
 - KRaft
categories:
 - Open Source
---

# Kafka 本地部署与运行

本机这套使用 Kafka 3.9.1 官方镜像 `apache/kafka:3.9.1`，运行在 KRaft（Kafka Raft，用 Raft 共识管理元数据、替代 ZooKeeper）模式下：单节点同时扮演 broker 与 controller，不需要 ZooKeeper，宿主机也不需要安装 JDK（Java Development Kit，Java 开发工具包）——一切都在容器里。

它唯一的目的，是提供一个可以做功能验证与调试的本地集群，不用于承载真实数据。核心概念与选型见 [Kafka 核心概念与选型](./introduction.md)。

## 先决条件

| 项 | 要求 | 说明 |
|---|---|---|
| Docker | Docker Desktop / Engine | macOS 上建议用 Docker Desktop |
| 内存 | 给 Docker 至少 2GB | broker 默认堆 1GB 左右，余量留给页缓存 |
| 端口 | 宿主机 9092 空闲 | 容器内 9093 是 controller，不对外映射 |
| Java | **不需要** | 镜像自带 |
| 磁盘 | 建议留 5GB+ | 数据默认保留 7 天，日志会持续增长 |

### 安装 Docker

macOS 使用 Homebrew 安装 Docker Desktop：

```bash
brew install --cask docker-desktop
open -a Docker

# wait for Docker Desktop to finish its first start and authorization
docker info
```

Linux 安装 Docker Engine：

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

`usermod` 修改的是组权限，需要重新登录后生效；也可以在当前终端执行 `newgrp docker` 进入新的 shell。安装完成后确认守护进程可用：

```bash
docker info
```

## 方式一：一条 docker run

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

`--health-cmd` 用容器内的 `kafka-topics.sh --list` 做探针：能列出 topic 才说明 broker 真的可服务。配合 `docker inspect` 可以等 `healthy` 再跑客户端，避免“连上了但 broker 没就绪”的假失败。

> 最常见的问题是 `ADVERTISED_LISTENERS`：客户端先连 9092 拿元数据，元数据返回的 broker 地址就是 advertised 的地址。写成容器内主机名，宿主机上的客户端会去连一个解析不到的地址，表现为“能连上但一直超时”。

## 方式二：用脚本管理

原始命令读一遍就够了，日常使用随示例项目提供的脚本。假设已经把仓库 clone 到本地：

```bash
git clone https://github.com/zq-xu/zq-xu.github.io.git
cd zq-xu.github.io/docs/public/demos/kafka

./scripts/kafka.sh start     # create the container if missing, wait until healthy
./scripts/kafka.sh status    # container status, ports and volume
./scripts/kafka.sh logs      # follow the broker log (first step when debugging)
./scripts/kafka.sh stop      # stop the container, keep the data volume
./scripts/kafka.sh restart   # stop + start
./scripts/kafka.sh reset     # remove the container and the volume for a clean state
```

可用环境变量：`KAFKA_IMAGE`、`KAFKA_PORT`、`KAFKA_CONTAINER`、`KAFKA_VOLUME`、`CLUSTER_ID`，无需修改文件：

```bash
KAFKA_PORT=19092 KAFKA_CONTAINER=kafka-test ./scripts/kafka.sh start
```

## 运行验证

三步确认，从“容器在”到“能读写”：

```bash
# 1. the container is running and healthy
docker ps --filter name=kafka-demo
docker inspect -f '{{.State.Health.Status}}' kafka-demo     # expect healthy

# 2. the broker answers metadata requests
docker exec kafka-demo /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 --list

# 3. smoke-test create, produce and consume with the bundled CLI
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

能读到刚写的两行，说明“建 topic → 生产 → 消费”这条链路在本机是通的。再往下验证消费组、位点、分区这些细节，可以在 [Golang 项目验证 Kafka](./golang-verification.md) 里逐项执行。

## 数据持久化与容器生命周期

| 操作 | 数据 | 说明 |
|---|---|---|
| `docker stop` / `docker start` | 保留 | 容器和卷都在 |
| `docker rm` 容器后重新 `docker run` | 保留 | 只要卷名不变，日志还在 |
| `./scripts/kafka.sh reset` | **清空** | 删容器 + 删卷，下次 start 是全新集群 |
| 换镜像版本 | 保留 | 同一个卷可以被更高版本继续用；跨大版本降级不建议 |

卷的位置可以用 `docker volume inspect kafka-demo-data` 查看。

## 常见问题

| 现象 | 大概率原因 | 怎么查 |
|---|---|---|
| `port is already allocated` | 9092 被别的进程占了 | `lsof -i :9092`，或换 `KAFKA_PORT` |
| 容器一直 `unhealthy` | 内部 topic 未建好、磁盘满、内存不足 | `./scripts/kafka.sh logs` 看 broker 日志 |
| 能连上但请求一直超时 | `ADVERTISED_LISTENERS` 不是 `localhost:9092` | `docker inspect` 看环境变量 |
| 客户端报 `NOT_LEADER_FOR_PARTITION` | 元数据没刷新（刚建完 topic 常见） | 稍等重试，或先查一次 `--describe` |
| 镜像拉取很慢 | 网络 / 镜像源 | 配置 Docker 镜像加速，或换网络环境 |
| Apple Silicon 上启动失败 | 拉到了不匹配的架构 | 确认拉的是多架构镜像 `apache/kafka:3.9.1` |

## 与生产环境的差异

| 项 | 本机 demo | 生产建议 |
|---|---|---|
| 节点数 | 1（broker + controller 同进程） | 至少 3 broker + 3 controller |
| 副本数 | 1 | 3（`min.insync.replicas=2`） |
| 自动建 topic | true | false，由平台统一建 |
| 安全 | PLAINTEXT（明文，无认证） | SASL_SSL（SASL 认证 + TLS 加密）/ mTLS（双向 TLS） |
| 监控 | 无 | lag、ISR 收缩、UnderReplicatedPartitions、磁盘水位 |
| 保留 | 默认 7 天 | 按价值与容量定，必要时分层存储 |

本机这套只用于**功能验证与调试**，不要用它承载真实数据。

集群就绪后，逐项验证生产、消费、消费组与位点的做法见 [Golang 项目验证 Kafka](./golang-verification.md)。

