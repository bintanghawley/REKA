import { getTransactionsAction } from "@/lib/actions/transaction";
import { HistoryList } from "./history-list";

export default async function RiwayatPage() {
  const res = await getTransactionsAction();
  const transactions = res.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Riwayat Transaksi Penjualan</h1>
        <p className="text-sm text-slate-500 mt-1">
          Daftar seluruh transaksi yang tercatat dengan snapshot harga historis masing-masing.
        </p>
      </div>

      <HistoryList initialTransactions={transactions} />
    </div>
  );
}
