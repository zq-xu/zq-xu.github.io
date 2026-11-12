---
description: 用一个 cobra 命令行项目逐项验证 Kafka：连通性、topic 管理、同步/异步生产、按分区直读、消费组与精确限额、位点与堆积，以及七步端到端断言。
date: 2026-11-12
tag:
 - Kafka
tags:
 - Kafka
 - Golang
 - Cobra
categories:
 - Open Source
---

# Golang项目验证Kafka

承接[第一篇：Kafka介绍与本地运行](./introduction.md)（也可以先回[系列目录](./index.md)）。集群已经起好，这一篇解决一个问题：
**怎么证明它"真的能用"，而不只是"端口通了"。**

配套项目在仓库 [`public/demos/kafka`](https://github.com/zq-xu/zq-xu.github.io/tree/master/public/demos/kafka)，
一个 cobra 命令行程序：每个基础能力对应一个子命令，每个子命令都能独立运行、独立断言，
最后 `e2e` 一条命令把七步串起来做回归。

## 验证思路

"能连上"只是第一层。真正要验证的是这些容易出错、出错了又不容易发现的地方：

| 要验证的能力 | 对应命令 | 拿什么当证据 |
|---|---|---|
| 集群元数据与 controller 就绪 | `health` | 一次 `RefreshMetadata` 的实际耗时、broker 数、controller ID |
| 建 topic 后元数据可见 | `topic create` + `describe` | 轮询到分区数正确，能查到 leader / ISR |
| 消息真的落盘 | `produce`（同步） | broker 返回的 partition + offset |
| key 与分区的关系稳定 | `produce` + `describe` | 同一 key 每次落同一分区 |
| 不加入组也能按位点读 | `consume` | 指定 `--partition` / `--offset` 读出消息，且不提交位点 |
| 消费组分配与位点提交 | `group` + `lag` | 提交后 lag 相应减少 |
| 限额不能多也不能少 | `group --limit N` | 提交总量正好 N |
| 全链路可重复回归 | `e2e` | 七步断言全部 `[PASS]` |

**为什么用 Go 项目而不是几条 CLI 命令**：命令行工具验证不了"位点提交的时机""rebalance 后
是否继续消费""限额与 `MarkMessage` 的关系"这些细节；用代码写出来，才可以把断言固化下来，
每次改完都能一条命令重跑。

## 准备

| 项 | 要求 |
|---|---|
| Kafka | 已按第一篇起好，`docker ps` 能看到 `kafka-demo` 且 `healthy` |
| Go | 1.25+（项目 `go.mod` 声明 1.25.0） |
| 依赖 | `github.com/IBM/sarama v1.60.2`、`github.com/spf13/cobra v1.10.2` |

```bash
git clone https://github.com/zq-xu/zq-xu.github.io.git
cd zq-xu.github.io/public/demos/kafka

go mod download
go build ./...
```

后面的命令都在这个目录里执行。

## 快速开始

```bash
./scripts/kafka.sh start     # 如果还没起（脚本会等到 healthy）
go run . health              # 连通性
go run . produce --messages 9
go run . e2e                 # 端到端 7 步断言
```

或者用 Makefile 的快捷目标：`make kafka-up`、`make health`、`make produce`、`make e2e`、`make help`。

## 项目结构

```
public/demos/kafka/
├── main.go                     # 入口，只调 cmd.Execute()
├── cmd/                        # 命令层：一个子命令一个文件
│   ├── root.go                 #   root：绑全局参数 + 组装命令树
│   ├── health.go  produce.go  consume.go
│   ├── group.go   lag.go  groups.go  e2e.go
│   └── topic/                  #   topic 命令组独立成包
│       ├── topic.go            #   topic 父命令：只负责组装
│       ├── create.go  list.go  describe.go  config.go  delete.go
├── internal/
│   ├── cli/                    # 命令层公共设施：全局参数、topic 解析、连接封装
│   │   └── cli.go
│   ├── kafkax/                 # Kafka 客户端封装，不打印
│   │   ├── config.go           #   Options / SaramaConfig / NewClient(With) / NewAdmin
│   │   ├── error.go            #   wrap：统一错误前缀
│   │   ├── topic.go            #   列表/创建/等可见/详情/删除/配置
│   │   ├── produce.go          #   ProduceOptions、消息构造、同步/异步生产
│   │   ├── consumer.go         #   GroupHandler、ConsumeGroup
│   │   ├── partition_consume.go#   按分区直读（不加入组）
│   │   ├── lag.go              #   分区堆积与总堆积
│   │   └── format.go           #   消息打印、offset 解析
│   └── verify/                 # 7 步断言，一步一个文件
│       ├── e2e.go              #   Run：按顺序执行步骤
│       ├── run.go              #   run 状态 + steps 声明
│       ├── checker.go          #   断言计数与 [PASS]/[FAIL]
│       ├── stats.go            #   消费统计快照
│       ├── step_connect.go  step_topic.go  step_produce.go
│       ├── step_consume.go  step_offsets.go  step_cleanup.go
├── scripts/kafka.sh            # docker run 起集群
├── Makefile
├── go.mod                      # go 1.25.0 + sarama v1.60.2 + cobra v1.10.2
└── go.sum
```

目录与职责是一一对应的，看表就能对上：

| 目录 | 负责 | 不负责 |
|---|---|---|
| `cmd/`（含 `cmd/topic/`） | 参数解析、输出格式、退出码；一个子命令一个文件 | 不碰 Kafka 协议细节，不做断言 |
| `internal/cli/` | 命令层公共设施：全局参数绑定、连接封装（`WithClient` / `WithAdmin`）、topic 名解析 | 不写业务逻辑，不打印 |
| `internal/kafkax/` | 全部 Kafka 交互：配置、生产、消费、topic、lag；只返回数据与错误 | 不打印，不决定退出码 |
| `internal/verify/` | 七步断言流程：状态、断言计数、每步一个文件 | 不直接调 sarama，只通过 `kafkax` |

这样分层的好处：换输出格式只改 `cmd`；复用能力直接调 `kafkax`；而 `e2e` 用的封装与子命令完全相同，
所以 **e2e 通过 = 每个子命令依赖的能力都通过**。

代码里有几条刻意的约定：

- **一个子命令一个文件**；有下级子命令的（`topic`）单独成包 `cmd/topic`，父命令只负责组装；
- **每个命令的参数放在自己的 flags 结构体里**（如 `produceFlags`），不用包级可变变量，命令之间不会串状态；
- **函数不超过 50 行**，长流程按"一步一个函数、一步一个文件"拆开；
- **命令体不重复连接样板**：`cli.WithClient` / `cli.WithAdmin` 负责开连接、关连接；
- **局部配置用 tweak 函数**：`NewClientWith(g, func(c *sarama.Config){...})`，只改需要改的那一行。

## 命令总览

| 命令 | 作用 |
|---|---|
| `health` | 连通性：broker / controller / topic 数 |
| `topic create [name]` | 建 topic（分区、副本、retention、cleanup） |
| `topic list` | topic 列表（分区数、副本数、是否内部） |
| `topic describe [name]` | 分区 leader / 副本 / ISR / 位点范围 / 条数 |
| `topic config [name]` | 生效配置 + 来源（`--keys all` 看全量） |
| `topic delete [name]` | 删除 topic |
| `produce` | 生产消息，`--async` 异步，`--keys` 控制 key 轮换 |
| `consume` | 不加入组，按 `--partition` / `--offset` 直接读 |
| `group` | 消费组消费，`--limit` 精确限额，`--manual-commit` 手动提交 |
| `lag` | 每分区与合计堆积 |
| `groups` | 消费组列表 + 状态 + 成员数 |
| `e2e` | 端到端 7 步断言 |

## 每个子命令验证什么、为什么

### `health`

验证：broker 可发现、元数据接口可用（用一次 `RefreshMetadata` 的耗时作证据）、controller 就绪、
topic 总数。

**为什么**：后面每条命令都依赖元数据，先单独拎出来，出问题能立刻区分"连不上"和"代码有 bug"。

> 坑：sarama 懒连接，`Broker.Connected()` 在没发过请求前一直是 `false`，直接打印会误判。
> 所以用"元数据刷新成功与否 + 耗时"说话。

### `topic create / list / describe / config / delete`

| 子命令 | 验证 | 为什么 |
|---|---|---|
| `create` | 能建、且建完**真的可见** | 建 topic 异步，`CreateTopic` 成功 ≠ 能 describe，所以建完轮询 `WaitTopicVisible` |
| `create` | 重复建被拒 | 幂等保护，避免脚本重跑误判 |
| `list` | 枚举 topic 与分区/副本 | 判断"发到哪个 topic""是否已存在" |
| `describe` | 分区、leader、ISR、最早/最新位点 | **判断消息有没有真写进去**：最新位点涨了才算落盘 |
| `describe` | 条数 = 最新 - 最早 | 一眼看出数据量与分区是否均衡 |
| `config` | 生效值 + 来源 | 排查"改了配置怎么不生效"，先看是 topic 覆盖还是 broker 默认 |
| `delete` | 能删且不影响其他 topic | 清理现场，也验证请求路径正确 |

`describe` 里 ISR 为空是重要信号：leader 没有同步副本，写入会失败（生产上是故障前兆）。

`create` 与 `describe` 上有三个细节：

- `--retention` 用 Go duration（`24h`、`168h` 默认 7 天），底层写入的仍是 `retention.ms`；
- `--cleanup` 可选 `delete` / `compact` / `compact,delete`；
- `describe` 在取位点前先刷新该 topic 的元数据，否则刚建完的 topic 在客户端缓存里还没有分区
  leader，会报 "not the leader"。

### `produce`

验证：写入成功（同步模式拿到 broker 返回的 partition/offset，是硬证据）；同一 key 分区稳定；
分区是否均衡；同步 vs 异步吞吐差异。

**为什么**：只统计"发了多少条"没意义，`Successes()` 的回执才代表 broker 已接收；key 与分区的关系是
有序性的基础，同一 key 乱跳分区，"按订单有序"就不成立；同一份数据对比同步/异步，直观看到批量的价值。

3 个 key 可能只落到 2 个分区（哈希不保证均匀），看到 `partition 2 -> 0 records` 属正常。

### `consume`

验证能按分区、按指定起点读取，并打印 partition/offset/key/headers/value 以核对顺序，到量即停且不提交位点。

**为什么要有它**：证明读取不依赖消费组——位点就是个数字，可以从任意位置读；也是排查"某条消息在不在"
的利器；不提交位点所以是**只读安全操作**，反复跑不改变任何状态。

### `group`

验证：rebalance 真的发生（日志 `[rebalance] joined ... claims=demo-topic[0 1 2]`）；位点被提交
（`lag` 相应减少）；限额精确；手动提交可用。

**为什么限额要精确**：这是真实 bug 现场。最早版本每个分区各自判断 `count < limit`，3 分区并发，
`--limit 6` 实收 9 条。修法是把"判断 + 计数"放进同一把锁（`tryAcquire`），抢不到名额的分区直接返回
**且不 `MarkMessage`**，位点不推进，消息下次还能读——所以"少消费"不会变成"丢消息"：
`--limit 6` 后提交位点 2+3+1=6，堆积正好少 6 条。

**为什么 `Consume` 要放在 for 循环里**：它在 rebalance 时是**正常返回**（不是出错）。
只调用一次的话，组内有成员进出后，第一个实例就"看起来不消费了"。这是消费组最经典的坑，
所以循环收在 `kafkax.ConsumeGroup` 里，命令层只调一次，不会漏。

### `lag`

```
== Consumer lag group=demo-group topic=demo-topic ==
  PARTITION  COMMITTED  END  LAG
  0          3          217  214
  1          2          73   71
  2          1          102  101
  total lag: 386 records
```

`Committed` 来自 `OffsetFetch`，`End` 来自 `ListOffsets(Newest)`，差值即欠账；`Committed = -1`
表示从未提交。

**为什么用它**：消费"有没有跟上"只有这一个可靠信号。看日志只知道处理了哪些，不知道还差多少。

实现坑：`OffsetFetch` v8 之后响应结构从 `Blocks` 变成 `Groups`，必须用 `resp.GetBlock(topic, partition)`。

### `groups`

验证组是否存在、状态（`Stable` / `Empty` / `PreparingRebalance` / `CompletingRebalance`）、成员数。

**为什么**：`Empty` 是常态——进程退出后位点仍保留（默认 7 天，`offsets.retention.minutes`）。
理解这点才不会误以为"组没了位点也丢了"。

### `e2e`

```
go run . e2e                        # 自动建临时 topic，跑完删除
go run . e2e --messages 500         # 加大数据量
go run . e2e --topic my-topic --keep  # 用自己指定的 topic，且不删除
```

是**冒烟测试**：任何一步失败都以非 0 退出码结束，可放进 CI。topic 选择：不传 `--topic` 自动生成
`demo-e2e-<纳秒时间戳>` 并删除；传了则复用且**不删除**（避免误删你的数据）。

## e2e 的七步断言

| 步骤 | 断言 | 为什么必须有 |
|---|---|---|
| 1 连接 | broker 可发现、controller 可用 | 没有元数据，后面都是空谈 |
| 2 topic | 创建（或复用）后元数据可见 | 覆盖"异步建 topic"的时序坑 |
| 3 生产 | N 条全部拿到 ACK | 覆盖压缩、幂等、`acks=all` 全链路 |
| 4 分区 | 同一 key 落同一分区 | 有序性前提成立 |
| 5 消费 | 收满 N 条且分区内 offset 单调递增 | 不重不漏不乱序 |
| 6 位点 | 堆积回到基线（新 topic 基线为 0） | 位点真的提交了；用基线而非硬编码 0，才能在非空 topic 上复用 |
| 7 清理 | 删临时消费组；topic 按 `--keep` 决定 | 可重复执行，不污染集群 |

第 5 步有两个细节：

- 顺序：每个分区记录"上一条 offset"，新来的必须严格大于它，重复或乱序立刻失败；
- 完成判定**不能只等 ctx**：限额只在"下一条消息到来"时触发，收满后没有新消息就永远不触发
  `OnLimit`，所以改为轮询已消费条数。

## 关键代码走读

路径都相对 `public/demos/kafka/`。

**配置一开始就把"不丢消息"打开**：`Version=3.9.0.0` 对齐 broker；`RequiredAcks=WaitForAll`；
`Idempotent=true` 配合 `MaxOpenRequests=1`（幂等生产者的硬性要求）；`Offsets.Initial=OffsetOldest`。

**消息带 header**：`source` 与 `seq`，证明 header 会被完整保存与传递，这是链路验证常漏的一环。

**异步生产必须读干净两个 channel**：`Successes()` 与 `Errors()`，不读会内部 channel 阻塞、内存上涨。

**位点语义**：`MarkMessage` 只是本地标记，真正落盘靠提交；自动提交 + 处理失败 = 可能丢；
手动提交 + 成功再提交 = 至少一次，但可能重复，需要业务幂等。

**退出前补最后一次提交**：`--commit-every 5` 只消费 7 条时，最后 2 条不补提交会重复消费，
`Cleanup` 里补一次。

**输出与解析集中**：`WriteMessage` / `ParseOffset` 把 `oldest` 翻译成 `-2`、`newest` 翻译成 `-1`，
命令层不用记魔法数字。

## 一次实测记录

本机（单机 Docker、Go 1.25、小消息）的真实输出：

```
== Cluster health ==
  client addresses   : localhost:9092
  negotiated version : 3.9.0
  metadata refresh   : OK (4ms)
  brokers            : 1
  controller         : broker#1 localhost:9092
  topics             : 2 (including internal topics like __consumer_offsets)
```

```
========== End-to-end verification  topic=demo-e2e-... messages=30 ==========
Step 1/7 connect to the cluster
  [PASS] brokers discovered       1 found, addresses [localhost:9092]
  [PASS] controller available     broker#1 localhost:9092
Step 2/7 prepare topic (demo-e2e-...)
  created topic with 3 partitions, replication factor 1
  [PASS] topic visible            partitions=3
Step 3/7 produce 30 records (3 rotating keys)
  [PASS] records acked            30/30 records, took 56ms
Step 4/7 verify the same key maps to the same partition
  [PASS] key-partition stable     mapping map[user-0:1 user-1:0 user-2:0]
Step 5/7 consume with group demo-e2e-group-...
  collected all 30 records
  [PASS] records consumed         got 30, want 30
  [PASS] offsets monotonic        last offset per partition map[0:19 1:9]
Step 6/7 verify offsets are committed and lag is back to baseline
  [PASS] lag back to baseline     total lag 0 (baseline 0)
Step 7/7 cleanup
  deleted group demo-e2e-group-...
  deleted topic demo-e2e-...
```

在生产端还能看到同步与异步的差距：

```bash
go run . produce --messages 9              # 同步，约 400 条/秒
go run . produce --async --messages 200    # 异步，约 13000 条/秒
```

## 排错表

| 现象 | 大概率原因 | 怎么查 |
|---|---|---|
| 所有命令都连不上 | 容器没起 / 端口没映射 | `./scripts/kafka.sh status` |
| 能连上但一直卡住 | `ADVERTISED_LISTENERS` 是容器内地址 | 回到第一篇看 advertised 配置 |
| `create` 成功但 `describe` 说没有 | 建 topic 异步 | 项目已用 `WaitTopicVisible`；手动看 `topic list` |
| `NOT_LEADER_FOR_PARTITION` | 元数据过期 | 项目已对每个 topic 先 `RefreshMetadata`；手动可用 `Metadata.Retry.Max=5` 兜底 |
| 消费组"突然不消费" | rebalance 后没重新调 `Consume` | 确认循环在 `ConsumeGroup` 里 |
| `lag` 显示 `none` | 该组在此分区从未提交 | 正常，整段算未消费 |
| 条数比预期少 | key 哈希集中在少数分区 | `topic describe` 看分布 |
| 手动提交后仍重复 | 尾部未提交 | 看 `Cleanup` 是否补了 `Commit()` |
| `e2e` 在旧 topic 上失败 | 基线不是 0 却按 0 断言 | 断言应"回到基线"，而不是"lag=0" |

## 生产化清单

| 项 | demo | 生产建议 |
|---|---|---|
| 副本数 | 1 | 3（`min.insync.replicas=2`） |
| 自动建 topic | true | false，由平台统一建 |
| acks | all | all |
| 幂等/事务 | 幂等开 | 需要跨分区原子写再开事务 |
| 认证 | PLAINTEXT | SASL_SSL / mTLS |
| 监控 | 无 | lag、ISR 收缩、UnderReplicatedPartitions、磁盘水位 |
| 分区数 | 3 | 按峰值吞吐与并行度规划，避免事后扩容打乱映射 |
| 保留 | 7 天 | 按价值与容量定，必要时分层存储 |

可靠性来自"副本 + acks + 幂等/事务 + 消费端幂等"的组合，少一环都得不到"不丢不重"。

## 清理

```bash
./scripts/kafka.sh stop     # 停容器，数据卷保留
./scripts/kafka.sh reset    # 连数据卷删除，彻底回到初始状态
rm -rf bin                  # 编译产物
```

## 参考资料

- [Apache Kafka 官方文档](https://kafka.apache.org/documentation/)
- [KRaft 模式（无 ZooKeeper）](https://kafka.apache.org/documentation/#kraft)
- [sarama：本文 demo 使用的 Go 客户端](https://github.com/IBM/sarama)
- [franz-go：另一个常用 Go 客户端](https://github.com/twmb/franz-go)
- [cobra：命令行框架](https://github.com/spf13/cobra)

代码与脚本：[public/demos/kafka](https://github.com/zq-xu/zq-xu.github.io/tree/master/public/demos/kafka)
· 回到[第一篇：Kafka介绍与本地运行](./introduction.md) · [系列目录](./index.md)
