[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][string]$Root,
  [string]$Out = "./artifacts"
)
$ErrorActionPreference = "Stop"
if (-not (Test-Path $Root -PathType Container)) { throw "Root not found: $Root" }
npm run build
node ./dist/cli.js scan --path (Resolve-Path $Root).Path --out $Out
if ($LASTEXITCODE -ne 0) { throw "Scanner failed with exit code $LASTEXITCODE" }
