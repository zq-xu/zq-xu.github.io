#!/usr/bin/env bash
#
# Restart the kind node container and wait for the node to become Ready.
#
# Usage:
#   ./installation/single-node/scripts/restart-node.sh
#   CLUSTER_NAME=kind-dev ./installation/single-node/scripts/restart-node.sh
#
set -euo pipefail

CLUSTER_NAME="${CLUSTER_NAME:-kind-single}"
CONTEXT="${CONTEXT:-kind-${CLUSTER_NAME}}"
WAIT_TIMEOUT="${WAIT_TIMEOUT:-180s}"

die() { printf '[kind] error: %s\n' "$*" >&2; exit 1; }
log() { printf '[kind] %s\n' "$*"; }

for cmd in kind docker kubectl; do
  command -v "$cmd" >/dev/null 2>&1 || die "${cmd} is required"
done

nodes="$(kind get nodes --name "$CLUSTER_NAME")" || die "cluster ${CLUSTER_NAME} not found"
node="${nodes%%$'\n'*}"
[[ -n "$node" ]] || die "no node container found for ${CLUSTER_NAME}"

log "stop ${node}"
docker stop "$node" >/dev/null
log "start ${node}"
docker start "$node" >/dev/null

kubectl --context "$CONTEXT" wait \
  --for=condition=Ready nodes --all --timeout="$WAIT_TIMEOUT"
kubectl --context "$CONTEXT" get nodes -o wide
