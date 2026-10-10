#!/usr/bin/env bash
set -euo pipefail
: "${IMAGE:?Set IMAGE to the built image reference}"
command -v docker >/dev/null || command -v podman >/dev/null || { echo "docker or podman is required" >&2; exit 2; }
ENGINE="$(command -v podman || command -v docker)"
"$ENGINE" image inspect "$IMAGE" >/dev/null
if command -v trivy >/dev/null; then trivy image --exit-code 1 --severity HIGH,CRITICAL "$IMAGE"; else echo "WARNING: trivy not installed; image scan not performed" >&2; fi
if command -v oc >/dev/null; then oc version; else echo "WARNING: oc not installed; OpenShift checks not performed" >&2; fi
