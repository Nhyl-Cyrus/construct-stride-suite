import { aiRepository } from "@/app/repositories/ai.repository";

export const aiService = {
  hrInsights: () => aiRepository.hrInsights(),
};
