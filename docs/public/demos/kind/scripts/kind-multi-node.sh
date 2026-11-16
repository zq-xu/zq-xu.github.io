#!/usr/bin/env bash
#
# Create and verify a multi-node kind cluster.
#
# Default layout: 1 control-plane + 2 workers.
# HA=true layout: 3 control-planes + 3 workers.
#
# Usage:
#   ./scripts/kind-multi-node.sh
#   HA=true ./scripts/kind-multi-node.sh
#
# Environment overrides:
#   CLUSTER_NAME=kind-multi
#   NODE_IMAGE=kindest/node:v1.37.0@sha256:<digest>
#   TAINT_CONTROL_PLANE=true
#
set -euo pipefail

CLUSTER_NAME="${CLUSTER_NAME:-kind-multi}"
KIND_VERSION="${KIND_VERSION:-v0.33.0}"
NODE_IMAGE="${NODE_IMAGE:-kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5}"
HA="${HA:-false}"
TAINT_CONTROL_PLANE="${TAINT_CONTROL_PLANE:-true}"
CONTEXT="kind-${CLUSTER_NAME}"

CONFIG_FILE="$(mktemp "${TMPDIR:-/tmp}/kind-multi.XXXXXX.yaml")"
cleanup() { rm -f "$CONFIG_FILE"; }
trap cleanup EXIT

log() { printf '[kind] %s\n' "$*"; }
die() { printf '[kind] error: %s\n' "$*" >&2; exit 1; }

require_tools() {
  command -v docker >/dev/null 2>&1 || die "docker is required"
  docker info >/dev/null 2>&1 || die "the docker daemon is not running"
  command -v kind >/dev/null 2>&1 || die "kind is required; install kind ${KIND_VERSION} first"
  command -v kubectl >/dev/null 2>&1 || die "kubectl is required"
}

node_entry() {
  local role="$1"
  printf -- "- role: %s\n  image: %s\n" "$role" "$NODE_IMAGE"
}

write_config() {
  {
    printf 'kind: Cluster\napiVersion: kind.x-k8s.io/v1alpha4\nnodes:\n'
    cat <<EOF
- role: control-plane
  image: ${NODE_IMAGE}
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 8080
    protocol: TCP
  - containerPort: 443
    hostPort: 8443
    protocol: TCP
EOF
    if [[ "$HA" == "true" ]]; then
      node_entry control-plane
      node_entry control-plane
      node_entry worker
      node_entry worker
      node_entry worker
    else
      node_entry worker
      node_entry worker
    fi
  } > "$CONFIG_FILE"
  log "generated cluster configuration: ${CONFIG_FILE}"
}

create_cluster() {
  if kind get clusters 2>/dev/null | grep -qx "$CLUSTER_NAME"; then
    log "cluster ${CLUSTER_NAME} already exists"
    return
  fi
  log "creating cluster ${CLUSTER_NAME}"
  kind create cluster --config "$CONFIG_FILE" --name "$CLUSTER_NAME" --wait 180s
}

taint_control_planes() {
  if [[ "$TAINT_CONTROL_PLANE" != "true" ]]; then
    log "control-plane taint disabled by TAINT_CONTROL_PLANE=${TAINT_CONTROL_PLANE}"
    return
  fi

  local nodes
  nodes="$(kubectl --context "$CONTEXT" get nodes \
    -l node-role.kubernetes.io/control-plane \
    -o jsonpath='{.items[*].metadata.name}')"
  for node in $nodes; do
    kubectl --context "$CONTEXT" taint node "$node" \
      node-role.kubernetes.io/control-plane:NoSchedule --overwrite >/dev/null
  done
  log "control-plane nodes tainted: ${nodes}"
}

verify_cluster() {
  log "waiting for nodes to become ready"
  kubectl --context "$CONTEXT" wait \
    --for=condition=Ready nodes --all --timeout=300s

  kubectl --context "$CONTEXT" get nodes -o wide
  kubectl --context "$CONTEXT" get pods -A -o wide
  log "cluster ${CLUSTER_NAME} is ready (kubectl context: ${CONTEXT})"
}

main() {
  require_tools
  write_config
  create_cluster
  taint_control_planes
  verify_cluster
}

main "$@"
