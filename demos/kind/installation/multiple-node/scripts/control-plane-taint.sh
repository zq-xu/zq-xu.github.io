#!/usr/bin/env bash
#
# Apply or remove the NoSchedule taint on kind control-plane nodes.
#
# Usage:
#   ./installation/multiple-node/scripts/control-plane-taint.sh apply
#   CONTEXT=kind-kind-ha ./installation/multiple-node/scripts/control-plane-taint.sh apply
#   ./installation/multiple-node/scripts/control-plane-taint.sh remove
#
# Environment overrides:
#   CLUSTER_NAME=kind-multi
#   CONTEXT=kind-${CLUSTER_NAME}
#
set -euo pipefail

ACTION="${1:-}"
CLUSTER_NAME="${CLUSTER_NAME:-kind-multi}"
CONTEXT="${CONTEXT:-kind-${CLUSTER_NAME}}"

die() { printf '[kind] error: %s\n' "$*" >&2; exit 1; }
log() { printf '[kind] %s\n' "$*"; }

usage() {
  cat <<EOF
Usage: $(basename "$0") <apply|remove>

  apply   add node-role.kubernetes.io/control-plane:NoSchedule to every control-plane
  remove  remove the taint and restore Kind's default scheduling behaviour

Environment:
  CLUSTER_NAME=${CLUSTER_NAME}
  CONTEXT=${CONTEXT}
EOF
}

case "$ACTION" in
  apply | remove) ;;
  *) usage; exit 1 ;;
esac

command -v kubectl >/dev/null 2>&1 || die "kubectl is required"
kubectl --context "$CONTEXT" get nodes >/dev/null 2>&1 ||
  die "cannot reach cluster context ${CONTEXT}"

nodes="$(kubectl --context "$CONTEXT" get nodes \
  -l node-role.kubernetes.io/control-plane \
  -o jsonpath='{.items[*].metadata.name}')"
[[ -n "$nodes" ]] || die "no control-plane nodes found in ${CONTEXT}"

for node in $nodes; do
  if [[ "$ACTION" == "apply" ]]; then
    kubectl --context "$CONTEXT" taint node "$node" \
      node-role.kubernetes.io/control-plane:NoSchedule --overwrite >/dev/null
  else
    kubectl --context "$CONTEXT" taint node "$node" \
      node-role.kubernetes.io/control-plane:NoSchedule- >/dev/null
  fi
  log "${ACTION} ${node}"
done

kubectl --context "$CONTEXT" get nodes -o wide
