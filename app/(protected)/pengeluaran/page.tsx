import { getExpensesAction } from "@/lib/actions/expense";
import { ExpenseManager } from "./expense-manager";

export default async function PengeluaranPage() {
  const res = await getExpensesAction();
  const expenses = res.data || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header section with DESIGN.md eyebrow */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#e4e5e1] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141415]">
            Pencatatan <span className="text-[#f35b22]">Pengeluaran</span> Dadakan
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6f6c] mt-1">
            Catat biaya operasional harian atau tak terduga untuk menghitung Laba Bersih secara akurat.
          </p>
        </div>
      </div>

      <ExpenseManager initialExpenses={expenses} />
    </div>
  );
}
