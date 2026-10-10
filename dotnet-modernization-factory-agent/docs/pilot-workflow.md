# Pilot workflow (one repository)

1. Clone/fetch to an isolated workspace and record source SHA.
2. Run `scan-repos.ps1`; manually verify the findings.
3. Start Claude Code from this repository root and run `/assess-dotnet-repo`.
4. Run `/plan-dotnet-migration`; review and approve a migration contract.
5. Create a branch/worktree. Never work on the protected default branch.
6. Apply one bounded transformation at a time. Use scripts for mechanical changes; use Claude Code for semantic changes only after approval.
7. Run restore/build/tests and security checks after every bounded step.
8. Build an approved Linux container image; validate manifests and OpenShift security constraints.
9. Deploy only to a non-production namespace through existing CI/CD.
10. Run smoke tests and business regression tests; review diff and evidence.
11. Open a PR; require code-owner and platform/security approval.
12. Promote through the normal release pipeline. The factory must not bypass deployment approval.

Pilot set: one simple Web API, one MVC app, one WebForms app, one WCF service, and one app with Windows dependencies. The first two validate the golden path; the others validate reliable blocker routing.
