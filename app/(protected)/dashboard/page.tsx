import { getCurrentUser } from "@/lib/auth/session";
import { getOptibizDashboardDataAction } from "@/lib/actions/optibiz-dashboard";
import { getProductsAction } from "@/lib/actions/product";
import { getExpensesAction } from "@/lib/actions/expense";
import { getAiBusinessInsightsAction } from "@/lib/actions/ai-insight";
import dynamicImport from "next/dynamic";
import { OptibizDashboardView } from "./dashboard-view";

const QuickExpenseModal = dynamicImport(
  () => import("./quick-expense-modal").then((m) => m.QuickExpenseModal)
);
const QuickTransactionFab = dynamicImport(
  () => import("./quick-transaction-fab").then((m) => m.QuickTransactionFab)
);

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [dashboardData, productsRes, user, expensesRes, aiInsightRes] = await Promise.all([
    getOptibizDashboardDataAction(),
    getProductsAction(),
    getCurrentUser(),
    getExpensesAction(),
    getAiBusinessInsightsAction(),
  ]);

  const products = productsRes.data || [];
  const initialExpenses = expensesRes.data || [];

  return (
    <div className="space-y-6">
      <OptibizDashboardView data={dashboardData} aiInsight={aiInsightRes} />

      {/* Floating Action Modals for Quick Expenses & POS Cashier */}
      <QuickExpenseModal initialExpenses={initialExpenses} />
      <QuickTransactionFab products={products} userId={user?.id} />
    </div>
  );
}

