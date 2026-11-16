#!/usr/bin/env bash
#
# Create and verify a single-node kind cluster.
#
# Usage:
#   ./scripts/kind-single-node.sh
#
# Environment overrides:
#   CLUSTER_NAME=kind-single
#   KIND_VERSION=v0.33.0
#   NODE_IMAGE=kindest/node:v1.37.0@sha256:<digest>
#
set -euo pipefail

CLUSTER_NAME="${CLUSTER_NAME:-kind-single}"
KIND_VERSION="${KIND_VERSION:-v0.33.0}"
NODE_IMAGE="${NODE_IMAGE:-kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5}"
CONTEXT="kind-${CLUSTER_NAME}"

log() { printf '[kind] %s\n' "$*"; }
die() { printf '[kind] error: %s\n' "$*" >&2; exit 1; }

require_tools() {
  command -v docker >/dev/null 2>&1 || die "docker is required"
  docker info >/dev/null 2>&1 || die "the docker daemon is not running"
  command -v kubectl >/dev/null 2>&1 || die "kubectl is required"
}

install_kind() {
  if command -v kind >/dev/null 2>&1; then
    log "using existing $(kind version)"
    log "note: this demo was verified with kind ${KIND_VERSION}"
    return
  fi

  local os arch target url
  os="$(uname -s | tr '[:upper:]' '[:lower:]')"
  case "$(uname -m)" in
    x86_64 | amd64) arch="amd64" ;;
    arm64 | aarch64) arch="arm64" ;;
    *) die "unsupported architecture: $(uname -m)" ;;
  esac
  case "$os" in
    darwin | linux) ;;
    *) die "unsupported operating system: ${os}" ;;
  esac

  target="${HOME}/.local/bin"
  mkdir -p "$target"
  url="https://kind.sigs.k8s.io/dl/${KIND_VERSION}/kind-${os}-${arch}"
  log "installing kind ${KIND_VERSION} to ${target}/kind"
  curl -fsSL -o "${target}/kind" "$url"
  chmod +x "${target}/kind"
  export PATH="${target}:${PATH}"
}

create_cluster() {
  if kind get clusters 2>/dev/null | grep -qx "$CLUSTER_NAME"; then
    log "cluster ${CLUSTER_NAME} already exists"
    return
  fi
  log "creating cluster ${CLUSTER_NAME} with ${NODE_IMAGE}"
  kind create cluster \
    --name "$CLUSTER_NAME" \
    --image "$NODE_IMAGE" \
    --wait 120s
}

verify_cluster() {
  log "waiting for nodes to become ready"
  kubectl --context "$CONTEXT" wait \
    --for=condition=Ready nodes --all --timeout=180s

  kubectl --context "$CONTEXT" get nodes -o wide
  kubectl --context "$CONTEXT" get storageclass
  kubectl --context "$CONTEXT" get pods -A
  log "cluster ${CLUSTER_NAME} is ready (kubectl context: ${CONTEXT})"
}

main() {
  require_tools
  install_kind
  create_cluster
  verify_cluster
}

main "$@"
