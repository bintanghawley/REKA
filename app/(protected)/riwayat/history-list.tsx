"use client";

import { useState } from "react";
import { deleteTransactionAction } from "@/lib/actions/transaction";
import type { TransaksiWithProduk } from "@/types/database";
import { formatRupiah, formatTanggalIndo } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface HistoryListProps {
  initialTransactions: TransaksiWithProduk[];
}

export function HistoryList({ initialTransactions }: HistoryListProps) {
  const router = useRouter();
  const [transactions, setTransactions] =
    useState<TransaksiWithProduk[]>(initialTransactions);

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin membatalkan/menghapus transaksi ini?"))
      return;

    try {
      const res = await deleteTransactionAction(id);
      if (res.success) {
        setTransactions(transactions.filter((t) => t.id !== id));
        router.refresh();
      } else {
        alert(res.error || "Gagal menghapus transaksi.");
      }
    } catch {
      alert("Terjadi kesalahan.");
    }
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-slate-800">
          Riwayat Transaksi Tercatat ({transactions.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-2.5 rounded-l-lg">Waktu</th>
              <th className="px-4 py-2.5">Produk</th>
              <th className="px-4 py-2.5 text-center">Qty</th>
              <th className="px-4 py-2.5">Snapshot Harga Jual</th>
              <th className="px-4 py-2.5">Snapshot HPP (Modal)</th>
              <th className="px-4 py-2.5">Subtotal Omzet</th>
              <th className="px-4 py-2.5">Laba Kotor</th>
              <th className="px-4 py-2.5 rounded-r-lg text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-slate-400">
                  Belum ada riwayat transaksi penjualan.
                </td>
              </tr>
            ) : (
              transactions.map((trx) => {
                const subtotal = trx.harga_jual_saat_transaksi * trx.qty;
                const laba =
                  (trx.harga_jual_saat_transaksi - trx.hpp_saat_transaksi) *
                  trx.qty;

                return (
                  <tr key={trx.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      <div>{formatTanggalIndo(trx.tanggal)}</div>
                      <div className="text-[11px] text-slate-400">{trx.jam}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {trx.produk?.nama || "Produk dihapus"}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-slate-700">
                      {trx.qty}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatRupiah(trx.harga_jual_saat_transaksi)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatRupiah(trx.hpp_saat_transaksi)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {formatRupiah(subtotal)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">
                      +{formatRupiah(laba)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(trx.id)}
                        className="text-xs text-red-600 hover:underline font-medium"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
