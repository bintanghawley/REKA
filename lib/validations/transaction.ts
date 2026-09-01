import { z } from "zod";

export const createTransactionSchema = z.object({
  produk_id: z
    .string({ required_error: "Produk wajib dipilih" })
    .uuid("ID produk tidak valid"),
  qty: z.coerce
    .number({ required_error: "Jumlah (qty) wajib diisi", invalid_type_error: "Qty harus berupa angka" })
    .int("Qty harus berupa bilangan bulat")
    .min(1, "Qty minimal 1"),
  tanggal: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
    .optional(),
  jam: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "Format jam harus HH:MM atau HH:MM:SS")
    .optional(),
});

export const filterTransactionSchema = z.object({
  tanggalMulai: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
    .optional(),
  tanggalAkhir: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
    .optional(),
  produk_id: z.string().uuid("ID produk tidak valid").optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type FilterTransactionInput = z.infer<typeof filterTransactionSchema>;
