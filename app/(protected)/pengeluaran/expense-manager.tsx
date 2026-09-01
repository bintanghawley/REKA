"use client";

import { useState } from "react";
import { createExpenseAction, deleteExpenseAction } from "@/lib/actions/expense";
import type { PengeluaranDadakan } from "@/types/database";
import { formatRupiah, formatTanggalIndo } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ExpenseManagerProps {
  initialExpenses: PengeluaranDadakan[];
}

export function ExpenseManager({ initialExpenses }: ExpenseManagerProps) {
  const router = useRouter();
  const [expenses, setExpenses] = useState<PengeluaranDadakan[]>(initialExpenses);
  const [kategori, setKategori] = useState("");
  const [nominal, setNominal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await createExpenseAction({
        kategori,
        nominal: Number(nominal),
      });

      if (!res.success) {
        setError(res.error || "Gagal mencatat pengeluaran.");
      } else if (res.data) {
        setExpenses([res.data, ...expenses]);
        setKategori("");
        setNominal("");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus catatan pengeluaran ini?")) return;
    try {
      const res = await deleteExpenseAction(id);
      if (res.success) {
        setExpenses(expenses.filter((e) => e.id !== id));
        router.refresh();
      } else {
        alert(res.error || "Gagal menghapus.");
      }
    } catch {
      alert("Terjadi kesalahan.");
    }
  }

  const totalPengeluaran = expenses.reduce(
    (sum, item) => sum + Number(item.nominal),
    0
  );

  return (
    <div className="space-y-6">
      {/* Form Input Pengeluaran */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-semibold text-slate-800 mb-4">
          + Catat Pengeluaran Baru
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Kategori / Keterangan Pengeluaran
            </label>
            <input
              type="text"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              required
              placeholder="Contoh: Beli Gas 3kg, Es Batu, Plastik Kresek"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Nominal (Rp)
            </label>
            <input
              type="number"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              required
              min="0"
              placeholder="20000"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : "Simpan Pengeluaran"}
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Pengeluaran */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-slate-800">
            Daftar Pengeluaran
          </h2>
          <span className="text-sm font-bold text-amber-700">
            Total: {formatRupiah(totalPengeluaran)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-2.5 rounded-l-lg">Tanggal</th>
                <th className="px-4 py-2.5">Keterangan</th>
                <th className="px-4 py-2.5">Nominal</th>
                <th className="px-4 py-2.5 rounded-r-lg text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-slate-400">
                    Belum ada pengeluaran dadakan yang dicatat.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {formatTanggalIndo(exp.tanggal)}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {exp.kategori}
                    </td>
                    <td className="px-4 py-3 font-semibold text-red-600">
                      -{formatRupiah(exp.nominal)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="text-xs text-red-600 hover:underline font-medium"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
