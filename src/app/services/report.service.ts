import type { ReportDefinition } from "@/app/models/reports";

const catalog: ReportDefinition[] = [];

export const reportService = {
  async catalog(): Promise<ReportDefinition[]> {
    return catalog;
  },
};
