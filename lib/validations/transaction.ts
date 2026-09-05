import { z } from "zod";


export const batchTransactionItemSchema = z.object({
  produk_id: z.string({ required_error: "ID produk wajib diisi" }).min(1),
  qty: z.coerce
    .number({ required_error: "Qty wajib diisi" })
    .int("Qty harus bilangan bulat")
    .min(1, "Qty minimal 1"),
});

export const createBatchTransactionSchema = z.object({
  items: z
    .array(batchTransactionItemSchema)
    .min(1, "Minimal pilih 1 produk untuk transaksi"),
  waktu: z
    .string()
    .datetime({ message: "Format waktu tidak valid (harus ISO 8601)" })
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
  produk_id: z.string().min(1).optional(),
});

export type BatchTransactionItemInput = z.infer<typeof batchTransactionItemSchema>;
export type CreateBatchTransactionInput = z.infer<typeof createBatchTransactionSchema>;
export type FilterTransactionInput = z.infer<typeof filterTransactionSchema>;

