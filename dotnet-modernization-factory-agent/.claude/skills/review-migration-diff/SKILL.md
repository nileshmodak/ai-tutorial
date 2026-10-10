---
name: review-migration-diff
description: Review a modernization diff for behavior preservation, security, determinism, and policy compliance.
disable-model-invocation: true
---
Review the diff only; do not edit it. Check business behavior, routing, validation, authorization, authentication, anti-forgery, serialization contracts, database behavior, logging, secrets, Linux paths, container UID, health probes, config/secrets, and tests. Flag deleted/disabled tests and weakened security. Every finding needs severity, file/line evidence, impact and recommended next action. Conclude PASS/FAIL/BLOCKED; any blocker means FAIL or BLOCKED.
