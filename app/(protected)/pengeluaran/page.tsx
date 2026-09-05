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
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.88px] text-[#f35b22] bg-[#f35b22]/10 px-2 py-0.5 rounded-[4px] font-medium border border-[#f35b22]/20">
              [ CATAT PENGELUARAN // BIAYA OPERASIONAL ]
            </span>
          </div>
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
