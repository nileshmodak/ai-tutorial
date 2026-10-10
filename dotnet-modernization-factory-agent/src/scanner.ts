import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { Assessment, Finding, Stack, Complexity } from "./types.js";

const IGNORED = new Set([".git","node_modules","bin","obj","packages","TestResults","artifacts",".vs"]);
function walk(dir: string, depth = 0): string[] {
  if (depth > 5) return [];
  let entries: fs.Dirent[];
  try { entries = fs.readdirSync(dir, {withFileTypes:true}); } catch { return []; }
  const result: string[] = [];
  for (const e of entries) {
    if (IGNORED.has(e.name)) continue;
    const full = path.join(dir,e.name);
    if (e.isDirectory()) result.push(...walk(full, depth+1));
    else result.push(full);
  }
  return result;
}
function read(p: string): string { try { return fs.readFileSync(p,"utf8"); } catch { return ""; } }
function gitSha(dir: string): string | null {
  try { return execFileSync("git",["rev-parse","HEAD"],{cwd:dir,encoding:"utf8",stdio:["ignore","pipe","ignore"]}).trim(); } catch { return null; }
}
function rels(root: string, files: string[]): string[] { return files.map(f=>path.relative(root,f).replaceAll("\\","/")); }

export function assess(root: string): Assessment {
  const abs = path.resolve(root), name = path.basename(abs), files = walk(abs);
  const rel = rels(abs, files);
  const csprojs = files.filter(f=>f.toLowerCase().endsWith(".csproj"));
  const slns = files.filter(f=>f.toLowerCase().endsWith(".sln"));
  const webConfigs = files.filter(f=>path.basename(f).toLowerCase()==="web.config");
  const aspx = files.filter(f=>f.toLowerCase().endsWith(".aspx"));
  const svc = files.filter(f=>f.toLowerCase().endsWith(".svc"));
  const allText = files.filter(f=>/\.(cs|vb|config|csproj|props|targets|xml|json|yml|yaml)$/i.test(f)).map(read).join("\n");
  const frameworkRefs = /TargetFrameworkVersion\s*=\s*["']v4|<TargetFramework>\s*net[1-4]\d/i.test(allText);
  const modernTarget = /<TargetFrameworks?>\s*net(6|7|8|9|10)\.0/i.test(allText);
  const hasSystemWeb = /\bSystem\.Web\b|Microsoft\.Web\.Infrastructure/.test(allText);
  const hasWcf = svc.length>0 || /System\.ServiceModel|ServiceHost|BasicHttpBinding|NetTcpBinding/.test(allText);
  const hasWindowsAuth = /WindowsAuthentication|Negotiate|NTLM|<identity\s+impersonate/i.test(allText);
  const hasCom = /ComImport|DllImport|LibraryImport|Microsoft\.Win32\.Registry|RegistryKey/.test(allText);
  const hasWindowsService = /ServiceBase|UseWindowsService|sc\.exe|InstallUtil/.test(allText);
  const hasGac = /GAC|Global Assembly Cache|HintPath.*Assembly/i.test(allText);
  const hasNative = files.some(f=>/\.dll$/i.test(f));
  const hasDocker = files.some(f=>path.basename(f).toLowerCase()==="dockerfile");
  const testProjects = csprojs.filter(f=>/test/i.test(path.basename(f)));
  const findings: Finding[] = [];
  const add=(id:string,severity:Finding["severity"],message:string,evidence:string[])=>findings.push({id,severity,message,evidence:evidence.slice(0,12)});
  if (aspx.length) add("WEBFORMS","blocker","ASP.NET WebForms detected. It is not supported by ASP.NET Core; define a UI reimplementation or approved alternative.",rels(abs,aspx));
  if (hasWcf) add("WCF","blocker","WCF indicators detected. Decide whether server-side CoreWCF, API/gRPC replacement, or a retained Windows service is appropriate.",rels(abs,svc));
  if (hasSystemWeb) add("SYSTEM_WEB","warning","System.Web dependency detected; ASP.NET Core migration requires code and middleware changes.",rel.filter(f=>/\.cs$/i.test(f)).slice(0,12));
  if (hasWindowsAuth) add("WINDOWS_AUTH","blocker","Windows/Negotiate/NTLM authentication indicators detected. Confirm Linux/OpenShift identity integration before migration.",[]);
  if (hasCom) add("COM_REGISTRY","blocker","COM, P/Invoke, or registry indicators detected; Linux compatibility is not established.",[]);
  if (hasWindowsService) add("WINDOWS_SERVICE","blocker","Windows service indicators detected; define a Linux worker/service replacement and lifecycle model.",[]);
  if (hasGac) add("GAC_DEPENDENCY","warning","Potential GAC/assembly deployment dependency; identify package and deployment replacement.",[]);
  if (hasNative) add("DLL_FILES","warning","DLL files found in repository; inspect whether they are managed assemblies or Windows-only native dependencies.",rel.filter(f=>/\.dll$/i.test(f)).slice(0,12));
  if (webConfigs.length) add("WEB_CONFIG","info","web.config found; inspect IIS modules, handlers, authentication, rewrite rules, and configuration values.",rels(abs,webConfigs));
  if (!testProjects.length) add("NO_TEST_PROJECT","warning","No test project filename detected. Establish a behavioral baseline before migration.",[]);
  if (!hasDocker) add("NO_DOCKERFILE","info","No Dockerfile detected; generate only from an approved container contract.",[]);
  let stack:Stack = csprojs.length || slns.length || webConfigs.length ? (frameworkRefs || hasSystemWeb || webConfigs.length ? "aspnet-framework" : modernTarget ? "modern-dotnet" : "unknown") : "unknown";
  if (stack==="unknown") add("UNKNOWN_STACK","warning","Stack/framework could not be determined confidently. Review project files and repository layout.",rel.filter(f=>/\.sln$|\.csproj$|global\.json$/i.test(f)));
  const blockers=findings.some(f=>f.severity==="blocker");
  const warnings=findings.some(f=>f.severity==="warning");
  const complexity:Complexity = blockers && (aspx.length>0 || hasWcf || hasCom || hasWindowsService) ? "specialist-review" : blockers ? "high" : warnings ? "medium" : "low";
  const recipe = aspx.length ? "webforms-reimplementation" : hasWcf ? "wcf-service-decision" : stack==="aspnet-framework" ? "aspnet-framework-to-aspnetcore" : stack==="modern-dotnet" ? "modern-dotnet-to-net10" : "manual-assessment";
  return {name,path:abs,gitSha:gitSha(abs),stack,complexity,evidence:{
    csprojCount:csprojs.length,solutionCount:slns.length,webConfigCount:webConfigs.length,webFormsPageCount:aspx.length,
    wcfServiceFileCount:svc.length,hasSystemWeb,hasWcf,hasWindowsAuth,hasComOrRegistry:hasCom,hasWindowsService,hasGacIndicators:hasGac,
    hasDllFiles:hasNative,hasDockerfile:hasDocker,testProjectCount:testProjects.length,targetFrameworkIndicators:frameworkRefs?"legacy":modernTarget?"modern":"unknown",
    filesSample:rel.slice(0,150)
  },findings,recipe,humanReviewRequired:blockers || stack==="unknown" || complexity==="specialist-review"};
}
export function discover(root:string):string[] {
  const out:string[]=[];
  function visit(dir:string,depth:number):void {
    if(depth>5)return;
    let es:fs.Dirent[];try{es=fs.readdirSync(dir,{withFileTypes:true})}catch{return}
    const names=new Set(es.map(e=>e.name));
    if(names.has(".git")||es.some(e=>e.isFile()&&(e.name.endsWith(".sln")||e.name.endsWith(".csproj")))){out.push(dir);return}
    for(const e of es)if(e.isDirectory()&&!IGNORED.has(e.name))visit(path.join(dir,e.name),depth+1);
  }
  visit(path.resolve(root),0);return [...new Set(out)];
}
