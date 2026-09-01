"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createExpenseAction } from "@/lib/actions/expense";
import { formatRupiah } from "@/lib/utils";
import { Receipt, X } from "lucide-react";

const KATEGORI_CEPAT = [
  { label: "Bahan Baku", emoji: "🛒" },
  { label: "Bensin/Transport", emoji: "⛽" },
  { label: "Listrik/Air", emoji: "💡" },
  { label: "Lainnya", emoji: "📋" },
] as const;

type KategoriCepat = (typeof KATEGORI_CEPAT)[number]["label"] | "";

export function QuickExpenseModal() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [kategori, setKategori] = useState<KategoriCepat>("");
  const [customKategori, setCustomKategori] = useState("");
  const [nominal, setNominal] = useState("");
  const [error, setError] = useState<string | null>(null);

  function close() {
    setIsOpen(false);
    setKategori("");
    setCustomKategori("");
    setNominal("");
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const finalKategori =
      kategori === "Lainnya" ? customKategori.trim() : kategori;

    if (!finalKategori) {
      setError("Pilih atau isi kategori pengeluaran.");
      return;
    }

    const nominalNum = Number(nominal);
    if (!nominal || isNaN(nominalNum) || nominalNum <= 0) {
      setError("Masukkan nominal yang valid (lebih dari 0).");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createExpenseAction({
          kategori: finalKategori,
          nominal: nominalNum,
        });

        if (!res.success) {
          setError(res.error ?? "Gagal mencatat pengeluaran.");
          return;
        }

        close();
        router.refresh();
      } catch {
        setError("Terjadi kesalahan jaringan.");
      }
    });
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* Modal sheet */}
      {isOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800">
              Catat Pengeluaran Dadakan
            </h3>
            <button onClick={close} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-5 py-4 space-y-5"
          >
            {/* Kategori quick-select */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kategori Pengeluaran
              </label>
              <div className="grid grid-cols-2 gap-2">
                {KATEGORI_CEPAT.map(({ label, emoji }) => (
                  <button
                    type="button"
                    key={label}
                    onClick={() => {
                      setKategori(label);
                      if (label !== "Lainnya") setCustomKategori("");
                    }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      kategori === label
                        ? "border-primary bg-primary-xlight text-primary"
                        : "border-slate-200 text-slate-600 hover:border-primary/40"
                    }`}
                  >
                    <span>{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>

              {kategori === "Lainnya" && (
                <input
                  type="text"
                  value={customKategori}
                  onChange={(e) => setCustomKategori(e.target.value)}
                  placeholder="Tulis kategori sendiri..."
                  className="mt-3 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                />
              )}
            </div>

            {/* Nominal */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nominal (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
                  Rp
                </span>
                <input
                  type="number"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  placeholder="50000"
                  min="1"
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              {nominal && Number(nominal) > 0 && (
                <p className="text-xs text-slate-500 mt-1">
                  {formatRupiah(Number(nominal))}
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-danger font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-colors disabled:opacity-50 shadow-md"
            >
              {isPending ? "Menyimpan..." : "✓ Simpan Pengeluaran"}
            </button>
          </form>
        </div>
      )}

      {/* Trigger button — above FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-5 z-30 flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-primary text-primary rounded-full shadow-lg hover:bg-primary-xlight transition-all active:scale-95 text-sm font-semibold"
        aria-label="Catat Pengeluaran Dadakan"
      >
        <Receipt size={16} />
        <span className="hidden sm:inline">Pengeluaran</span>
      </button>
    </>
  );
}
