import { getOptibizDashboardDataAction } from "@/lib/actions/optibiz-dashboard";
import { getProductsAction } from "@/lib/actions/product";
import { OptibizDashboardView } from "./optibiz-dashboard-view";
import { QuickTransactionFab } from "./quick-transaction-fab";
import { QuickExpenseModal } from "./quick-expense-modal";

export default async function DashboardPage() {
  const [dashboardData, productsRes] = await Promise.all([
    getOptibizDashboardDataAction(),
    getProductsAction(),
  ]);

  const products = productsRes.data || [];

  return (
    <div className="space-y-6">
      <OptibizDashboardView data={dashboardData} />

      {/* Floating Action Modals for Quick Expenses & POS Cashier */}
      <QuickExpenseModal />
      <QuickTransactionFab products={products} />
    </div>
  );
}

