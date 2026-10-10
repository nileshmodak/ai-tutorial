# Architecture

## Control plane
- **CLI/orchestrator:** schedules jobs, persists state, limits concurrency, and produces per-repo reports.
- **Scanner:** read-only deterministic file and metadata discovery.
- **Classifier:** policy/rule-driven routing to a recipe; unknown cases go to review.
- **AI adapters:** provider boundary for Copilot or another approved coding agent. Keep provider-specific execution behind an interface.
- **Recipe runners:** .NET, React static/Nginx, Node API, and React+Node workflows.
- **Validation engine:** executes commands in isolated worktrees/CI runners and records logs/exit codes.
- **Template engine:** generates approved Docker/OpenShift/CI files from a versioned platform contract.
- **Audit/reporting:** stores inputs, rule versions, agent model/tool version, diffs, test outcomes, approvals, and artifact digests.

## Data flow
Discover -> Scan -> Classify -> Assess -> Approve contract -> Plan -> Transform in isolated branch -> Build/Test/Security -> Containerize -> Validate manifests -> Deploy to non-production -> Smoke/regression test -> Human approval -> production pipeline.

## Determinism
Determinism comes from pinned tools, lockfiles, versioned rules/templates, stable command execution, immutable artifacts, and quality gates—not from expecting an LLM to generate identical output. Save prompts and model/tool versions for audit, but treat AI output as nondeterministic and reviewable.

## Parallelism
Use a bounded queue and per-repo isolation. Begin with 2-3 concurrent pilot jobs. Increase only after measuring runner capacity, AI quota, CI duration, and failure rates. Avoid concurrent writes to the same repository/branch.
