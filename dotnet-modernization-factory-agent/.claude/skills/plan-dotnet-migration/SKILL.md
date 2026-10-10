---
name: plan-dotnet-migration
description: Create an evidence-based migration plan and contract proposal for a legacy .NET app targeting .NET 10 and OpenShift Linux.
disable-model-invocation: true
---
Read `CLAUDE.md` and the approved assessment. Do not modify application code. Produce a plan with bounded steps, expected files, deterministic command for each step, acceptance criteria, rollback, risk, and reviewer. Include a proposed contract based on `contracts/sample-api.json`. Treat WebForms, WCF, Windows Authentication, COM/registry/GAC, Windows services, and native dependencies as explicit architecture decisions. Never assume that changing TargetFramework alone completes migration. Mark contract `approved: false` until a named human approves it.
