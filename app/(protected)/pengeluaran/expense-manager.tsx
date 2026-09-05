"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createExpenseAction,
  deleteExpenseAction,
} from "@/lib/actions/expense";
import type { PengeluaranDadakan } from "@/types/database";
import { formatRupiah, formatTanggalIndo, getLocalDateString } from "@/lib/utils";
import {
  Receipt,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  TrendingDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Wallet,
  Coins,
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

interface ExpenseManagerProps {
  initialExpenses: PengeluaranDadakan[];
}

export function ExpenseManager({ initialExpenses }: ExpenseManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expenses, setExpenses] = useState<PengeluaranDadakan[]>(initialExpenses);
  const [activeTab, setActiveTab] = useState<"catat" | "riwayat">("catat");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [kategori, setKategori] = useState("");
  const [nominal, setNominal] = useState("");
  const [tanggal, setTanggal] = useState(getLocalDateString());
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync if initialExpenses updates
  useEffect(() => {
    setExpenses(initialExpenses);
  }, [initialExpenses]);

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

        setSuccessMsg(`Berhasil mencatat pengeluaran "${trimmedKategori}"!`);
        setKategori("");
        setNominal("");
        router.refresh();

        setTimeout(() => {
          setSuccessMsg(null);
        }, 3000);
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
    <div className="space-y-6">
      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Pengeluaran */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
              Total Pengeluaran
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#f67976]/10 text-[#f67976] border border-[#f67976]/20 flex items-center justify-center font-bold">
              <TrendingDown size={16} />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-mono text-2xl sm:text-3xl font-semibold text-[#141415] tracking-tight">
              {formatRupiah(totalPengeluaran)}
            </div>
            <p className="text-xs text-[#6e6f6c] mt-1 font-normal">
              Akumulasi biaya dadakan & operasional
            </p>
          </div>
        </div>

        {/* Total Catatan */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
              Total Transaksi
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#f35b22]/10 text-[#f35b22] border border-[#f35b22]/20 flex items-center justify-center font-bold">
              <Receipt size={16} />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-mono text-2xl sm:text-3xl font-semibold text-[#141415] tracking-tight">
              {expenses.length} <span className="text-sm font-normal text-[#6e6f6c]">Item</span>
            </div>
            <p className="text-xs text-[#6e6f6c] mt-1 font-normal">
              Jumlah transaksi yang tercatat
            </p>
          </div>
        </div>

        {/* Pengeluaran Rata-Rata */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
              Rata-rata per Catatan
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#8bc5f3]/10 text-[#0284c7] border border-[#8bc5f3]/30 flex items-center justify-center font-bold">
              <Coins size={16} />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-mono text-2xl sm:text-3xl font-semibold text-[#141415] tracking-tight">
              {formatRupiah(expenses.length > 0 ? Math.round(totalPengeluaran / expenses.length) : 0)}
            </div>
            <p className="text-xs text-[#6e6f6c] mt-1 font-normal">
              Rata-rata nominal per transaksi
            </p>
          </div>
        </div>
      </div>

      {/* 2. MAIN CARD */}
      <div className="bg-white rounded-[12px] border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] overflow-hidden flex flex-col">
        {/* Card Header */}
        <div className="px-5 py-4 border-b border-[#e4e5e1] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fafaf8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[4px] bg-white border border-[#e4e5e1] text-[#f35b22] flex items-center justify-center font-bold shrink-0">
              <Wallet size={18} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.88px] text-[#6e6f6c]">
                [ MODUL OPERASIONAL ]
              </div>
              <h2 className="text-base font-semibold text-[#141415] tracking-tight">
                Kelola Pengeluaran Usaha
              </h2>
            </div>
          </div>

          {/* Tab Navigation Segmented Switcher */}
          <div className="p-1 bg-[#f0f0ef] rounded-[4px] border border-[#e4e5e1] text-xs flex items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab("catat");
                setError(null);
              }}
              className={`px-3.5 py-1.5 rounded-[4px] transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                activeTab === "catat"
                  ? "bg-white text-[#141415] border border-[#e4e5e1] shadow-xs font-semibold"
                  : "text-[#6e6f6c] hover:text-[#141415] font-medium"
              }`}
            >
              <Plus size={13} />
              <span>+ Catat Baru</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("riwayat");
                setError(null);
              }}
              className={`px-3.5 py-1.5 rounded-[4px] transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                activeTab === "riwayat"
                  ? "bg-white text-[#141415] border border-[#e4e5e1] shadow-xs font-semibold"
                  : "text-[#6e6f6c] hover:text-[#141415] font-medium"
              }`}
            >
              <Receipt size={13} />
              <span>Daftar Riwayat ({expenses.length})</span>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Feedback Alerts */}
          {error && (
            <div className="p-3.5 bg-rose-50/70 border border-rose-200 text-rose-800 text-xs font-medium rounded-[4px] flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-[4px] flex items-start gap-2.5">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: FORM PENCATATAN PENGELUARAN */}
          {activeTab === "catat" && (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5">
              {/* Quick Select Category Chips */}
              <div>
                <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] mb-2">
                  Pilihan Kategori Cepat
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_CATEGORIES.map(({ label, emoji }) => {
                    const isSelected = kategori === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleQuickCategory(label)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs transition-colors cursor-pointer border ${
                          isSelected
                            ? "bg-[#f35b22]/10 border-[#f35b22] text-[#f35b22] font-semibold"
                            : "bg-[#fafaf8] border-[#e4e5e1] text-[#454542] hover:border-[#f35b22]/40 hover:bg-white font-medium"
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
                <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] mb-1.5">
                  Kategori / Keterangan Pengeluaran <span className="text-[#f35b22]">*</span>
                </label>
                <input
                  type="text"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  required
                  placeholder="Contoh: Beli Gas 3kg, Es Batu, Plastik Kresek, Bensin..."
                  className="w-full px-3.5 py-2.5 bg-[#fafaf8] border border-[#e4e5e1] rounded-[4px] text-sm text-[#141415] placeholder-[#b7b7b4] focus:outline-none focus:border-[#f35b22] focus:bg-white focus:ring-1 focus:ring-[#f35b22] transition-all"
                />
              </div>

              {/* Nominal Input & Quick Amount Buttons */}
              <div>
                <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] mb-1.5">
                  Nominal (Rp) <span className="text-[#f35b22]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[#6e6f6c] font-medium text-xs">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                    required
                    min="1"
                    placeholder="Contoh: 25000"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#fafaf8] border border-[#e4e5e1] rounded-[4px] font-mono text-sm font-semibold text-[#141415] placeholder-[#b7b7b4] focus:outline-none focus:border-[#f35b22] focus:bg-white focus:ring-1 focus:ring-[#f35b22] transition-all"
                  />
                </div>

                {/* Quick nominal buttons */}
                <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1">
                  {QUICK_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleAddAmount(amt)}
                      className="px-2.5 py-1 bg-[#f0f0ef] hover:bg-[#e4e5e1] text-[#141415] font-mono text-xs font-medium rounded-[4px] border border-[#e4e5e1] transition-all cursor-pointer whitespace-nowrap active:scale-98"
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
                  <p className="font-mono text-xs font-semibold text-[#f35b22] mt-2 flex items-center gap-1.5">
                    <Sparkles size={13} />
                    <span>Pratinjau: {formatRupiah(Number(nominal))}</span>
                  </p>
                )}
              </div>

              {/* Tanggal Input */}
              <div>
                <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] mb-1.5">
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
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#fafaf8] border border-[#e4e5e1] rounded-[4px] text-xs font-mono text-[#141415] focus:outline-none focus:border-[#f35b22] focus:bg-white focus:ring-1 focus:ring-[#f35b22] transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 bg-[#f35b22] hover:bg-[#ff5e24] text-white font-medium text-sm rounded-[4px] shadow-[rgba(255,255,255,0.2)_0px_1px_0px_0px_inset,rgba(24,25,22,0.06)_0px_1px_2px_0px,rgba(24,25,22,0.1)_0px_-1px_0px_0px_inset] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
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
              <div className="bg-[#fafaf8] border border-[#e4e5e1] rounded-[8px] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[4px] bg-[#f67976]/10 text-[#f67976] border border-[#f67976]/20 flex items-center justify-center font-bold">
                    <TrendingDown size={16} />
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.88px] text-[#6e6f6c]">
                      Total Pengeluaran Dicatat
                    </p>
                    <p className="font-mono text-lg sm:text-xl font-semibold text-[#141415]">
                      {formatRupiah(totalPengeluaran)}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-medium bg-white text-[#141415] px-2.5 py-1 rounded-[4px] border border-[#e4e5e1]">
                  {expenses.length} Transaksi
                </span>
              </div>

              {/* List of Expenses Table / Cards */}
              {expenses.length === 0 ? (
                <div className="bg-[#fafaf8] rounded-[8px] p-10 border border-[#e4e5e1] text-center space-y-3">
                  <div className="w-12 h-12 rounded-[4px] bg-white border border-[#e4e5e1] text-[#6e6f6c] flex items-center justify-center mx-auto">
                    <Receipt size={22} />
                  </div>
                  <p className="text-sm font-semibold text-[#141415]">
                    Belum ada catatan pengeluaran
                  </p>
                  <p className="text-xs text-[#6e6f6c] max-w-sm mx-auto">
                    Catat pengeluaran dadakan pertama Anda untuk menghitung Laba Bersih secara akurat.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("catat")}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#f35b22] text-white text-xs font-medium rounded-[4px] hover:bg-[#ff5e24] transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>+ Catat Pengeluaran Baru</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-white p-3.5 sm:p-4 rounded-[8px] border border-[#e4e5e1] hover:border-[#f35b22]/30 transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#141415] truncate">
                          {exp.kategori}
                        </p>
                        <p className="font-mono text-[11px] text-[#6e6f6c] mt-0.5">
                          {formatTanggalIndo(exp.tanggal)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <span className="font-mono text-sm sm:text-base font-semibold text-[#f67976]">
                          -{formatRupiah(Number(exp.nominal))}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleDelete(exp.id, exp.kategori)}
                          disabled={deletingId === exp.id}
                          title="Hapus Catatan Pengeluaran"
                          className="w-8 h-8 rounded-[4px] bg-[#fafaf8] hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-[#e4e5e1] hover:border-rose-200 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
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
  );
}
