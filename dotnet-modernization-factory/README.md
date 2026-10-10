# Polyglot Modernization Factory (Starter)

A starter control plane for assessing and modernizing .NET/IIS and React/Node.js repositories for Linux containers on OpenShift 4.

## Important
- This is a **starter scaffold**, not a production-ready migration engine.
- Node.js 18 is end-of-life (EOL). The starter records Node 18 as the requested compatibility target but flags it for explicit security/risk approval. Prefer a supported LTS runtime for production.
- The scanner is read-only. It does not modify application repositories.
- Do not run AI-generated code directly in production. Use isolated branches, CI gates, review, and environment approvals.

## Requirements
- Node.js 20+ recommended for running the factory itself
- npm
- Git
- Optional: .NET SDK, Docker/Podman, `oc`, GitHub CLI

## Quick start
```bash
npm install
npm run build
node dist/cli.js scan --path /path/to/repositories --out ./artifacts
```

The scan command discovers repositories under a directory and emits:
- `inventory.json`
- `inventory.csv`
- `summary.md`

## Commands
```bash
node dist/cli.js scan --path ./repos --out ./artifacts
node dist/cli.js scan --path ./repos --out ./artifacts --repo customer-api
```

## Factory principles
1. Scanner facts are deterministic and distinguish facts from AI hypotheses.
2. Classification is rule-based; AI may suggest, but cannot override policy.
3. Every migration runs in a disposable branch/worktree.
4. No deployment without build, tests, security checks, smoke tests, and approval.
5. Common failures should improve a shared recipe or rule rather than create one-off fixes.

dotnet-modernization-factory/
├── apps/
│   └── orchestrator/           # TypeScript workflow engine
├── packages/
│   ├── repo-scanner/           # .NET/IIS dependency inventory
│   ├── classification-engine/  # Migration complexity and routing
│   ├── rules-engine/           # Deterministic migration rules
│   ├── ai-adapters/            # Coding-agent integration
│   ├── validation-engine/      # Build, test, security gates
│   └── reporting/              # Per-repo results and metrics
├── agents/
│   ├── assessment/
│   ├── migration-planner/
│   ├── code-migrator/
│   └── failure-analyzer/
├── skills/
│   ├── dotnet-assessment/
│   ├── aspnet-modernization/
│   └── openshift-containerization/
├── templates/
│   ├── docker/
│   ├── openshift/
│   └── ci-cd/
├── scripts/
│   ├── scan-repos.ps1
│   ├── validate-repo.ps1
│   └── build-container.ps1
├── config/
│   ├── migration-policy.yaml
│   └── target-platform.yaml
├── examples/
├── docs/
├── package.json
└── README.md