#!/usr/bin/env bash
#
# Restart every node container of a multi-node kind cluster and wait for readiness.
#
# Usage:
#   ./installation/multiple-node/scripts/restart-nodes.sh
#   CLUSTER_NAME=kind-ha ./installation/multiple-node/scripts/restart-nodes.sh
#
set -euo pipefail

CLUSTER_NAME="${CLUSTER_NAME:-kind-multi}"
CONTEXT="${CONTEXT:-kind-${CLUSTER_NAME}}"
WAIT_TIMEOUT="${WAIT_TIMEOUT:-300s}"

die() { printf '[kind] error: %s\n' "$*" >&2; exit 1; }
log() { printf '[kind] %s\n' "$*"; }

for cmd in kind docker kubectl; do
  command -v "$cmd" >/dev/null 2>&1 || die "${cmd} is required"
done

nodes="$(kind get nodes --name "$CLUSTER_NAME")" || die "cluster ${CLUSTER_NAME} not found"
[[ -n "$nodes" ]] || die "no node containers found for ${CLUSTER_NAME}"

for node in $nodes; do
  log "stop ${node}"
  docker stop "$node" >/dev/null
done

for node in $nodes; do
  log "start ${node}"
  docker start "$node" >/dev/null
done

kubectl --context "$CONTEXT" wait \
  --for=condition=Ready nodes --all --timeout="$WAIT_TIMEOUT"
kubectl --context "$CONTEXT" get nodes -o wide
