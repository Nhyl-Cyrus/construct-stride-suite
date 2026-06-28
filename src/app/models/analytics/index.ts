export interface KPI {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
}
