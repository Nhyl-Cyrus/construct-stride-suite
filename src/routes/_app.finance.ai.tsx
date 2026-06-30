import { createFileRoute } from "@tanstack/react-router";
import { FinanceAiView } from "@/app/views/finance/FinanceAiView";

export const Route = createFileRoute("/_app/finance/ai")({
  component: FinanceAiView,
});
