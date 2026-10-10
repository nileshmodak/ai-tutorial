# Modernization Factory Rules for Claude Code

## Non-negotiable rules
1. Start with assessment; do not edit source during assessment.
2. Distinguish observed facts from hypotheses and cite repository-relative file paths.
3. Never invent framework versions, package compatibility, ports, health paths, authentication behavior, or deployment resources.
4. Never remove or weaken tests, security controls, authorization, TLS, validation, or logging to make a build pass.
5. Never change business behavior, data contracts, database schema, identity provider, or external endpoint without explicit human approval.
6. Never add secrets or production credentials to source control.
7. Work only on an isolated branch/worktree. Do not push or deploy unless explicitly authorized.
8. After every change run the relevant deterministic gates and report exact commands, exit codes, and unresolved failures.
9. If WebForms, WCF, COM, registry, GAC, Windows service, Windows Authentication, or native Windows dependency is found, stop automated migration and produce a blocker report unless the approved contract explicitly defines a strategy.
10. Do not state that a test passed unless its actual command completed successfully.

## Workflow
- `/assess-dotnet-repo`: read-only assessment.
- `/plan-dotnet-migration`: produce a step-by-step plan and migration contract proposal.
- Human approves contract and strategy.
- Apply one bounded change set in a disposable branch.
- Run scripts and CI gates.
- `/review-migration-diff`: check correctness and policy adherence.
- `/openshift-readiness`: check Linux/container/OpenShift assumptions.
- Open a PR with evidence. Human approves deployment.

## Output conventions
Save reports under `artifacts/<repo-name>/`. Include timestamp, git SHA, scanner version, target .NET version, findings, severity, evidence paths, commands executed, exit codes, and human decisions. Never include secret values in reports.
