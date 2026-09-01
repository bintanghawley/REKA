"use client";

import { useState } from "react";
import { createProductAction, deleteProductAction } from "@/lib/actions/product";
import type { Produk } from "@/types/database";
import { formatRupiah } from "@/lib/utils";

interface ProductManagerProps {
  initialProducts: Produk[];
}

export function ProductManager({ initialProducts }: ProductManagerProps) {
  const [products, setProducts] = useState<Produk[]>(initialProducts);
  const [nama, setNama] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [hpp, setHpp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await createProductAction({
        nama,
        harga_jual: Number(hargaJual),
        hpp: Number(hpp),
      });

      if (!res.success) {
        setError(res.error || "Gagal menambahkan produk.");
      } else if (res.data) {
        setProducts([...products, res.data]);
        setNama("");
        setHargaJual("");
        setHpp("");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    try {
      const res = await deleteProductAction(id);
      if (res.success) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert(res.error || "Gagal menghapus produk.");
      }
    } catch {
      alert("Terjadi kesalahan.");
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Master Produk UMKM
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Form Tambah Produk */}
      <form
        onSubmit={handleAddProduct}
        className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200"
      >
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Nama Produk
          </label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            placeholder="Contoh: Es Kopi Susu"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Harga Jual (Rp)
          </label>
          <input
            type="number"
            value={hargaJual}
            onChange={(e) => setHargaJual(e.target.value)}
            required
            min="0"
            placeholder="15000"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            HPP Modal (Rp)
          </label>
          <input
            type="number"
            value={hpp}
            onChange={(e) => setHpp(e.target.value)}
            required
            min="0"
            placeholder="8000"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? "Menyimpan..." : "+ Tambah Produk"}
          </button>
        </div>
      </form>

      {/* Tabel Daftar Produk */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-2.5 rounded-l-lg">Nama Produk</th>
              <th className="px-4 py-2.5">Harga Jual</th>
              <th className="px-4 py-2.5">HPP (Modal)</th>
              <th className="px-4 py-2.5">Margin Per Item</th>
              <th className="px-4 py-2.5 rounded-r-lg text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-slate-400">
                  Belum ada produk terdaftar. Tambahkan produk pertama Anda di atas.
                </td>
              </tr>
            ) : (
              products.map((prod) => {
                const margin = prod.harga_jual - prod.hpp;
                return (
                  <tr key={prod.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {prod.nama}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatRupiah(prod.harga_jual)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatRupiah(prod.hpp)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">
                      +{formatRupiah(margin)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(prod.id)}
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
