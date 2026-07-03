export type ToolType =
  | "calculator"
  | "quadratic"
  | "simultaneous"
  | "matrix"
  | "converter"
  | "times-table";

export interface HistoryEntry {
  id: string;
  tool: ToolType;
  input: string;
  result: string;
  timestamp: number;
}