#!/usr/bin/env bash
#
# Render a multi-node kind config from the templates.
#
# Usage:
#   ./installation/multiple-node/yaml/render-config.sh
#   LAYOUT=ha ./installation/multiple-node/yaml/render-config.sh
#
# Environment overrides:
#   LAYOUT=standard|ha
#   DATA_DIR=${HOME}/.kind-multiple-node/<cluster-name>
#   NODE_IMAGE=kindest/node:v1.37.0
#   OUTPUT=<layout>.local.yaml
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LAYOUT="$(printf '%s' "${LAYOUT:-standard}" | tr '[:upper:]' '[:lower:]')"
NODE_IMAGE="${NODE_IMAGE:-kindest/node:v1.37.0}"

die() { printf '[kind] error: %s\n' "$*" >&2; exit 1; }

escape_sed() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//&/\\&}"
  value="${value//|/\\|}"
  printf '%s' "$value"
}

case "$LAYOUT" in
  standard)
    TEMPLATE="${ROOT_DIR}/yaml/kind-multi.yaml"
    DEFAULT_DATA_DIR="${HOME}/.kind-multiple-node/kind-multi"
    DEFAULT_OUTPUT="${ROOT_DIR}/yaml/kind-multi.local.yaml"
    NODE_DIRS=(control-plane worker-1 worker-2)
    ;;
  ha)
    TEMPLATE="${ROOT_DIR}/yaml/kind-ha.yaml"
    DEFAULT_DATA_DIR="${HOME}/.kind-multiple-node/kind-ha"
    DEFAULT_OUTPUT="${ROOT_DIR}/yaml/kind-ha.local.yaml"
    NODE_DIRS=(control-plane-1 control-plane-2 control-plane-3 worker-1 worker-2 worker-3)
    ;;
  *)
    die "LAYOUT must be standard or ha: ${LAYOUT}"
    ;;
esac

DATA_DIR="${DATA_DIR:-${DEFAULT_DATA_DIR}}"
OUTPUT="${OUTPUT:-${DEFAULT_OUTPUT}}"

[[ "$DATA_DIR" = /* ]] || die "DATA_DIR must be an absolute path: ${DATA_DIR}"
[[ -f "$TEMPLATE" ]] || die "template not found: ${TEMPLATE}"

mkdir -p "$DATA_DIR"
for node in "${NODE_DIRS[@]}"; do
  mkdir -p "${DATA_DIR}/${node}"
done

DATA_ESC="$(escape_sed "$DATA_DIR")"
IMAGE_ESC="$(escape_sed "$NODE_IMAGE")"
sed \
  -e "s|\${DATA_DIR}|${DATA_ESC}|g" \
  -e "s|\${NODE_IMAGE}|${IMAGE_ESC}|g" \
  "$TEMPLATE" > "$OUTPUT"

printf '[kind] generated cluster configuration: %s\n' "$OUTPUT"
printf '[kind] host data directory: %s\n' "$DATA_DIR"
