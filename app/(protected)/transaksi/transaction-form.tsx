"use client";

import { useState } from "react";
import { createTransactionAction } from "@/lib/actions/transaction";
import type { Produk } from "@/types/database";
import { formatRupiah } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface TransactionFormProps {
  products: Produk[];
}

export function TransactionForm({ products }: TransactionFormProps) {
  const router = useRouter();
  const [selectedProductId, setSelectedProductId] = useState(
    products.length > 0 ? products[0].id : ""
  );
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProductId) {
      setError("Silakan pilih produk terlebih dahulu.");
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await createTransactionAction({
        produk_id: selectedProductId,
        qty: Number(qty),
      });

      if (!res.success) {
        setError(res.error || "Gagal mencatat transaksi.");
      } else {
        setSuccessMsg(
          `Transaksi berhasil dicatat! Snapshot: Harga Jual Rp ${res.data?.harga_jual_saat_transaksi.toLocaleString(
            "id-ID"
          )} | HPP Rp ${res.data?.hpp_saat_transaksi.toLocaleString("id-ID")}`
        );
        setQty(1);
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  }

  if (products.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl text-center">
        <h3 className="text-amber-800 font-semibold mb-2">
          Belum Ada Produk Tersedia
        </h3>
        <p className="text-amber-700 text-sm mb-4">
          Anda perlu menambahkan master produk terlebih dahulu sebelum dapat mencatat transaksi.
        </p>
        <a
          href="/dashboard"
          className="inline-block px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-lg"
        >
          Ke Dashboard & Tambah Produk
        </a>
      </div>
    );
  }

  const subtotal = selectedProduct ? selectedProduct.harga_jual * qty : 0;
  const estimasiLaba = selectedProduct
    ? (selectedProduct.harga_jual - selectedProduct.hpp) * qty
    : 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5"
    >
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
          {successMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Pilih Produk yang Terjual
        </label>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama} — {formatRupiah(p.harga_jual)} (Modal: {formatRupiah(p.hpp)})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Jumlah Terjual (Qty)
        </label>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setQty((prev) => Math.max(1, prev - 1))}
            className="w-10 h-10 border border-slate-300 rounded-lg text-lg font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center"
          >
            -
          </button>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            className="w-24 text-center px-3 py-2 border border-slate-300 rounded-lg text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setQty((prev) => prev + 1)}
            className="w-10 h-10 border border-slate-300 rounded-lg text-lg font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      {/* Estimasi Kalkulasi Transaksi */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal Omzet:</span>
          <span className="font-semibold text-slate-800">{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Estimasi Laba Kotor:</span>
          <span className="font-semibold text-emerald-600">
            +{formatRupiah(estimasiLaba)}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50"
      >
        {isLoading ? "Menyimpan Transaksi..." : "Simpan Transaksi"}
      </button>
    </form>
  );
}
