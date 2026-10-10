# Architecture

- **Scanner:** deterministic, read-only discovery and evidence collection.
- **Classification rules:** route repository to a recipe; unknown or high-risk repos require human review.
- **Claude Code skills:** assessment, plan proposal, diff review, and OpenShift readiness. Skills do not authorize code changes.
- **Migration contract:** human-approved source/target/architecture decisions.
- **Recipe runner:** bounded, isolated execution of scripts and AI-assisted edits.
- **Gates:** build, tests, static analysis, dependency/security scans, image scan, manifest validation, smoke/regression tests.
- **Audit/reporting:** SHA, rules version, diff, commands, exit codes, agent version, approvals and artifact digests.

Determinism comes from pinned SDKs/tools, lockfiles, versioned rules/templates, reproducible commands and quality gates—not from expecting identical AI output. AI output is a proposal and must be validated.
