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
  input: string;       // human-readable input, e.g. "2x² + 3x - 5 = 0"
  result: string;       // human-readable result, e.g. "x = 1, x = -2.5"
  timestamp: number;    // Date.now()
}