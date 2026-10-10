import fs from "node:fs";
import path from "node:path";
import { RepoAssessment, Stack, Complexity, RepoFinding } from "./types.js";

const MARKERS = [
  ".git", "package.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
  "vite.config.ts", "vite.config.js", "angular.json", "webpack.config.js",
  "global.json", "*.sln", "*.csproj", "packages.config", "web.config",
  "Directory.Build.props", "Dockerfile"
];

function exists(p: string): boolean { return fs.existsSync(p); }
function walkFiles(dir: string, depth = 0): string[] {
  if (depth > 3) return [];
  let out: string[] = [];
  let entries: fs.Dirent[];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if ([".git", "node_modules", "bin", "obj", "dist", "build", ".next"].includes(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walkFiles(full, depth + 1));
    else out.push(full);
  }
  return out;
}
function readJson(p: string): any {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return {}; }
}
function safeText(p: string): string {
  try { return fs.readFileSync(p, "utf8"); } catch { return ""; }
}

export function assessRepo(repoPath: string): RepoAssessment {
  const abs = path.resolve(repoPath);
  const name = path.basename(abs);
  const files = walkFiles(abs);
  const rel = files.map(f => path.relative(abs, f).replaceAll("\\", "/"));
  const packagePath = path.join(abs, "package.json");
  const pkg = exists(packagePath) ? readJson(packagePath) : {};
  const csproj = files.filter(f => f.toLowerCase().endsWith(".csproj"));
  const sln = files.filter(f => f.toLowerCase().endsWith(".sln"));
  const webforms = files.some(f => /\\.aspx$/i.test(f));
  const wcf = files.some(f => /\\.svc$/i.test(f)) || files.some(f => /ServiceModel|System\\.ServiceModel/i.test(safeText(f)));
  const webConfig = files.filter(f => path.basename(f).toLowerCase() === "web.config");
  const systemWeb = files.some(f => /System\\.Web|Microsoft\\.Web\\.Infrastructure/i.test(safeText(f)));
  const winMarkers = files.filter(f => /\\.ps1$|\\.bat$|\\.cmd$|\\.dll$/i.test(f)).slice(0, 30);
  const scripts = { ...(pkg.scripts ?? {}) };
  const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  const react = Boolean(deps.react || deps["react-dom"]);
  const nodeApi = Boolean(pkg.main || scripts.start || scripts["start:prod"]) && !react;
  const vite = Boolean(deps.vite || files.some(f => /vite\\.config\\./i.test(f)));
  const angular = Boolean(deps["@angular/core"] || files.some(f => /angular\\.json$/i.test(f)));
  const nginxConfig = files.some(f => /(^|\/)nginx\.conf$/i.test(f));
  const hasPackageLock = exists(path.join(abs, "package-lock.json")) || exists(path.join(abs, "npm-shrinkwrap.json"));
  const nodeVersion = String(pkg.engines?.node ?? "");
  const evidence: Record<string, string | boolean | number | string[]> = {
    csprojCount: csproj.length, solutionCount: sln.length, hasWebConfig: webConfig.length > 0,
    hasWebForms: webforms, hasWcfIndicators: wcf, hasSystemWebIndicators: systemWeb,
    hasPackageJson: exists(packagePath), packageName: String(pkg.name ?? ""),
    packageScripts: Object.keys(scripts), hasReact: react, hasVite: vite, hasAngular: angular,
    hasNginxConfig: nginxConfig, hasLockfile: hasPackageLock, declaredNodeEngine: nodeVersion,
    windowsScriptOrDllFiles: winMarkers.map(f => path.relative(abs, f)),
    packageDependencyCount: Object.keys(deps).length,
    filesSample: rel.slice(0, 100)
  };

  let stack: Stack = "unknown";
  if (csproj.length || sln.length || webConfig.length) stack = "dotnet-iis";
  else if (react && (pkg.dependencies?.express || pkg.dependencies?.fastify || pkg.dependencies?.koa || pkg.dependencies?.["@nestjs/core"])) stack = "react-node";
  else if (react) stack = "react-static";
  else if (exists(packagePath) && (nodeApi || pkg.dependencies?.express || pkg.dependencies?.fastify || pkg.dependencies?.koa || pkg.dependencies?.["@nestjs/core"])) stack = "node-api";
  else if (angular) stack = "unknown";

  const findings: RepoFinding[] = [];
  if (stack === "unknown") findings.push({ code: "STACK_UNCLEAR", severity: "warning", message: "Could not confidently classify stack; human review required." });
  if (webforms) findings.push({ code: "WEBFORMS", severity: "blocker", message: "ASP.NET WebForms detected; this is not a mechanical .NET target-framework upgrade." });
  if (wcf) findings.push({ code: "WCF", severity: "warning", message: "WCF indicators detected; determine replacement/hosting compatibility." });
  if (systemWeb) findings.push({ code: "SYSTEM_WEB", severity: "warning", message: "System.Web indicators detected; ASP.NET Core migration may require architectural changes." });
  if (stack === "react-static" && !nginxConfig) findings.push({ code: "NGINX_CONFIG_MISSING", severity: "info", message: "No Nginx config detected; generate standard SPA fallback/reverse-proxy config after route review." });
  if ((stack === "node-api" || stack === "react-node") && !hasPackageLock) findings.push({ code: "LOCKFILE_MISSING", severity: "warning", message: "No npm lockfile detected; deterministic installs require a committed lockfile." });
  if (nodeVersion.includes("18") || stack === "node-api" || stack === "react-node") {
    if (nodeVersion.includes("18") || stack === "node-api" || stack === "react-node") {
      findings.push({ code: "NODE_RUNTIME_REVIEW", severity: "warning", message: "Confirm runtime target. Node.js 18 is EOL; require explicit risk acceptance or approve a supported LTS target." });
    }
  }
  if (winMarkers.length) findings.push({ code: "WINDOWS_ARTIFACTS", severity: "info", message: "Windows scripts/DLL artifacts found; inspect for OS-specific runtime/build assumptions.", evidence: winMarkers.map(f => path.relative(abs, f)) });

  const highDotnet = webforms || wcf || systemWeb;
  const complexity: Complexity =
    stack === "unknown" || webforms ? "specialist-review" :
    highDotnet || findings.some(f => f.severity === "blocker") ? "high" :
    findings.some(f => f.severity === "warning") ? "medium" : "low";
  const recipe = stack === "dotnet-iis" ? "dotnet-iis-to-openshift" :
    stack === "react-static" ? "react-nginx-to-openshift" :
    stack === "node-api" ? "node-api-to-openshift" :
    stack === "react-node" ? "react-node-to-openshift" : "manual-assessment";
  return { name, path: abs, git: exists(path.join(abs, ".git")), stack, complexity, evidence, findings, proposedRecipe: recipe,
    requiresHumanReview: complexity === "high" || complexity === "specialist-review" || findings.some(f => f.severity === "blocker") };
}

export function discoverRepos(root: string): string[] {
  const out: string[] = [];
  function visit(dir: string, depth: number): void {
    if (depth > 5) return;
    let entries: fs.Dirent[];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    const names = new Set(entries.map(e => e.name));
    const isRepo = names.has(".git") || names.has("package.json") || entries.some(e => e.isFile() && (e.name.endsWith(".sln") || e.name.endsWith(".csproj")));
    if (isRepo) { out.push(dir); return; }
    for (const e of entries) {
      if (!e.isDirectory() || [".git", "node_modules", "vendor", "bin", "obj", "dist", "build"].includes(e.name)) continue;
      visit(path.join(dir, e.name), depth + 1);
    }
  }
  visit(path.resolve(root), 0);
  return [...new Set(out)];
}
