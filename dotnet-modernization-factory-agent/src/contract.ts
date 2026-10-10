import fs from "node:fs";
export interface Contract {
  version:number;
  repo:string;
  source:{framework:string;hosting:string};
  target:{framework:"net10.0";hosting:"openshift";os:"linux"};
  migration:{strategy:"in-place"|"incremental"|"reimplementation";approved:boolean;approver?:string};
  decisions:{webForms?:string;wcf?:string;windowsAuthentication?:string;comOrNative?:string;database?:string};
  runtime:{port:number;healthPath:string;readinessPath:string};
  qualityGates:{build:boolean;tests:boolean;securityScan:boolean;containerScan:boolean;manifestValidation:boolean;smokeTest:boolean};
}
export function validateContract(file:string):string[]{
 const c=JSON.parse(fs.readFileSync(file,"utf8")) as Contract, e:string[]=[];
 if(c.version!==1)e.push("version must be 1");
 if(!c.repo)e.push("repo is required");
 if(c.target?.framework!=="net10.0")e.push("target.framework must be net10.0");
 if(c.target?.hosting!=="openshift"||c.target?.os!=="linux")e.push("target must be OpenShift on Linux");
 if(!c.migration?.strategy)e.push("migration.strategy is required");
 if(!c.migration?.approved)e.push("migration.approved must be true before execution");
 if(c.migration?.approved&&!c.migration?.approver)e.push("migration.approver is required when approved");
 if(!Number.isInteger(c.runtime?.port)||c.runtime.port<1||c.runtime.port>65535)e.push("runtime.port must be a valid TCP port");
 if(!c.runtime?.healthPath?.startsWith("/")||!c.runtime?.readinessPath?.startsWith("/"))e.push("health/readiness paths must start with /");
 for(const [k,v] of Object.entries(c.qualityGates??{}))if(v!==true)e.push(`qualityGates.${k} must be true`);
 return e;
}
