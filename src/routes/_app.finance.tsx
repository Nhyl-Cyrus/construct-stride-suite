import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";

export const Route = createFileRoute("/_app/finance")({
  head: () => ({
    meta: [
      { title: "Finance Operations — EasyConstruct" },
      {
        name: "description",
        content:
          "Finance Operations workspace for budgets, payroll review, expenses, approvals, and financial intelligence.",
      },
    ],
  }),
  component: FinanceLayout,
});

function FinanceLayout() {
  return (
    <>
      <TopBar />
      <Outlet />
    </>
  );
}
