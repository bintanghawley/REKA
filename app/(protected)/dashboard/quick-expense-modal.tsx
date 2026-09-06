"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createExpenseAction,
  deleteExpenseAction,
  getExpensesAction,
} from "@/lib/actions/expense";
import type { PengeluaranDadakan } from "@/types/database";
import { formatRupiah, formatTanggalIndo, getLocalDateString } from "@/lib/utils";
import {
  Receipt,
  X,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  TrendingDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const QUICK_CATEGORIES = [
  { label: "Bahan Baku", emoji: "🛒" },
  { label: "Bensin / Transport", emoji: "⛽" },
  { label: "Listrik / Gas / Air", emoji: "💡" },
  { label: "Kemasan & Plastik", emoji: "📦" },
  { label: "Makan Karyawan", emoji: "🍽️" },
  { label: "Kebersihan", emoji: "🧹" },
  { label: "Lainnya", emoji: "📋" },
] as const;

const QUICK_AMOUNTS = [10000, 20000, 50000, 100000];

interface QuickExpenseModalProps {
  initialExpenses?: PengeluaranDadakan[];
}

export function QuickExpenseModal({
  initialExpenses = [],
}: QuickExpenseModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"catat" | "riwayat">("catat");

  // Expenses state
  const [expenses, setExpenses] = useState<PengeluaranDadakan[]>(initialExpenses);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [kategori, setKategori] = useState("");
  const [nominal, setNominal] = useState("");
  const [tanggal, setTanggal] = useState(getLocalDateString());
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync initialExpenses if updated from server
  useEffect(() => {
    if (initialExpenses.length > 0) {
      setExpenses(initialExpenses);
    }
  }, [initialExpenses]);

  // Listen for custom event from header button or elsewhere
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setError(null);
      setSuccessMsg(null);
    };
    window.addEventListener("open-quick-expense", handleOpen);
    return () => window.removeEventListener("open-quick-expense", handleOpen);
  }, []);

  // Fetch latest expenses when opening modal
  useEffect(() => {
    if (isOpen) {
      getExpensesAction().then((res) => {
        if (res.success && res.data) {
          setExpenses(res.data);
        }
      });
    }
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    setKategori("");
    setNominal("");
    setTanggal(getLocalDateString());
    setError(null);
    setSuccessMsg(null);
  }

  function handleQuickCategory(label: string) {
    if (label === "Lainnya") {
      setKategori("");
    } else {
      setKategori(label);
    }
    setError(null);
  }

  function handleAddAmount(amount: number) {
    const current = Number(nominal) || 0;
    setNominal(String(current + amount));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedKategori = kategori.trim();
    if (!trimmedKategori) {
      setError("Kategori / keterangan pengeluaran wajib diisi.");
      return;
    }

    const nominalNum = Number(nominal);
    if (!nominal || isNaN(nominalNum) || nominalNum <= 0) {
      setError("Nominal harus berupa angka valid lebih dari 0.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createExpenseAction({
          kategori: trimmedKategori,
          nominal: nominalNum,
          tanggal: tanggal || undefined,
        });

        if (!res.success) {
          setError(res.error ?? "Gagal mencatat pengeluaran.");
          return;
        }

        if (res.data) {
          setExpenses((prev) => [res.data!, ...prev]);
        }

        setSuccessMsg(`Berhasil mencatat pengeluaran ${trimmedKategori}!`);
        setKategori("");
        setNominal("");
        router.refresh();

        // Auto clear success message after 2.5s
        setTimeout(() => {
          setSuccessMsg(null);
        }, 2500);
      } catch {
        setError("Terjadi kesalahan jaringan.");
      }
    });
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus catatan pengeluaran "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res = await deleteExpenseAction(id);
      if (res.success) {
        setExpenses((prev) => prev.filter((item) => item.id !== id));
        router.refresh();
      } else {
        alert(res.error || "Gagal menghapus pengeluaran.");
      }
    } catch {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setDeletingId(null);
    }
  }

  const totalPengeluaran = expenses.reduce(
    (sum, item) => sum + Number(item.nominal),
    0
  );

  return (
    <>
      {/* Trigger Button: Floating above bottom-right */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[152px] right-4 sm:right-6 z-30 flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-primary text-primary hover:bg-primary-xlight rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 text-sm font-bold cursor-pointer"
        aria-label="Catat Pengeluaran"
      >
        <Receipt size={17} className="text-primary shrink-0" />
        <span className="hidden sm:inline">Pengeluaran</span>
      </button>

      {/* Modal Dialog Backdrop & Container */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-neutral-dark/10 shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 relative text-slate-800">
            {/* Modal Header */}
            <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                  <Receipt size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-primary-dark tracking-tight">
                    Pengeluaran Dadakan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Catat biaya operasional & pantau laba bersih
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={close}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tab Navigation (Segmented Switcher) */}
            <div className="px-5 pt-3 pb-2 sm:px-6 bg-slate-50/70 border-b border-slate-100 shrink-0">
              <div className="grid grid-cols-2 p-1 bg-slate-200/70 rounded-2xl text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("catat");
                    setError(null);
                  }}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "catat"
                      ? "bg-white text-primary-dark shadow-sm"
                      : "hover:text-slate-900"
                    }`}
                >
                  <Plus size={14} />
                  <span>+ Catat Baru</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("riwayat");
                    setError(null);
                  }}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "riwayat"
                      ? "bg-white text-primary-dark shadow-sm"
                      : "hover:text-slate-900"
                    }`}
                >
                  <Receipt size={14} />
                  <span>Daftar Riwayat ({expenses.length})</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Alert Feedback Messages */}
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium rounded-2xl flex items-start gap-2.5">
                  <AlertCircle size={17} className="shrink-0 text-rose-600 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium rounded-2xl flex items-start gap-2.5">
                  <CheckCircle2 size={17} className="shrink-0 text-emerald-600 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* TAB 1: FORM PENCATATAN PENGELUARAN */}
              {activeTab === "catat" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Quick Select Category Chips */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Pilihan Kategori Cepat
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_CATEGORIES.map(({ label, emoji }) => {
                        const isSelected = kategori === label;
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => handleQuickCategory(label)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${isSelected
                                ? "bg-primary-xlight border-primary text-primary-dark shadow-2xs font-bold"
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:border-primary/40 hover:bg-white"
                              }`}
                          >
                            <span>{emoji}</span>
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Kategori / Keterangan Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Kategori / Keterangan Pengeluaran <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      required
                      placeholder="Contoh: Beli Gas 3kg, Es Batu, Plastik Kresek, Bensin..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>

                  {/* Nominal Input & Quick Amount Buttons */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Nominal (Rp) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                        Rp
                      </span>
                      <input
                        type="number"
                        value={nominal}
                        onChange={(e) => setNominal(e.target.value)}
                        required
                        min="1"
                        placeholder="Contoh: 25000"
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
                      />
                    </div>

                    {/* Quick nominal buttons */}
                    <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5">
                      {QUICK_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleAddAmount(amt)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                        >
                          +{amt >= 1000 ? `${amt / 1000}rb` : amt}
                        </button>
                      ))}
                      {nominal && Number(nominal) > 0 && (
                        <button
                          type="button"
                          onClick={() => setNominal("")}
                          className="px-2 py-1 text-slate-400 hover:text-slate-600 text-xs font-medium cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    {/* Formatted live preview */}
                    {nominal && Number(nominal) > 0 && (
                      <p className="text-xs font-bold text-primary-dark mt-1.5 flex items-center gap-1">
                        <Sparkles size={13} />
                        <span>{formatRupiah(Number(nominal))}</span>
                      </p>
                    )}
                  </div>

                  {/* Tanggal Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Tanggal Pengeluaran
                    </label>
                    <div className="relative">
                      <Calendar
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="date"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:border-primary focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-2xl shadow-md shadow-primary/20 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isPending ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Menyimpan Pengeluaran...</span>
                        </>
                      ) : (
                        <>
                          <span>✓ Simpan Pengeluaran</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: DAFTAR & RIWAYAT PENGELUARAN */}
              {activeTab === "riwayat" && (
                <div className="space-y-4">
                  {/* Total Pengeluaran Banner */}
                  <div className="bg-primary-xlight/60 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary-dark flex items-center justify-center font-bold">
                        <TrendingDown size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-dark/70 font-medium">
                          Total Pengeluaran Dicatat
                        </p>
                        <p className="text-base sm:text-lg font-black text-primary-dark">
                          {formatRupiah(totalPengeluaran)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-white text-primary-dark px-2.5 py-1 rounded-full border border-primary/20">
                      {expenses.length} Item
                    </span>
                  </div>

                  {/* List of Expenses */}
                  {expenses.length === 0 ? (
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                        <Receipt size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        Belum ada catatan pengeluaran
                      </p>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Klik tombol di tab &quot;+ Catat Baru&quot; untuk mencatat biaya operasional pertama Anda.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab("catat")}
                        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-primary-dark transition-all cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Catat Sekarang</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                      {expenses.map((exp) => (
                        <div
                          key={exp.id}
                          className="bg-white p-3.5 rounded-2xl border border-slate-200/80 hover:border-primary/30 transition-all flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-800 truncate">
                              {exp.kategori}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {formatTanggalIndo(exp.tanggal)}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-sm font-black text-rose-600">
                              -{formatRupiah(Number(exp.nominal))}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleDelete(exp.id, exp.kategori)}
                              disabled={deletingId === exp.id}
                              title="Hapus Pengeluaran"
                              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
                            >
                              {deletingId === exp.id ? (
                                <Loader2 size={14} className="animate-spin text-rose-600" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
