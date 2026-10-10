---
name: openshift-readiness
description: Assess whether a .NET 10 app is suitable for a Linux container on OpenShift 4.
disable-model-invocation: true
---
Check the approved port and health paths, non-root/arbitrary UID operation, writable directories, read-only filesystem compatibility, externalized configuration, Secret handling, TLS termination, readiness/liveness probes, resource requests/limits, graceful shutdown, structured logs to stdout/stderr, persistent storage needs, outbound connectivity, and container base-image policy. Do not invent resources or claim cluster compatibility without manifest validation and a non-production deployment. Report all missing evidence.
