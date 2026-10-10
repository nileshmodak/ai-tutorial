import fs from "node:fs";
import path from "node:path";
import { Assessment } from "./types.js";
const cell=(x:unknown)=>`"${String(typeof x==="string"?x:JSON.stringify(x)??"").replaceAll('"','""')}"`;
export function report(items:Assessment[],out:string):void{
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,"inventory.json"),JSON.stringify(items,null,2));
 const header=["name","path","gitSha","stack","complexity","recipe","humanReviewRequired","findingIds"];
 const rows=[header,...items.map(a=>[a.name,a.path,a.gitSha,a.stack,a.complexity,a.recipe,a.humanReviewRequired,a.findings.map(f=>f.id).join(";")])];
 fs.writeFileSync(path.join(out,"inventory.csv"),rows.map(r=>r.map(cell).join(",")).join("\n"));
 const count=(fn:(a:Assessment)=>string)=>{const m=new Map<string,number>();for(const a of items)m.set(fn(a),(m.get(fn(a))??0)+1);return [...m.entries()].map(([k,v])=>`- ${k}: ${v}`).join("\n")};
 const md=`# .NET modernization inventory\n\nRepositories: **${items.length}**\n\n## Stack\n${count(a=>a.stack)}\n\n## Complexity\n${count(a=>a.complexity)}\n\n## Human review required\n${items.filter(a=>a.humanReviewRequired).map(a=>`- **${a.name}** (${a.recipe}): ${a.findings.filter(f=>f.severity!=="info").map(f=>f.id).join(", ")}`).join("\n")||"- None flagged by initial heuristic scan."}\n\n> Heuristic assessment only. Verify findings before migration; this report does not authorize code changes.\n`;
 fs.writeFileSync(path.join(out,"summary.md"),md);
}
