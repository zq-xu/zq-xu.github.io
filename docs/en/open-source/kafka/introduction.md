# Kafka in Brief, and Running It Locally

What Kafka is, why it is designed this way, when it fits, and how to bring up a working single-node
cluster on your machine with one `docker run`.

Then continue with [part two: Kafka verification with a Golang project](./golang-verification.md), which
exercises producing, consuming, consumer groups, offsets and partitions. Back to the
[series index](./index.md).

The demo lives at
[`public/demos/kafka`](https://github.com/zq-xu/zq-xu.github.io/tree/master/public/demos/kafka)
in this site's repository; part two walks through its structure.

## What Kafka is

One sentence: **Kafka is a distributed commit log that appends records to disk in order, and lets
many consumers read at their own pace.**

Three keywords carry the idea:

- **Sequential writes**: records are only appended to the end of a log, and sequential disk I/O is
  far faster than random writes;
- **Not deleted on delivery**: records expire by a retention policy (time or size), not because
  someone read them, so the same data can be replayed;
- **Independent progress**: every consumer keeps its own offset, so slow and fast consumers do not
  affect each other.

This is what makes it a **high-throughput event streaming platform** rather than a task queue.

### The journey of one record

1. The producer picks a partition: `hash(key) % partitions` when a key is present, round-robin or
   sticky when it is not;
2. The record is appended to that partition's log and the broker returns its offset
   (`acks=all` also waits for the in-sync replicas);
3. Offsets increase strictly inside a partition; there is no order across partitions;
4. Consumers fetch from their own offset and commit "the next position to read" after processing;
5. A consumer group splits partitions between its members — **one partition belongs to exactly one
   member at a time**;
6. Expired data is deleted by retention, but offsets stay, so reading from an old offset yields an
   out-of-range error.

### Core model

| Concept | Meaning | Note |
|---|---|---|
| Broker | One server node | The local demo has a single one |
| Topic | Logical category | Made of partitions |
| Partition | An ordered log, **the unit of parallelism** | Partition count caps consumer parallelism |
| Offset | Position inside a partition | What gets committed is "the next offset" |
| Replica / Leader / Follower | Copies / primary / secondary | Only the leader serves reads and writes |
| ISR | Replicas in sync with the leader | `acks=all` waits for the whole ISR |
| Consumer Group | Group of consumers | One partition goes to one member at a time |
| Rebalance | Partition reassignment | Triggered by members joining or leaving; consumption pauses |
| `__consumer_offsets` | Internal topic storing offsets | 50 partitions by default |

Four rules that bite:

- Partition count only grows, never shrinks;
- The same key always maps to the same partition (`HashPartitioner`); changing the partition count
  changes the mapping;
- Consumer parallelism is capped by the partition count; extra consumers just idle;
- `MarkMessage` means `MarkOffset(offset+1)` — it commits "the next offset".

### What it does

- **Read, write and durability**: publish/subscribe, replay by `retention.ms`, log compaction
  (keep the latest record per key)
- **Parallelism and fault tolerance**: partition-level parallelism, replicas and ISR, consumer groups
  with automatic rebalance
- **Ordering and reliability**: per-partition ordering, idempotent production, transactions
- **Ecosystem and governance**: compression (gzip / snappy / lz4 / zstd), Kafka Connect, Kafka
  Streams, quotas and multi-tenancy

### Typical uses

- Log and metric collection
- User behaviour tracking
- CDC: binlog → Kafka → cache / search / warehouse
- Event-driven microservices
- Stream processing ingress (Flink / Kafka Streams)
- Traffic smoothing and historical replay
- Event sourcing and audit

### Rough performance

| Metric | Order of magnitude | Factors |
|---|---|---|
| Single broker writes | Hundreds of thousands to millions of small records/s, hundreds of MB/s | Record size, batching, compression, `acks`, sequential disk writes |
| Single broker reads | Same order or higher | Page cache, fetch size, decompression |
| Latency | `acks=0` sub-millisecond; `acks=1` 1–3 ms; `acks=all` a few ms in one DC | acks, replica count, cross-DC RTT |
| Single partition | Commonly around 10 MB/s | One partition is a sequential bottleneck; scale with partitions |
| Retention | TB to PB | Disk capacity, retention policy, compression ratio |

Public reference points: LinkedIn has reported trillions of messages per day, and Netflix and Uber
operate at millions of events per second.

Measured locally (single Docker broker, single Go client, small records, `acks=all` + idempotence):

| Mode | Result |
|---|---|
| Sync produce (one ACK per record) | 9–12 records in 19–29 ms ≈ **400 records/s** |
| Async produce (batched) | 200 records in 15 ms ≈ **13,000 records/s** |

The 30× gap is entirely "waiting for one network round trip per record". When throughput is low,
first check whether the client is sending synchronously, one at a time.

### When to choose Kafka

**Good fit**: high-throughput event streams that must be durable and replayable; several downstream
consumers reading the same data at different speeds; per-key ordering; a stream processing ingress or
CDC; eventual consistency and asynchronous processing are acceptable.

**Poor fit**:

| Scenario | Better choice | Why |
|---|---|---|
| Complex routing, delayed queues, priorities | RabbitMQ | Kafka has no per-message routing or priority |
| Lightweight single-node "just a queue" | Redis Stream / RabbitMQ | Kafka has more moving parts and tuning |
| Task dispatch (per-message ack and retry) | RabbitMQ / SQS | Kafka acknowledges at partition-offset granularity |
| Huge multi-tenant setups with tiered storage | Pulsar | Kafka needs extra components |
| Synchronous service calls | gRPC / HTTP | A broker only adds latency |
| Tiny volumes (tens of thousands per day) | A database table / cron job | Operational cost outweighs the benefit |

In one line: **log/event streams + throughput + replay → Kafka; task distribution + fine routing +
low-latency acknowledgement → RabbitMQ-style brokers.**

## Running a single-node Kafka locally

The setup below uses the official Kafka 3.9.1 image in KRaft mode: one node acts as both broker and
controller, no ZooKeeper, and no JDK on the host — everything stays inside the container.

### Prerequisites

| Item | Requirement | Note |
|---|---|---|
| Docker | Docker Desktop / Engine | Docker Desktop on macOS |
| Memory | At least 2 GB for Docker | The broker heap is around 1 GB; leave room for the page cache |
| Port | Host port 9092 free | Port 9093 is the controller and is not published |
| Java | **Not needed** | Bundled in the image |
| Disk | 5 GB+ recommended | Default retention is 7 days, so logs keep growing |

### Option 1: one docker run

Create the volume, then start the container:

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

What each setting does:

| Setting | Value | Purpose |
|---|---|---|
| `--name` / `--restart` | kafka-demo / unless-stopped | Fixed name; comes back after a Docker restart |
| `-p` | 9092:9092 | Host clients connect on 9092 |
| `-v` | kafka-demo-data:/var/lib/kafka/data | Data lives in a named volume, surviving container re-creation |
| `CLUSTER_ID` | fixed string | KRaft cluster ID used when formatting the storage directory |
| `KAFKA_NODE_ID` | 1 | Node ID |
| `KAFKA_PROCESS_ROLES` | broker,controller | One node plays both roles; no ZooKeeper |
| `KAFKA_CONTROLLER_QUORUM_VOTERS` | 1@localhost:9093 | A single-node quorum is itself |
| `KAFKA_LISTENERS` | PLAINTEXT://:9092, CONTROLLER://:9093 | Clients on 9092, controller on 9093 |
| `KAFKA_ADVERTISED_LISTENERS` | PLAINTEXT://localhost:9092 | **The address handed to clients**; wrong value breaks connections |
| `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR` | 1 | Must be 1 on a single broker |
| `KAFKA_TRANSACTION_STATE_LOG_*` | 1 / 1 | Replication and min ISR for the transaction topic; also 1 |
| `KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS` | 0 | Removes the initial rebalance delay for faster local debugging |
| `KAFKA_NUM_PARTITIONS` | 3 | Default partition count for auto-created topics |
| `KAFKA_AUTO_CREATE_TOPICS_ENABLE` | true | Convenient for a demo; disable in production |
| `KAFKA_LOG_DIRS` | /var/lib/kafka/data | Exactly the volume mount point |

The `--health-cmd` probe runs `kafka-topics.sh --list` inside the container: a broker that can list
topics is actually serving. Combine it with `docker inspect` to wait for `healthy` before running
clients, avoiding the "connected but not ready" kind of false failure.

> The classic trap is `ADVERTISED_LISTENERS`: a client connects to 9092 for metadata, and the broker
> addresses in that metadata are exactly the advertised ones. Set it to a container-internal hostname
> and a host-side client will try to connect somewhere it cannot resolve — the symptom is "connects,
> then times out forever".

### Option 2: manage it with the script

Read the raw command once; day to day the script that ships with the demo is easier. The snippet
assumes the repository is already cloned:

```bash
git clone https://github.com/zq-xu/zq-xu.github.io.git
cd zq-xu.github.io/public/demos/kafka

./scripts/kafka.sh start     # create the container if missing, then wait for healthy
./scripts/kafka.sh status    # container status, ports and data volume
./scripts/kafka.sh logs      # follow the broker log (first stop when debugging)
./scripts/kafka.sh stop      # stop the container, keep the data volume
./scripts/kafka.sh restart   # stop + start
./scripts/kafka.sh reset     # remove the container and the volume, back to a clean slate
```

Environment variables override the defaults without editing the file:

```bash
KAFKA_PORT=19092 KAFKA_CONTAINER=kafka-test ./scripts/kafka.sh start
```

Available variables: `KAFKA_IMAGE`, `KAFKA_PORT`, `KAFKA_CONTAINER`, `KAFKA_VOLUME`, `CLUSTER_ID`.

### Confirm the cluster actually works

Three steps, from "the process is up" to "it reads and writes":

```bash
# 1. The container is running and healthy
docker ps --filter name=kafka-demo
docker inspect -f '{{.State.Health.Status}}' kafka-demo     # expect healthy

# 2. The broker answers metadata requests
docker exec kafka-demo /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 --list

# 3. Smoke-test writes and reads with the bundled CLI
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

Reading back the two lines proves "create topic → produce → consume" works on your machine. For
consumer groups, offsets and partitions, continue with the Go project in
[part two](./golang-verification.md).

### Where the data lives, and what restarts do

| Operation | Data | Note |
|---|---|---|
| `docker stop` / `docker start` | Kept | Container and volume both stay |
| `docker rm` then `docker run` again | Kept | As long as the volume name is the same |
| `./scripts/kafka.sh reset` | **Deleted** | Container and volume removed; next start is a fresh cluster |
| Upgrading the image | Kept | The same volume works with a newer version; downgrading across majors is not advised |

`docker volume inspect kafka-demo-data` shows where the volume lives.

### Common issues

| Symptom | Likely cause | How to check |
|---|---|---|
| `port is already allocated` | 9092 is taken | `lsof -i :9092`, or use another `KAFKA_PORT` |
| Container stays `unhealthy` | Internal topics not ready, disk full, low memory | `./scripts/kafka.sh logs` |
| Connects but every request times out | `ADVERTISED_LISTENERS` is not `localhost:9092` | `docker inspect` the environment variables |
| `NOT_LEADER_FOR_PARTITION` | Stale metadata (common right after creating a topic) | Retry shortly, or describe once |
| Image pull is very slow | Network / registry mirror | Configure a Docker registry mirror |
| Fails to start on Apple Silicon | Wrong architecture pulled | Use the multi-arch `apache/kafka:3.9.1` image |

### How far this is from production

| Item | Local demo | Production |
|---|---|---|
| Nodes | 1 (broker and controller in one process) | At least 3 brokers + 3 controllers |
| Replication factor | 1 | 3 (`min.insync.replicas=2`) |
| Auto topic creation | true | false; topics created by the platform |
| Security | PLAINTEXT | SASL_SSL / mTLS |
| Monitoring | None | Lag, ISR shrinkage, UnderReplicatedPartitions, disk usage |
| Retention | 7 days by default | Based on value and capacity; tiered storage when needed |

This local setup exists for **functional verification and debugging** only — never put real data on it.

## Next

With the cluster running, move on to
[Kafka verification with a Golang project](./golang-verification.md): project structure, what each
subcommand verifies, and what the seven end-to-end assertions cover.
