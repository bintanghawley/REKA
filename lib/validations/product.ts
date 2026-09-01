import { z } from "zod";

export const createProductSchema = z.object({
  nama: z
    .string({ required_error: "Nama produk wajib diisi" })
    .trim()
    .min(1, "Nama produk tidak boleh kosong")
    .max(150, "Nama produk maksimal 150 karakter"),
  harga_jual: z.coerce
    .number({ required_error: "Harga jual wajib diisi", invalid_type_error: "Harga jual harus berupa angka" })
    .min(0, "Harga jual tidak boleh negatif"),
  hpp: z.coerce
    .number({ required_error: "HPP wajib diisi", invalid_type_error: "HPP harus berupa angka" })
    .min(0, "HPP tidak boleh negatif"),
});

export const updateProductSchema = z.object({
  id: z.string().uuid("ID produk tidak valid"),
  nama: z
    .string()
    .trim()
    .min(1, "Nama produk tidak boleh kosong")
    .max(150, "Nama produk maksimal 150 karakter")
    .optional(),
  harga_jual: z.coerce
    .number({ invalid_type_error: "Harga jual harus berupa angka" })
    .min(0, "Harga jual tidak boleh negatif")
    .optional(),
  hpp: z.coerce
    .number({ invalid_type_error: "HPP harus berupa angka" })
    .min(0, "HPP tidak boleh negatif")
    .optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
