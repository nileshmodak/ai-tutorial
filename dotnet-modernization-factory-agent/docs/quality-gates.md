# Deterministic gates

Required before PR approval:
1. Clean restore and build with pinned .NET 10 SDK.
2. Unit/integration tests; establish baseline tests when absent.
3. Formatting/lint and static analysis (for example `dotnet format --verify-no-changes` and organization-approved analyzers).
4. Dependency vulnerability scan and secret scan.
5. Container build from approved base image and image scan.
6. Manifest schema/policy validation.
7. Deploy to non-production and run health/smoke/regression tests.
8. Human review of diff, behavior risks, and contract exceptions.

A skipped gate is a failure, not a pass. Store command, tool version, exit code, logs, and artifact digest.
