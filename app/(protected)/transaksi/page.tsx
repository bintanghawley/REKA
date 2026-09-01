import { getProductsAction } from "@/lib/actions/product";
import { TransactionForm } from "./transaction-form";

export default async function TransaksiPage() {
  const productsRes = await getProductsAction();
  const products = productsRes.data || [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Catat Transaksi Penjualan</h1>
        <p className="text-sm text-slate-500 mt-1">
          Harga jual dan HPP akan langsung di-snapshot ke database untuk menjamin integritas data historis omzet & laba.
        </p>
      </div>

      <TransactionForm products={products} />
    </div>
  );
}
