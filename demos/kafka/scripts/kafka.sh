#!/usr/bin/env bash
#
# Manage a single-node Kafka (KRaft mode) with plain docker commands.
# No docker compose involved: one docker run, all parameters visible here.
#
#   ./scripts/kafka.sh start     create the container if missing, then start it
#   ./scripts/kafka.sh stop      stop the container
#   ./scripts/kafka.sh restart   stop then start
#   ./scripts/kafka.sh status    show container status
#   ./scripts/kafka.sh logs      follow the broker log
#   ./scripts/kafka.sh reset     remove the container and the data volume
#
# Environment overrides:
#   KAFKA_IMAGE=apache/kafka:3.9.1 KAFKA_PORT=9092 KAFKA_CONTAINER=kafka-demo \
#     ./scripts/kafka.sh start

set -euo pipefail

IMAGE="${KAFKA_IMAGE:-apache/kafka:3.9.1}"
CONTAINER="${KAFKA_CONTAINER:-kafka-demo}"
VOLUME="${KAFKA_VOLUME:-kafka-demo-data}"
HOST_PORT="${KAFKA_PORT:-9092}"
CLUSTER_ID="${CLUSTER_ID:-4L6g3nShT-eMCtK--X86sw}"

usage() {
  cat <<'EOF'
Usage: ./scripts/kafka.sh <command>

  start     create the container if missing, then start it and wait for healthy
  stop      stop the container (the data volume is kept)
  restart   stop then start
  status    show container status
  logs      follow the broker log
  reset     remove the container and the data volume (all Kafka data is lost)

Environment overrides:
  KAFKA_IMAGE, KAFKA_PORT, KAFKA_CONTAINER, KAFKA_VOLUME, CLUSTER_ID
EOF
  exit 1
}

container_exists() {
  docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER"
}

wait_healthy() {
  printf 'Waiting for Kafka to become healthy'
  for _ in $(seq 1 60); do
    status="$(docker inspect -f '{{.State.Health.Status}}' "$CONTAINER" 2>/dev/null || echo unknown)"
    case "$status" in
      healthy)
        printf ' ready\n'
        echo "broker address: localhost:${HOST_PORT}"
        return 0
        ;;
      unhealthy)
        printf ' failed\n'
        docker logs --tail 30 "$CONTAINER"
        return 1
        ;;
      *)
        printf '.'
        sleep 2
        ;;
    esac
  done
  printf ' timeout\n'
  docker logs --tail 30 "$CONTAINER"
  return 1
}

start() {
  if container_exists; then
    echo "Container ${CONTAINER} already exists, starting it"
    docker start "$CONTAINER" >/dev/null
  else
    echo "Creating container ${CONTAINER} (image ${IMAGE}, port ${HOST_PORT}->9092)"
    docker volume create "$VOLUME" >/dev/null

    # Key settings:
    #  KAFKA_PROCESS_ROLES=broker,controller  one node plays both roles (KRaft, no ZooKeeper)
    #  KAFKA_LISTENERS                        container-internal: 9092 clients, 9093 controller quorum
    #  KAFKA_ADVERTISED_LISTENERS             the address handed to clients, must be reachable
    #                                         from the host: localhost:9092
    #  KAFKA_CONTROLLER_QUORUM_VOTERS         a single-node quorum is itself
    #  KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR replication factor of __consumer_offsets, 1 on a single broker
    docker run -d \
      --name "$CONTAINER" \
      --restart unless-stopped \
      -p "${HOST_PORT}:9092" \
      -v "${VOLUME}:/var/lib/kafka/data" \
      -e CLUSTER_ID="$CLUSTER_ID" \
      -e KAFKA_NODE_ID=1 \
      -e KAFKA_PROCESS_ROLES=broker,controller \
      -e KAFKA_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
      -e KAFKA_ADVERTISED_LISTENERS="PLAINTEXT://localhost:${HOST_PORT}" \
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
      "$IMAGE" >/dev/null
  fi
  wait_healthy
}

stop() {
  if container_exists; then
    docker stop "$CONTAINER" >/dev/null && echo "Stopped ${CONTAINER}"
  else
    echo "Container ${CONTAINER} does not exist"
  fi
}

status() {
  if container_exists; then
    docker ps -a --filter "name=^${CONTAINER}$" \
      --format 'NAME={{.Names}}  STATUS={{.Status}}  PORTS={{.Ports}}'
    echo "data volume: ${VOLUME}"
  else
    echo "Container ${CONTAINER} does not exist"
  fi
}

logs() {
  docker logs -f --tail 50 "$CONTAINER"
}

reset() {
  echo "Removing container ${CONTAINER} and volume ${VOLUME} (all Kafka data will be lost)"
  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
  docker volume rm "$VOLUME" >/dev/null 2>&1 || true
  echo "Done; the next start creates a brand new cluster"
}

case "${1:-}" in
  start)   start ;;
  stop)    stop ;;
  restart) stop; start ;;
  status)  status ;;
  logs)    logs ;;
  reset)   reset ;;
  *)       usage ;;
esac
