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

  return (
    <>
      {/* Modal Dialog & Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center sm:items-center bg-black/45 backdrop-blur-[2px] p-0 sm:p-4 animate-in fade-in duration-150">
          {/* Backdrop Click Dismiss */}
          <div className="absolute inset-0 -z-10" onClick={close} />

          {/* Modal Card (Bottom Sheet on Mobile, Centered on Desktop) */}
          <div className="bg-[#ffffff] rounded-t-2xl sm:rounded-xl border-t sm:border border-[#e4e5e1] shadow-2xl w-full sm:max-w-md max-h-[85vh] flex flex-col overflow-hidden text-[#141415] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-150 relative">
            
            {/* Mobile Drag Handle */}
            <div className="w-10 h-1 bg-[#d9d9d9] rounded-full mx-auto mt-2.5 sm:hidden shrink-0" />

            {/* Header */}
            <div className="px-5 py-3.5 border-b border-[#e4e5e1] flex items-center justify-between bg-[#ffffff] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#ffcab5] text-[#d14200] flex items-center justify-center shrink-0">
                  <Receipt size={16} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-[#141415] tracking-tight">
                    Catat Pengeluaran
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#6e6f6c]">
                    Biaya operasional harian & modal
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={close}
                className="w-7 h-7 rounded-md bg-[#fafaf8] hover:bg-[#f0f0ef] border border-[#e4e5e1] text-[#6e6f6c] hover:text-[#141415] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X size={14} />
              </button>
            </div>

            {/* Segmented Switcher Tab */}
            <div className="p-1 bg-[#f0f0ef] rounded-lg border border-[#e4e5e1] mx-4 mt-3 grid grid-cols-2 text-xs shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("catat");
                  setError(null);
                }}
                className={`py-1.5 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "catat"
                    ? "bg-[#ffffff] text-[#f35b22] font-semibold shadow-xs"
                    : "text-[#6e6f6c] hover:text-[#141415]"
                }`}
              >
                <Plus size={13} />
                <span>Catat Baru</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("riwayat");
                  setError(null);
                }}
                className={`py-1.5 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "riwayat"
                    ? "bg-[#ffffff] text-[#f35b22] font-semibold shadow-xs"
                    : "text-[#6e6f6c] hover:text-[#141415]"
                }`}
              >
                <Receipt size={13} />
                <span>Riwayat ({expenses.length})</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5">
              {/* Feedback Alerts */}
              {error && (
                <div className="p-3 bg-[#f67976]/10 border border-[#f67976]/30 text-[#be400f] text-xs font-medium rounded-lg flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-lg flex items-start gap-2">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* TAB 1: FORM CATAT PENGELUARAN */}
              {activeTab === "catat" && (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Category Chips */}
                  <div>
                    <label className="block text-[11px] font-mono font-medium text-[#6e6f6c] mb-1.5 uppercase tracking-wider">
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
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#ffffff] border-[#f35b22] text-[#f35b22] font-semibold shadow-xs ring-1 ring-[#f35b22]/20"
                                : "bg-[#fafaf8] border-[#e4e5e1] text-[#454542] hover:border-[#d9d9d9]"
                            }`}
                          >
                            <span>{emoji}</span>
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Kategori Input */}
                  <div>
                    <label className="block text-[11px] font-mono font-medium text-[#6e6f6c] mb-1 uppercase tracking-wider">
                      Keterangan <span className="text-[#f35b22]">*</span>
                    </label>
                    <input
                      type="text"
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      required
                      placeholder="Contoh: Gas 3kg, Es Batu, Plastik..."
                      className="w-full bg-[#fafaf8] border border-[#e4e5e1] rounded-lg px-3 py-2 text-sm text-[#141415] placeholder:text-[#8c8c89] focus:outline-none focus:border-[#f35b22] focus:bg-[#ffffff] transition-all"
                    />
                  </div>

                  {/* Nominal Input & Quick Amounts */}
                  <div>
                    <label className="block text-[11px] font-mono font-medium text-[#6e6f6c] mb-1 uppercase tracking-wider">
                      Nominal Biaya (Rp) <span className="text-[#f35b22]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#8c8c89]">
                        Rp
                      </span>
                      <input
                        type="number"
                        value={nominal}
                        onChange={(e) => setNominal(e.target.value)}
                        required
                        min={1}
                        step={100}
                        placeholder="Contoh: 25000"
                        className="w-full bg-[#fafaf8] border border-[#e4e5e1] rounded-lg pl-9 pr-3 py-2 text-sm font-mono font-bold text-[#141415] placeholder:text-[#8c8c89] placeholder:font-normal focus:outline-none focus:border-[#f35b22] focus:bg-[#ffffff] transition-all"
                      />
                    </div>

                    {/* Quick Amounts */}
                    <div className="grid grid-cols-4 gap-1.5 mt-2">
                      {QUICK_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleAddAmount(amt)}
                          className="py-1 bg-[#fafaf8] border border-[#e4e5e1] hover:border-[#f35b22] text-[#141415] hover:text-[#f35b22] rounded-md text-xs font-mono font-medium transition-all text-center cursor-pointer shadow-xs"
                        >
                          +{amt / 1000}rb
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tanggal Input */}
                  <div>
                    <label className="block text-[11px] font-mono font-medium text-[#6e6f6c] mb-1 uppercase tracking-wider">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      className="w-full bg-[#fafaf8] border border-[#e4e5e1] rounded-lg px-3 py-1.5 text-xs text-[#141415] focus:outline-none focus:border-[#f35b22] transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isPending || !kategori.trim() || !nominal}
                      className="w-full py-2.5 bg-[#f35b22] hover:bg-[#ff5e24] active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isPending ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={15} />
                          <span>Simpan Pengeluaran</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: RIWAYAT PENGELUARAN */}
              {activeTab === "riwayat" && (
                <div>
                  {expenses.length === 0 ? (
                    <div className="py-8 text-center text-[#8c8c89] space-y-2">
                      <Receipt size={32} className="mx-auto text-[#b7b7b4]" />
                      <p className="text-xs font-semibold text-[#141415]">Belum Ada Pengeluaran</p>
                      <p className="text-[11px]">Catatan pengeluaran harian akan muncul di sini.</p>
                      <button
                        type="button"
                        onClick={() => setActiveTab("catat")}
                        className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-[#f35b22] text-white text-xs font-medium rounded-lg cursor-pointer hover:bg-[#ff5e24]"
                      >
                        <Plus size={13} />
                        <span>Catat Sekarang</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[45vh] overflow-y-auto pr-0.5">
                      {expenses.map((exp) => (
                        <div
                          key={exp.id}
                          className="bg-[#fafaf8] p-2.5 rounded-lg border border-[#e4e5e1] hover:border-[#f35b22]/40 transition-all flex items-center justify-between gap-2.5 shadow-xs"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-[#141415] truncate">
                              {exp.kategori}
                            </p>
                            <p className="text-[10px] font-mono text-[#8c8c89] mt-0.5">
                              {formatTanggalIndo(exp.tanggal)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-mono font-bold text-[#be400f]">
                              -{formatRupiah(Number(exp.nominal))}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleDelete(exp.id, exp.kategori)}
                              disabled={deletingId === exp.id}
                              title="Hapus"
                              className="w-6 h-6 rounded-md bg-[#ffffff] hover:bg-[#f67976]/10 text-[#8c8c89] hover:text-[#be400f] flex items-center justify-center transition-colors cursor-pointer border border-[#e4e5e1]"
                            >
                              {deletingId === exp.id ? (
                                <Loader2 size={12} className="animate-spin text-[#be400f]" />
                              ) : (
                                <Trash2 size={12} />
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

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-[152px] right-4 sm:right-6 z-30 w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#ffffff] border border-[#e4e5e1] hover:border-[#f35b22] text-[#141415] hover:text-[#f35b22] hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer group shadow-[0_4px_16px_rgba(20,20,21,0.08),0_1px_3px_rgba(20,20,21,0.05)]"
        aria-label="Catat Pengeluaran"
        title="Catat Pengeluaran"
      >
        <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-[#f35b22] group-hover:scale-110 transition-transform" />

        {/* Tooltip on Hover */}
        <span className="hidden sm:block absolute right-16 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none bg-[#141415] text-[#ffffff] text-[11px] font-mono font-medium py-1 px-2.5 rounded-[4px] shadow-md whitespace-nowrap">
          Catat Pengeluaran
        </span>
      </button>
    </>
  );
}
