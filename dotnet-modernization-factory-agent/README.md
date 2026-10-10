# .NET Modernization Factory

A practical starter repository to assess and modernize legacy .NET/IIS applications toward .NET 10 and Linux containers on OpenShift 4. The initial release is intentionally **read-only assessment + deterministic validation**; source migration is enabled only after an approved plan and isolated branch exist.

## Supported discovery targets
- ASP.NET MVC / Web API on .NET Framework
- ASP.NET WebForms (specialist review; it is not a framework-only upgrade)
- WCF services and clients (protocol/binding review required)
- Windows dependencies (COM, registry, GAC, Windows services, filesystem assumptions)
- Modern .NET applications that need a target framework upgrade

## Prerequisites
- Node.js 20+ to run the factory
- npm
- PowerShell 7 (`pwsh`) for scripts
- Git
- .NET 10 SDK for target build validation
- Optional: Docker/Podman, `oc`, `kubectl`, `yq`, `trivy`, `hadolint`

## Quick start
```bash
npm install
npm run build
node dist/cli.js scan --path /path/to/local/repos --out ./artifacts
node dist/cli.js validate-contract --contract ./contracts/sample-api.yaml
```

The scanner writes `inventory.json`, `inventory.csv`, and `summary.md`. It does not change scanned repositories.

## Claude Code
Start Claude Code from the repository root so it can read `CLAUDE.md` and `.claude/skills/*`.
Use `/assess-dotnet-repo`, `/plan-dotnet-migration`, `/review-migration-diff`, or `/openshift-readiness`.
Skills produce proposals and reports; deterministic scripts and CI gates remain authoritative.
Do not use `--dangerously-skip-permissions` on real repositories. Run agent transformations only in isolated worktrees/branches.

## Important migration policy
- .NET Framework MVC/Web API generally requires ASP.NET Core migration work, not just changing the target framework.
- WebForms needs a reimplementation/migration path (for example Blazor or another approved UI) or an explicit specialist plan.
- WCF server migration requires a service compatibility decision (for example CoreWCF where appropriate, or API/gRPC replacement). WCF clients may have a different path.
- Windows authentication, COM, registry, GAC, Windows services, native libraries, and Windows-only packages are blockers until resolved.
- .NET 10 is the configured target. Verify the current support lifecycle and organization-approved base images before production use.

## Safety
Never run the factory against a production branch with write permissions. Use least-privilege credentials, ephemeral runners, protected branches, secret scanning, artifact signing, and environment approvals.
