---
description: "Run a single-node Kafka 3.9.1 locally with the official image (KRaft mode, no ZooKeeper, no JDK on the host): prerequisites and Docker install, two ways to start it with docker run or the script, verification, data persistence, common issues and the gap to production."
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

# Running Kafka Locally

This setup uses the official Kafka 3.9.1 image `apache/kafka:3.9.1` in KRaft (Kafka Raft — Raft-based metadata management that replaces ZooKeeper) mode: a single node plays both broker and controller, so there is no ZooKeeper and no JDK (Java Development Kit) on the host — everything runs inside the container.

Its only purpose is a local cluster for functional verification and debugging; do not put real data on it. Concepts and selection are covered in [Kafka Concepts and When to Use It](./introduction).

## Prerequisites

| Item | Requirement | Notes |
|---|---|---|
| Docker | Docker Desktop / Engine | Docker Desktop is recommended on macOS |
| Memory | At least 2 GB for Docker | The broker uses about 1 GB of heap, the rest is page cache |
| Port | Host port 9092 free | 9093 is the controller port inside the container and is not published |
| Java | **Not needed** | Bundled in the image |
| Disk | 5 GB+ recommended | The default retention is 7 days, so logs keep growing |

### Install Docker

On macOS install Docker Desktop with Homebrew:

```bash
brew install --cask docker-desktop
open -a Docker

# wait for Docker Desktop to finish its first start and authorization
docker info
```

On Linux install Docker Engine:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

`usermod` changes group membership, which takes effect after you log in again; run `newgrp docker` in the current terminal to enter a new shell immediately. Confirm the daemon is usable:

```bash
docker info
```

## Option 1: one docker run

Create the volume first, then start the container:

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

The important settings, one by one:

| Setting | Value | Purpose |
|---|---|---|
| `--name` / `--restart` | kafka-demo / unless-stopped | fixed container name, restarted with Docker |
| `-p` | 9092:9092 | host clients connect on 9092 |
| `-v` | kafka-demo-data:/var/lib/kafka/data | data in a named volume, survives container recreation |
| `CLUSTER_ID` | fixed string | KRaft cluster id, used to format the storage directories |
| `KAFKA_NODE_ID` | 1 | node id |
| `KAFKA_PROCESS_ROLES` | broker,controller | one node plays both roles, no ZooKeeper needed |
| `KAFKA_CONTROLLER_QUORUM_VOTERS` | 1@localhost:9093 | single-node quorum has only itself |
| `KAFKA_LISTENERS` | PLAINTEXT://:9092, CONTROLLER://:9093 | clients on 9092, controller on 9093 |
| `KAFKA_ADVERTISED_LISTENERS` | PLAINTEXT://localhost:9092 | **the address clients get back**; wrong value means no connection |
| `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR` | 1 | must be 1 on a single node |
| `KAFKA_TRANSACTION_STATE_LOG_*` | 1 / 1 | replication factor and min ISR for transaction topics, same reason |
| `KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS` | 0 | skips the initial consumer-group rebalance wait for faster local runs |
| `KAFKA_NUM_PARTITIONS` | 3 | default partition count for auto-created topics |
| `KAFKA_AUTO_CREATE_TOPICS_ENABLE` | true | convenient for demos, disable in production |
| `KAFKA_LOG_DIRS` | /var/lib/kafka/data | exactly the volume mount point |

`--health-cmd` runs `kafka-topics.sh --list` inside the container: listing topics proves the broker can really serve. Combined with `docker inspect` you can wait for `healthy` before running clients and avoid the false failure of "connected but the broker is not ready".

> The most common mistake is `ADVERTISED_LISTENERS`: a client connects to 9092 for metadata, and the broker address returned by that metadata is the advertised one. If it contains a container-internal hostname, a client on the host tries to resolve an address that does not exist, which shows up as "connects but always times out".

## Option 2: manage it with the script

Reading the raw command once is enough; day to day use the script shipped with the demo project. Assuming the repository is cloned locally:

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

Overridable environment variables: `KAFKA_IMAGE`, `KAFKA_PORT`, `KAFKA_CONTAINER`, `KAFKA_VOLUME`, `CLUSTER_ID` — no need to edit the file:

```bash
KAFKA_PORT=19092 KAFKA_CONTAINER=kafka-test ./scripts/kafka.sh start
```

## Verification

Three checks, from "the container runs" to "it can read and write":

```bash
# 1. the container is running and healthy
docker ps --filter name=kafka-demo
docker inspect -f '{{.State.Health.Status}}' kafka-demo     # expect healthy

# 2. the broker answers metadata requests
docker exec kafka-demo /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 --list

# 3. smoke-test create, produce and consume with the bundled CLI (command-line interface)
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

Reading back the two lines you just wrote proves that the create topic → produce → consume path works on this machine. Consumer groups, offsets and partitions are then verified one by one in [Kafka Verification with a Golang Project](./golang-verification).

## Data persistence and container lifecycle

| Operation | Data | Notes |
|---|---|---|
| `docker stop` / `docker start` | kept | container and volume both survive |
| `docker rm` then a new `docker run` | kept | the logs stay as long as the volume name is unchanged |
| `./scripts/kafka.sh reset` | **wiped** | removes container and volume; the next start is a fresh cluster |
| Image upgrade | kept | the same volume works with a newer version; downgrade across majors is not advised |

Inspect the volume location with `docker volume inspect kafka-demo-data`.

## Common issues

| Symptom | Likely cause | How to check |
|---|---|---|
| `port is already allocated` | something else uses 9092 | `lsof -i :9092`, or change `KAFKA_PORT` |
| Container stays `unhealthy` | internal topics not created, disk full, not enough memory | `./scripts/kafka.sh logs` |
| Connects but requests always time out | `ADVERTISED_LISTENERS` is not `localhost:9092` | `docker inspect` and read the environment |
| Client reports `NOT_LEADER_FOR_PARTITION` | stale metadata, common right after topic creation | retry, or run `--describe` once |
| Slow image pull | network or registry mirror | configure a Docker mirror or change network |
| Fails to start on Apple Silicon | wrong architecture pulled | confirm you use the multi-arch `apache/kafka:3.9.1` |

## Differences from production

| Item | This local demo | Production advice |
|---|---|---|
| Nodes | 1 (broker and controller in one process) | at least 3 brokers + 3 controllers |
| Replication factor | 1 | 3 (`min.insync.replicas=2`) |
| Topic auto-creation | true | false, created centrally by the platform |
| Security | PLAINTEXT (no auth, no encryption) | SASL_SSL (SASL auth + TLS) or mTLS (mutual TLS) |
| Monitoring | none | lag, ISR shrink, UnderReplicatedPartitions, disk watermark |
| Retention | 7 days by default | value and capacity driven, tiered storage if needed |

This local setup exists for **functional verification and debugging only**; do not run real data on it.

With the cluster ready, verify production, consumption, consumer groups and offsets step by step in [Kafka Verification with a Golang Project](./golang-verification).

