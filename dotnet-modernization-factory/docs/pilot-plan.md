# Pilot plan

Choose 4-5 representative repositories:
- simple ASP.NET Core-compatible API or low-complexity .NET app;
- complex .NET/IIS app with a known blocker;
- React static UI;
- Node.js API;
- React + Node.js combined repo, if present.

## Pilot gates
- inventory accuracy manually sampled;
- repeatable scan output;
- generated files pass lint/schema checks;
- no unapproved source edits;
- clean build and tests;
- container runs with OpenShift-compatible UID/security constraints;
- route and health checks pass;
- report includes diffs, commands, exit codes, and exceptions.

## Success metrics
- assessment time/repo;
- first-pass build rate;
- automated transformation rate;
- engineer hours/repo;
- repeatable failures resolved in shared recipe;
- security findings and escaped regressions.
