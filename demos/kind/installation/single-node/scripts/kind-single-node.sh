#!/usr/bin/env bash
#
# Create and verify a single-node kind cluster.
#
# Usage:
#   ./installation/single-node/scripts/kind-single-node.sh
#
# Environment overrides:
#   CLUSTER_NAME=kind-single
#   KIND_VERSION=v0.33.0
#   NODE_IMAGE=kindest/node:v1.37.0
#   DATA_DIR=${HOME}/.kind-single-node
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
CLUSTER_NAME="${CLUSTER_NAME:-kind-single}"
KIND_VERSION="${KIND_VERSION:-v0.33.0}"
NODE_IMAGE="${NODE_IMAGE:-kindest/node:v1.37.0}"
DATA_DIR="${DATA_DIR:-${HOME}/.kind-single-node}"
CONTEXT="kind-${CLUSTER_NAME}"

CONFIG_FILE="$(mktemp "${TMPDIR:-/tmp}/kind-single.XXXXXX.yaml")"
cleanup() { rm -f "$CONFIG_FILE"; }
trap cleanup EXIT

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

write_config() {
  DATA_DIR="$DATA_DIR" \
  NODE_IMAGE="$NODE_IMAGE" \
  OUTPUT="$CONFIG_FILE" \
  "${ROOT_DIR}/installation/single-node/yaml/render-config.sh"
}

create_cluster() {
  if kind get clusters 2>/dev/null | grep -qx "$CLUSTER_NAME"; then
    log "cluster ${CLUSTER_NAME} already exists"
    return
  fi
  log "creating cluster ${CLUSTER_NAME} with ${NODE_IMAGE}"
  kind create cluster \
    --name "$CLUSTER_NAME" \
    --config "$CONFIG_FILE" \
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
  write_config
  create_cluster
  verify_cluster
}

main "$@"
