---
name: assess-dotnet-repo
description: Read-only assessment of a legacy .NET/IIS repository before modernization. Use for inventory, dependency risk, Linux portability and migration complexity.
disable-model-invocation: true
---
Assess the repository without modifying files. Read `CLAUDE.md` first. Inspect solution/project files, packages.config, web.config, app.config, Global.asax, routes, handlers/modules, authentication, database providers, tests, WCF, WebForms, System.Web, COM, registry, GAC, Windows services, native DLLs, filesystem assumptions, scheduled tasks and external dependencies.

Write `artifacts/<repo-name>/assessment.md` and `assessment.json`. Separate observed facts from hypotheses. Cite repository-relative file paths for every material finding. Classify blockers and recommend a recipe. Do not assert that a dependency is Linux-compatible without evidence. End with a list of questions requiring a human decision.
