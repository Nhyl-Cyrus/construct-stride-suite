import { aiInsights } from "@/lib/hr-data";
import { ok } from "./base.repository";

export const aiRepository = {
  hrInsights: () => ok(aiInsights),
};
