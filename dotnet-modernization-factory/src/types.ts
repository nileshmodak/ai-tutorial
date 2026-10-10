export type Stack = "dotnet-iis" | "react-static" | "node-api" | "react-node" | "unknown";
export type Complexity = "low" | "medium" | "high" | "specialist-review";

export interface RepoFinding {
  code: string;
  severity: "info" | "warning" | "blocker";
  message: string;
  evidence?: string[];
}

export interface RepoAssessment {
  name: string;
  path: string;
  git: boolean;
  stack: Stack;
  complexity: Complexity;
  evidence: Record<string, string | boolean | number | string[]>;
  findings: RepoFinding[];
  proposedRecipe: string;
  requiresHumanReview: boolean;
}
