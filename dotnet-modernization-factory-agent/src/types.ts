export type Stack = "aspnet-framework" | "modern-dotnet" | "unknown";
export type Complexity = "low" | "medium" | "high" | "specialist-review";
export interface Finding {
  id: string;
  severity: "info" | "warning" | "blocker";
  message: string;
  evidence: string[];
}
export interface Assessment {
  name: string;
  path: string;
  gitSha: string | null;
  stack: Stack;
  complexity: Complexity;
  evidence: Record<string, string | boolean | number | string[]>;
  findings: Finding[];
  recipe: string;
  humanReviewRequired: boolean;
}
