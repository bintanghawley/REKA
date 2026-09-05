import { getCurrentUser } from "@/lib/auth/session";
import { getOptibizDashboardDataAction } from "@/lib/actions/optibiz-dashboard";
import { getProductsAction } from "@/lib/actions/product";
import { getExpensesAction } from "@/lib/actions/expense";
import { OptibizDashboardView } from "./dashboard-view";
import { QuickTransactionFab } from "./quick-transaction-fab";
import { QuickExpenseModal } from "./quick-expense-modal";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [dashboardData, productsRes, user, expensesRes] = await Promise.all([
    getOptibizDashboardDataAction(),
    getProductsAction(),
    getCurrentUser(),
    getExpensesAction(),
  ]);

  const products = productsRes.data || [];
  const initialExpenses = expensesRes.data || [];

  return (
    <div className="space-y-6">
      <OptibizDashboardView data={dashboardData} />

      {/* Floating Action Modals for Quick Expenses & POS Cashier */}
      <QuickExpenseModal initialExpenses={initialExpenses} />
      <QuickTransactionFab products={products} userId={user?.id} />
    </div>
  );
}

