#!/usr/bin/env bash
#
# Build the demo image, load it into kind, deploy the manifests, and verify
# the service through a port-forward.
#
# Usage:
#   ./scripts/kind-demo-deploy.sh
#
# Environment overrides:
#   CLUSTER_NAME=kind-multi
#   IMAGE=kind-demo:v1
#   NAMESPACE=kind-demo
#   LOCAL_PORT=18080
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLUSTER_NAME="${CLUSTER_NAME:-kind-multi}"
IMAGE="${IMAGE:-kind-demo:v1}"
NAMESPACE="${NAMESPACE:-kind-demo}"
CONTEXT="kind-${CLUSTER_NAME}"
LOCAL_PORT="${LOCAL_PORT:-18080}"
PF_LOG="${TMPDIR:-/tmp}/kind-demo-port-forward.log"
PF_PID=""

log() { printf '[demo] %s\n' "$*"; }
die() { printf '[demo] error: %s\n' "$*" >&2; exit 1; }

cleanup() {
  if [[ -n "$PF_PID" ]]; then
    kill "$PF_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

require_tools() {
  command -v docker >/dev/null 2>&1 || die "docker is required"
  command -v kind >/dev/null 2>&1 || die "kind is required"
  command -v kubectl >/dev/null 2>&1 || die "kubectl is required"
  command -v curl >/dev/null 2>&1 || die "curl is required"
}

ensure_cluster() {
  if kind get clusters 2>/dev/null | grep -qx "$CLUSTER_NAME"; then
    return
  fi
  log "cluster ${CLUSTER_NAME} not found; creating it"
  CLUSTER_NAME="$CLUSTER_NAME" "${ROOT_DIR}/scripts/kind-multi-node.sh"
}

build_and_load() {
  log "building ${IMAGE}"
  docker build -t "$IMAGE" "${ROOT_DIR}/app"
  log "loading ${IMAGE} into ${CLUSTER_NAME}"
  kind load docker-image "$IMAGE" --name "$CLUSTER_NAME"
}

deploy() {
  kubectl --context "$CONTEXT" apply -f "${ROOT_DIR}/deploy/00-namespace.yaml"
  kubectl --context "$CONTEXT" apply -f "${ROOT_DIR}/deploy"
  kubectl --context "$CONTEXT" -n "$NAMESPACE" rollout status \
    deployment/kind-demo --timeout=180s
  kubectl --context "$CONTEXT" -n "$NAMESPACE" get pods -o wide
}

verify() {
  log "starting a temporary port-forward on 127.0.0.1:${LOCAL_PORT}"
  kubectl --context "$CONTEXT" -n "$NAMESPACE" port-forward \
    svc/kind-demo "${LOCAL_PORT}:80" >"$PF_LOG" 2>&1 &
  PF_PID=$!

  local ready="false"
  for _ in $(seq 1 30); do
    if curl -fsS "http://127.0.0.1:${LOCAL_PORT}/healthz" >/dev/null 2>&1; then
      ready="true"
      break
    fi
    if ! kill -0 "$PF_PID" 2>/dev/null; then
      cat "$PF_LOG"
      die "port-forward exited before the service became ready"
    fi
    sleep 1
  done
  if [[ "$ready" != "true" ]]; then
    cat "$PF_LOG"
    die "service did not become ready on 127.0.0.1:${LOCAL_PORT}"
  fi

  curl -fsS "http://127.0.0.1:${LOCAL_PORT}/healthz"
  curl -fsS "http://127.0.0.1:${LOCAL_PORT}/"
  log "service verified; keep access with:"
  log "kubectl --context ${CONTEXT} -n ${NAMESPACE} port-forward svc/kind-demo ${LOCAL_PORT}:80"
}

main() {
  require_tools
  ensure_cluster
  build_and_load
  deploy
  verify
}

main "$@"
