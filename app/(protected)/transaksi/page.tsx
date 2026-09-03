import { getProductsAction } from "@/lib/actions/product";
import { PosKasirView } from "./pos-kasir-view";

export const metadata = {
  title: "Kasir POS & Transaksi | REKA UMKM",
  description: "Pencatatan Transaksi Penjualan Kasir POS Real-Time",
};

export default async function TransaksiPage() {
  const productsRes = await getProductsAction();
  const products = productsRes.data || [];

  return <PosKasirView initialProducts={products} />;
}
