import { getCurrentUser } from "@/lib/auth/session";
import { getProductsAction } from "@/lib/actions/product";
import { ProductView } from "./product-view";

export const metadata = {
  title: "Kelola Produk | OptiBiz REKA UMKM",
  description: "Halaman Manajemen Produk & Katalog Usaha UMKM",
};

export default async function ProdukPage() {
  const [user, productsRes] = await Promise.all([
    getCurrentUser(),
    getProductsAction(),
  ]);

  const products = productsRes.data || [];

  return <ProductView initialProducts={products} userId={user?.id} />;
}
