#!/usr/bin/env bash
#
# Render the single-node kind config from the template.
#
# Usage:
#   ./installation/single-node/yaml/render-config.sh
#
# Environment overrides:
#   DATA_DIR=${HOME}/.kind-single-node
#   NODE_IMAGE=kindest/node:v1.37.0
#   OUTPUT=kind-single.local.yaml
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_DIR="${DATA_DIR:-${HOME}/.kind-single-node}"
NODE_IMAGE="${NODE_IMAGE:-kindest/node:v1.37.0}"
OUTPUT="${OUTPUT:-${ROOT_DIR}/yaml/kind-single.local.yaml}"
TEMPLATE="${ROOT_DIR}/yaml/kind-single.yaml"

die() { printf '[kind] error: %s\n' "$*" >&2; exit 1; }

escape_sed() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//&/\\&}"
  value="${value//|/\\|}"
  printf '%s' "$value"
}

[[ "$DATA_DIR" = /* ]] || die "DATA_DIR must be an absolute path: ${DATA_DIR}"
[[ -f "$TEMPLATE" ]] || die "template not found: ${TEMPLATE}"

mkdir -p "$DATA_DIR"

DATA_ESC="$(escape_sed "$DATA_DIR")"
IMAGE_ESC="$(escape_sed "$NODE_IMAGE")"
sed \
  -e "s|\${DATA_DIR}|${DATA_ESC}|g" \
  -e "s|\${NODE_IMAGE}|${IMAGE_ESC}|g" \
  "$TEMPLATE" > "$OUTPUT"

printf '[kind] generated cluster configuration: %s\n' "$OUTPUT"
printf '[kind] host data directory: %s\n' "$DATA_DIR"
