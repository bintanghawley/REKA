import { getExpensesAction } from "@/lib/actions/expense";
import { ExpenseManager } from "./expense-manager";

export default async function PengeluaranPage() {
  const res = await getExpensesAction();
  const expenses = res.data || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Pencatatan Pengeluaran Dadakan</h1>
        <p className="text-sm text-slate-500 mt-1">
          Catat biaya operasional harian atau tak terduga untuk menghitung Laba Bersih secara akurat.
        </p>
      </div>

      <ExpenseManager initialExpenses={expenses} />
    </div>
  );
}
