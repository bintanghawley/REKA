"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTransactionAction } from "@/lib/actions/transaction";
import { formatRupiah } from "@/lib/utils";
import type { Produk } from "@/types/database";
import { Plus, X, Minus as MinusIcon, ShoppingBag, CheckCircle2 } from "lucide-react";

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
      {/* Centered Modal Overlay & Container (Prevents Cut-Offs) */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-neutral-dark/10 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] text-slate-800 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-dark/10 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <ShoppingBag size={18} />
                </div>
                <h3 className="text-base font-extrabold text-primary-dark">
                  {step === "select-product"
                    ? "Pilih Produk Terjual"
                    : `Jumlah Qty: ${selectedProduct?.nama}`}
                </h3>
              </div>
              <button
                onClick={close}
                className="w-8 h-8 rounded-full bg-neutral-bg hover:bg-neutral-dark/10 text-neutral-dark flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {step === "select-product" && (
                <>
                  {products.length === 0 ? (
                    <div className="text-center py-10 text-neutral-dark/60 space-y-3">
                      <ShoppingBag size={36} className="mx-auto text-neutral-dark/30" />
                      <p className="text-sm font-bold text-primary-dark">
                        Belum ada produk di database.
                      </p>
                      <p className="text-xs text-neutral-dark/60">
                        Tambahkan produk di menu <strong className="text-primary-dark">Produk</strong> terlebih dahulu.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                      {products.map((prod) => (
                        <button
                          key={prod.id}
                          onClick={() => selectProduct(prod)}
                          className="flex flex-col justify-between p-4 rounded-2xl border border-neutral-dark/10 hover:border-primary hover:bg-primary-xlight transition-all text-left group cursor-pointer shadow-2xs"
                        >
                          <div>
                            <span className="font-extrabold text-sm text-primary-dark group-hover:text-primary leading-snug block line-clamp-1">
                              {prod.nama}
                            </span>
                            <span className="text-xs text-primary font-black mt-1 block">
                              {formatRupiah(prod.harga_jual)}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-dark/60 mt-2 block font-semibold">
                            HPP {formatRupiah(prod.hpp)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {step === "set-qty" && selectedProduct && (
                <div className="flex flex-col items-center gap-5 py-2">
                  <div className="text-center space-y-1">
                    <p className="text-lg font-extrabold text-primary-dark">
                      {selectedProduct.nama}
                    </p>
                    <p className="text-primary font-black text-base">
                      {formatRupiah(selectedProduct.harga_jual)} / item
                    </p>
                  </div>

                  {/* Qty Stepper */}
                  <div className="flex items-center gap-5 my-2">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-12 h-12 rounded-2xl border border-neutral-dark/20 flex items-center justify-center hover:border-primary hover:bg-primary-xlight text-primary-dark transition-all font-bold cursor-pointer"
                    >
                      <MinusIcon size={20} />
                    </button>
                    <span className="text-4xl font-black text-primary-dark w-16 text-center tabular-nums">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(qty + 1)}
                      className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center hover:bg-primary-dark text-white transition-all shadow-md shadow-primary/20 font-bold cursor-pointer"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {/* Total calculation */}
                  <div className="bg-neutral-bg rounded-2xl p-4 w-full text-center border border-neutral-dark/10 space-y-1">
                    <p className="text-xs font-semibold text-neutral-dark/60">Subtotal Omzet</p>
                    <p className="text-2xl font-black text-primary-dark">
                      {formatRupiah(selectedProduct.harga_jual * qty)}
                    </p>
                    <p className="text-xs text-emerald-600 font-bold">
                      Estimasi Laba Kotor +{formatRupiah((selectedProduct.harga_jual - selectedProduct.hpp) * qty)}
                    </p>
                  </div>

                  {error && (
                    <p className="text-xs font-bold text-rose-600 text-center">{error}</p>
                  )}

                  <div className="flex gap-3 w-full pt-2">
                    <button
                      type="button"
                      onClick={() => setStep("select-product")}
                      className="flex-1 py-3 rounded-2xl border border-neutral-dark/10 text-neutral-dark font-bold text-xs hover:bg-neutral-bg transition-all cursor-pointer"
                    >
                      ← Ganti Produk
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isPending}
                      className="flex-1 py-3 rounded-2xl bg-primary hover:bg-primary-dark text-white font-extrabold text-xs transition-all disabled:opacity-50 shadow-md shadow-primary/20 cursor-pointer"
                    >
                      {isPending ? "Menyimpan..." : "✓ Simpan Transaksi"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setStep("select-product")}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center cursor-pointer"
        aria-label="Catat Transaksi Baru"
        title="Catat Transaksi Baru"
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>
    </>
  );
}
