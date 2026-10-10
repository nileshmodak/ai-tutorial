#!/usr/bin/env bash
set -euo pipefail
DIR="${1:?Usage: validate-manifests.sh <manifest-directory>}"
if command -v kubeconform >/dev/null; then
  kubeconform -strict -summary "$DIR"
elif command -v kubectl >/dev/null; then
  kubectl apply --dry-run=client -f "$DIR"
else
  echo "Install kubeconform or kubectl to validate manifests" >&2
  exit 2
fi
