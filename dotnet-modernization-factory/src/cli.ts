import path from "node:path";
import { assessRepo, discoverRepos } from "./scanner.js";
import { writeReports } from "./report.js";

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i+1] : fallback;
}
const command = process.argv[2];
if (command !== "scan") {
  console.log("Usage: node dist/cli.js scan --path <repo-root> [--out <output-dir>] [--repo <repo-name>]");
  process.exit(command ? 2 : 0);
}
const root = arg("--path");
if (!root) { console.error("Missing required --path"); process.exit(2); }
const out = arg("--out", "./artifacts")!;
const onlyRepo = arg("--repo");
const repos = discoverRepos(root!).filter(p => !onlyRepo || path.basename(p) === onlyRepo);
if (!repos.length) { console.error("No repositories discovered."); process.exit(1); }
const results = repos.map(assessRepo);
writeReports(results, out);
console.log(`Scanned ${results.length} repository/repositories.`);
console.log(`Reports written to ${path.resolve(out)}`);
for (const r of results) console.log(`${r.stack.padEnd(12)} ${r.complexity.padEnd(17)} ${r.name}${r.requiresHumanReview ? " [REVIEW]" : ""}`);
