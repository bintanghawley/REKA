"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTransactionAction } from "@/lib/actions/transaction";
import { formatRupiah } from "@/lib/utils";
import type { Produk } from "@/types/database";
import { Plus, X, Minus as MinusIcon } from "lucide-react";

interface QuickTransactionFabProps {
  products: Produk[];
}

type Step = "closed" | "select-product" | "set-qty";

export function QuickTransactionFab({ products }: QuickTransactionFabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>("closed");
  const [selectedProduct, setSelectedProduct] = useState<Produk | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);

  function close() {
    setStep("closed");
    setSelectedProduct(null);
    setQty(1);
    setError(null);
  }

  function selectProduct(prod: Produk) {
    setSelectedProduct(prod);
    setQty(1);
    setError(null);
    setStep("set-qty");
  }

  function handleSubmit() {
    if (!selectedProduct) return;
    setError(null);

    startTransition(async () => {
      try {
        const res = await createTransactionAction({
          produk_id: selectedProduct.id,
          qty,
        });

        if (!res.success) {
          setError(res.error ?? "Gagal mencatat transaksi.");
          return;
        }

        close();
        router.refresh();
      } catch {
        setError("Terjadi kesalahan jaringan.");
      }
    });
  }

  const isOpen = step !== "closed";

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* Bottom Sheet */}
      {isOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800">
              {step === "select-product"
                ? "Pilih Produk"
                : `Berapa qty ${selectedProduct?.nama}?`}
            </h3>
            <button onClick={close} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {step === "select-product" && (
              <>
                {products.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <p className="text-sm">Belum ada produk.</p>
                    <p className="text-xs mt-1">
                      Tambahkan produk di halaman Dashboard → Master Produk.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {products.map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => selectProduct(prod)}
                        className="flex flex-col items-start p-3 rounded-xl border-2 border-slate-200 hover:border-primary hover:bg-primary-xlight transition-all text-left active:scale-95"
                      >
                        <span className="font-semibold text-sm text-slate-800 leading-snug">
                          {prod.nama}
                        </span>
                        <span className="text-xs text-primary font-bold mt-1">
                          {formatRupiah(prod.harga_jual)}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          HPP {formatRupiah(prod.hpp)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {step === "set-qty" && selectedProduct && (
              <div className="flex flex-col items-center gap-6 py-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-800">
                    {selectedProduct.nama}
                  </p>
                  <p className="text-primary font-semibold text-lg">
                    {formatRupiah(selectedProduct.harga_jual)} / item
                  </p>
                </div>

                {/* Qty Stepper */}
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-primary hover:bg-primary-xlight transition-colors"
                  >
                    <MinusIcon size={20} className="text-slate-600" />
                  </button>
                  <span className="text-5xl font-bold text-slate-800 w-16 text-center tabular-nums">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:bg-primary-dark transition-colors shadow-md"
                  >
                    <Plus size={20} className="text-white" />
                  </button>
                </div>

                <div className="bg-neutral-bg rounded-xl p-4 w-full text-center">
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {formatRupiah(selectedProduct.harga_jual * qty)}
                  </p>
                  <p className="text-xs text-success mt-1">
                    Laba kotor +{formatRupiah((selectedProduct.harga_jual - selectedProduct.hpp) * qty)}
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-danger text-center">{error}</p>
                )}

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setStep("select-product")}
                    className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium text-sm hover:border-slate-300"
                  >
                    ← Ganti Produk
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-colors disabled:opacity-50 shadow-md"
                  >
                    {isPending ? "Menyimpan..." : "✓ Simpan Transaksi"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAB Button — fixed bottom-right, thumb zone */}
      <button
        onClick={() => setStep("select-product")}
        className="fixed bottom-6 right-5 z-30 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center"
        aria-label="Catat Transaksi Baru"
        title="Catat Transaksi Baru"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>
    </>
  );
}
