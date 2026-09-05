import { getCurrentUser } from "@/lib/auth/session";
import { getProductsAction } from "@/lib/actions/product";
import { PosKasirView } from "./pos-kasir-view";

export const metadata = {
  title: "Kasir POS & Transaksi | REKA UMKM",
  description: "Pencatatan Transaksi Penjualan Kasir POS Real-Time",
};

export default async function TransaksiPage() {
  const [user, productsRes] = await Promise.all([
    getCurrentUser(),
    getProductsAction(),
  ]);

  const products = productsRes.data || [];

  return <PosKasirView initialProducts={products} userId={user?.id} />;
}
