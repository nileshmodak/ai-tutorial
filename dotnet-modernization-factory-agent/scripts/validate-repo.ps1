[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][string]$Repo,
  [string]$Configuration = "Release",
  [switch]$RunTests
)
$ErrorActionPreference = "Stop"
$repoPath = (Resolve-Path $Repo).Path
$solution = Get-ChildItem $repoPath -Filter *.sln -File | Select-Object -First 1
$project = Get-ChildItem $repoPath -Filter *.csproj -File -Recurse | Where-Object { $_.FullName -notmatch '\\(bin|obj)\\' } | Select-Object -First 1
if (-not $solution -and -not $project) { throw "No .sln or .csproj found in $repoPath" }
if ($solution) { $target = $solution.FullName } else { $target = $project.FullName }
dotnet --info
dotnet restore $target
if ($LASTEXITCODE -ne 0) { throw "dotnet restore failed: $LASTEXITCODE" }
dotnet build $target --configuration $Configuration --no-restore
if ($LASTEXITCODE -ne 0) { throw "dotnet build failed: $LASTEXITCODE" }
if ($RunTests) {
  dotnet test $target --configuration $Configuration --no-build
  if ($LASTEXITCODE -ne 0) { throw "dotnet test failed: $LASTEXITCODE" }
}
