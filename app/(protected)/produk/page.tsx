import { getProductsAction } from "@/lib/actions/product";
import { ProductView } from "./product-view";

export const metadata = {
  title: "Kelola Produk | OptiBiz REKA UMKM",
  description: "Halaman Manajemen Produk & Katalog Usaha UMKM",
};

export default async function ProdukPage() {
  const productsRes = await getProductsAction();
  const products = productsRes.data || [];

  return <ProductView initialProducts={products} />;
}
