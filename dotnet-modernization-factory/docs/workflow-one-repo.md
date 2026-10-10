# One-repository workflow

1. **Discover:** resolve repo URL, default branch, owner, language, and access.
2. **Scan:** collect manifests, project files, scripts, lockfiles, tests, Docker/IIS settings. Read-only.
3. **Classify:** deterministic rules choose recipe; uncertainty routes to human review.
4. **Assess:** AI summarizes evidence and risks; scanner facts remain authoritative.
5. **Approve contract:** select target runtime, app port, health endpoints, route, secrets, resources, compatibility decisions.
6. **Plan:** AI proposes bounded changes; policy checks required steps.
7. **Create isolated worktree/branch:** never modify default branch directly.
8. **Transform:** scripts/templates for mechanical changes; AI for semantic code changes.
9. **Validate:** restore/build/test/lint/security scans; collect logs and exit codes.
10. **Containerize:** use approved base images and deterministic lockfile-based builds.
11. **Validate OpenShift:** schema/policy checks and deployment to a non-production namespace.
12. **Smoke/regression test:** endpoints, authentication, routes, critical business journeys.
13. **Review and PR:** publish diff, report, risks, evidence, and unresolved exceptions.
14. **Deploy:** existing controlled CI/CD with human approval; factory does not bypass deployment policy.
15. **Learn:** classify failures; update shared recipes only when the fix is general and tested.
