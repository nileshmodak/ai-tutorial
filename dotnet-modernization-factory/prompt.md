I recommend building this as a .NET Modernization Factory with Claude Code as the AI execution layer and deterministic scripts as the control layer.

I've prepared the initial repository scaffold for your environment. It includes a .NET repository scanner, migration contract validation, Claude Code skills, validation scripts, OpenShift templates, and a pilot workflow.

1. Download the factory repository

Download the .NET Modernization Factory

This is the initial implementation, not yet a production-ready migration engine. The next step is to validate it in your environment and extend it with automated migration execution.

What's included
Component	Purpose	Status
Repository scanner	Detects .NET projects, WebForms, WCF, and Windows dependencies	Implemented
Classification engine	Identifies likely migration paths and review requirements	Implemented
Contract validator	Checks target framework, deployment decisions, and required gates	Implemented
Claude Code skills	Assessment, planning, migration review, and OpenShift readiness	Initial definitions
PowerShell scripts	Windows-oriented workflow entry points	Included
Dockerfile and OpenShift templates	Starting point for standardized deployments	Templates included
Architecture and pilot documentation	Defines the workflow and migration approach	Included

Important: I attempted to run the TypeScript build, but it timed out during dependency installation. I therefore cannot claim the complete repository has passed its build or integration tests.

2. Recommended architecture

Your factory should separate deterministic decisions from AI-driven code changes.

                 50+ Legacy Repositories
                           |
                           v
                 Repository Scanner
                           |
                           v
                Rule-Based Classifier
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
         Simple .NET     MVC/API       WebForms/WCF
         Upgrade         Migration     Specialist
             |             |             |
             +-------------+-------------+
                           |
                           v
                   Claude Code
               Assessment and Planning
                           |
                           v
                 Approved Migration
                      Contract
                           |
                           v
                 Isolated Git Branch
                           |
                           v
                Scripts + AI Changes
                           |
                           v
                Deterministic Gates
                           |
                           v
                 Container Validation
                           |
                           v
                  OpenShift Testing
                           |
                           v
                  Human Approval

Claude Code should not control deployment permissions or decide whether a migration is acceptable. Those decisions belong to the factory's rules, automated quality gates, and approval process.

3. How to run the initial scanner

After extracting the ZIP, install the dependencies and build the TypeScript project:

npm install
npm run build

Then scan a directory containing your cloned repositories:

node dist/cli.js scan \
  --path /path/to/your/repos \
  --out ./artifacts

For example, if your repositories are under C:\src\repos on Windows, provide that directory as the scan path.

The scanner generates:

inventory.json — structured repository assessments.
inventory.csv — an inventory suitable for Excel.
summary.md — a summary of detected stacks, risks, and review requirements.

Run this against a small sample first, verify the findings, and then scan the entire estate.

4. How I would approach the first pilot

Start with four repositories:

A relatively simple .NET API or library.
An ASP.NET MVC or Web API application targeting .NET Framework.
A WebForms application.
A WCF application or one with significant Windows-specific dependencies.

The first repository should establish your golden path.

For that application, we will:

Establish the current build and behavioral baseline.
Assess dependencies and approve the migration contract.
Migrate to .NET 10 using Claude Code and deterministic scripts.
Run build, test, dependency, and security checks.
Create and validate the Linux container.
Validate OpenShift configuration and health checks.
Deploy to a non-production environment through your existing CI/CD process.
Review the changes before approving the migration.

WebForms and WCF require explicit architectural decisions; they should not be treated as simple framework upgrades. Microsoft's guidance discusses these distinctions and recommends incremental migration for many complex ASP.NET Framework applications.

5. What I would implement next

The next milestone should be a fully validated end-to-end pilot for one low-risk repository, followed by reusable migration recipes for the rest of your estate.

That implementation should add:

A reliable scanner validated against representative real repositories.
An approved migration contract for each application.
Claude Code skills that follow the contract.
Isolated migration branches and bounded changes.
Build, test, and security gates with recorded evidence.
Container and OpenShift validation.
A machine-readable report explaining exactly why each repository passed, failed, or needs human intervention.

Once the pilot is repeatable, we can run multiple repositories concurrently and improve the shared recipes whenever a recurring migration failure appears.

The goal is not to have Claude Code independently migrate 50 repositories. It is to build a factory that can migrate many repositories safely, repeatably, and with measurable reductions in engineering effort. 

I prefer this response


.NET Modernization Factory — Implementation Plan

I've created the initial factory repository for your environment: legacy .NET/IIS → .NET 10 → Linux containers → OpenShift 4, with Claude Code as the AI coding agent.

The starter includes a TypeScript scanner, PowerShell validation scripts, a migration contract, Claude Code skills, and a pilot workflow. It is designed to evolve into a repeatable modernization pipeline for all 50+ repositories.

Download the .NET Modernization Factory

I've created the files, but I could not complete the TypeScript build verification in this environment. Treat this as a starter implementation that needs local build validation before use.

1. What's included?
Component	Purpose	Status
Repository scanner	Discover .NET projects and legacy dependencies	Initial implementation
Classification engine	Identify migration risks and recommend a recipe	Initial rules
Claude Code skills	Assess, plan, review and check OpenShift readiness	Included
Migration contract	Record target framework, architecture decisions and gates	Included
PowerShell scripts	Scan repositories and validate builds	Included
Container validation scripts	Check container images and manifests	Included
Quality-gate documentation	Define required validation before approval	Included
Pilot workflow	Guide a repository through assessment to PR	Included
Automated migration execution	Apply approved changes safely	Next implementation phase
Git hosting integration	Connect to your actual repositories	Pending provider details
OpenShift deployment integration	Deploy to a non-production namespace	Pending cluster configuration

The initial scanner is intentionally read-only. It does not automatically modify your application repositories.

2. How to run it locally

Download and extract the ZIP, then open a terminal in the extracted directory.

You need Node.js, npm, Git, and PowerShell 7. Install the dependencies and build the factory:

npm install
npm run build

Scan a directory containing local repository checkouts:

node dist/cli.js scan \
  --path "/path/to/your/repos" \
  --out "./artifacts"

The scanner generates three reports:

inventory.json — detailed repository findings.
inventory.csv — inventory suitable for spreadsheet analysis.
summary.md — stack classification, complexity and review requirements.

Important: These are initial heuristic classifications, not authoritative migration decisions. Validate the findings against representative repositories before using them to drive automated changes.

3. Your Claude Code workflow

The repository includes these skills:

Skill	Purpose
/assess-dotnet-repo	Analyze the legacy application without modifying source code
/plan-dotnet-migration	Propose a migration plan and contract
/review-migration-diff	Review changes for correctness, security and behavioral risks
/openshift-readiness	Check container and OpenShift requirements

Start Claude Code from the factory repository root so it can read CLAUDE.md and the .claude/skills/ directory.

The intended workflow is:

Run the deterministic scanner.
Ask Claude Code to assess the repository.
Generate a migration plan.
Obtain human approval for architectural decisions.
Execute changes on an isolated branch.
Run the required build, test and security gates.
Validate the container and OpenShift deployment.
Review the diff and create a pull request.

The skills provide instructions to Claude Code; they are not yet a complete autonomous orchestration engine.

4. How we will handle difficult legacy applications

Your repository estate contains application types that cannot all follow the same migration path.

Application type	Factory approach
Simple ASP.NET Web API	Prioritize automated migration
ASP.NET MVC	Migrate controllers, routing, authentication and configuration
WebForms	Require an approved UI migration or reimplementation strategy
WCF	Assess bindings, protocols and compatibility before selecting a replacement
Windows-specific dependencies	Block automated migration until a Linux-compatible approach is approved

Microsoft's guidance distinguishes these migration challenges: ASP.NET Framework applications need more than a target-framework change, and WebForms and WCF require specific migration decisions. See the official ASP.NET Core migration guidance and Microsoft's .NET upgrade scenarios and skills.

5. The next milestone

I recommend implementing the factory in this order:

Milestone 1 — Reliable inventory

Validate the scanner against five representative repositories.
Improve framework and dependency detection.
Produce consistent, evidence-backed migration classifications.

Milestone 2 — Deterministic validation

Pin the .NET SDK.
Standardize restore, build, test and security gates.
Produce machine-readable pass/fail reports.

Milestone 3 — Claude Code execution

Add an isolated-worktree workflow.
Implement bounded transformations and failure diagnosis.
Require approval before architectural changes.

Milestone 4 — OpenShift golden path

Standardize Linux container images, probes, resources and configuration.
Validate manifests.
Deploy to a non-production namespace through your existing CI/CD system.

Milestone 5 — Parallel execution

Add a job queue, concurrency limits, retry policies and persistent audit records.
Process multiple repositories in parallel without allowing AI-generated changes to bypass quality gates.
One detail I need from you

You selected Other or mixed for repository hosting. Which systems do your repositories actually use?

For example:

GitHub Enterprise
Azure DevOps Repos
Bitbucket
GitLab
A mixture of these

This determines how we implement repository discovery, branch creation, pull requests and CI/CD integration in the next version.


                  50+ Git Repositories
                           │
                           ▼
                 ┌───────────────────┐
                 │  Automated Scan   │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Classification    │
                 │ A / B / C / D     │
                 └─────────┬─────────┘
                           │
             ┌─────────────┼──────────────┐
             ▼             ▼              ▼
          Easy           Medium         Complex
             │             │              │
             ▼             ▼              ▼
        Automation       AI + Auto      AI + Human
             │             │              │
             └─────────────┼──────────────┘
                           ▼
                  ┌─────────────────┐
                  │ Build & Test    │
                  └────────┬────────┘
                           ▼
                  ┌─────────────────┐
                  │ Containerize    │
                  └────────┬────────┘
                           ▼
                  ┌─────────────────┐
                  │ OpenShift       │
                  │ Validation      │
                  └────────┬────────┘
                           ▼
                  ┌─────────────────┐
                  │ Automated Tests │
                  └────────┬────────┘
                           ▼
                  ┌─────────────────┐
                  │ Human Approval  │
                  └─────────────────┘

I would deliver

1. Modernization Factory repository

Primary deliverable

A reusable TypeScript/Node.js project containing the orchestrator, repo scanner, rules engine, migration workflow, validation scripts, templates and reporting.

2. AI agent definitions and skills

Reusable instructions for repository assessment, migration planning, code transformation, build-failure diagnosis and migration review. These can be adapted to your chosen coding agent.

3. Deterministic automation scripts

PowerShell and .NET CLI scripts for scanning, project analysis, builds, tests, container builds, security checks and validation. Standard Docker and OpenShift templates ensure consistency.

4. Operating guide and pilot

Setup instructions, architecture, configuration examples, migration decision rules, failure handling and a sample repository demonstrating the complete workflow.                  

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
