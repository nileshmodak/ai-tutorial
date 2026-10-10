import path from "node:path";
import { assess, discover } from "./scanner.js";
import { report } from "./report.js";
import { validateContract } from "./contract.js";
const args=process.argv.slice(2), cmd=args[0];
const val=(k:string,d?:string)=>{const i=args.indexOf(k);return i<0?d:args[i+1]};
if(cmd==="scan"){
 const root=val("--path");if(!root){console.error("Required: --path <repositories-root>");process.exit(2)}
 const only=val("--repo");const repos=discover(root).filter(p=>!only||path.basename(p)===only);
 if(!repos.length){console.error("No repositories discovered");process.exit(1)}
 const items=repos.map(assess),out=val("--out","./artifacts")!;report(items,out);
 console.log(`Scanned ${items.length} repos; reports: ${path.resolve(out)}`);
 for(const a of items)console.log(`${a.stack.padEnd(18)} ${a.complexity.padEnd(18)} ${a.name}${a.humanReviewRequired?" [REVIEW]":""}`);
}else if(cmd==="validate-contract"){
 const file=val("--contract");if(!file){console.error("Required: --contract <file>");process.exit(2)}
 const errors=validateContract(file);
 if(errors.length){console.error("CONTRACT INVALID\n"+errors.map(e=>"- "+e).join("\n"));process.exit(1)}
 console.log("Contract valid");
}else{
 console.log("Commands:\n  scan --path <repos-root> [--out ./artifacts] [--repo name]\n  validate-contract --contract <yaml-or-json>\nNote: v0.1 contract validator currently accepts JSON; use the sample JSON contract.");
 process.exit(cmd?2:0);
}
