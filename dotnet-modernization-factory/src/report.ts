import fs from "node:fs";
import path from "node:path";
import { RepoAssessment } from "./types.js";

function csvCell(v: unknown): string {
  const s = typeof v === "string" ? v : JSON.stringify(v);
  return `"${String(s ?? "").replaceAll('"', '""')}"`;
}
export function writeReports(items: RepoAssessment[], outDir: string): void {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "inventory.json"), JSON.stringify(items, null, 2));
  const headers = ["name","path","git","stack","complexity","proposedRecipe","requiresHumanReview","findingCodes"];
  const rows = [headers, ...items.map(x => [x.name,x.path,x.git,x.stack,x.complexity,x.proposedRecipe,x.requiresHumanReview,x.findings.map(f=>f.code).join(";")])];
  fs.writeFileSync(path.join(outDir, "inventory.csv"), rows.map(r => r.map(csvCell).join(",")).join("\n"));
  const summary = [
    "# Modernization inventory",
    "",
    `Repositories scanned: **${items.length}**`,
    "",
    "## By stack",
    ...group(items, x=>x.stack),
    "",
    "## By complexity",
    ...group(items, x=>x.complexity),
    "",
    "## Repositories requiring human review",
    ...items.filter(x=>x.requiresHumanReview).map(x=>`- **${x.name}** — ${x.stack}; ${x.findings.map(f=>f.code).join(", ") || "review required"}`),
    "",
    "> This report is an initial heuristic inventory, not an approval to migrate. Validate scanner findings before executing transformations."
  ].join("\n");
  fs.writeFileSync(path.join(outDir, "summary.md"), summary);
}
function group(items: RepoAssessment[], key: (x: RepoAssessment)=>string): string[] {
  const m = new Map<string,number>();
  for (const x of items) m.set(key(x),(m.get(key(x))??0)+1);
  return [...m.entries()].sort((a,b)=>b[1]-a[1]).map(([k,v])=>`- ${k}: ${v}`);
}
