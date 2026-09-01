import { z } from "zod";

export const createExpenseSchema = z.object({
  kategori: z
    .string({ required_error: "Kategori pengeluaran wajib diisi" })
    .trim()
    .min(1, "Kategori tidak boleh kosong")
    .max(150, "Kategori maksimal 150 karakter"),
  nominal: z.coerce
    .number({ required_error: "Nominal wajib diisi", invalid_type_error: "Nominal harus berupa angka" })
    .min(0, "Nominal tidak boleh negatif"),
  tanggal: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
    .optional(),
});

export const updateExpenseSchema = z.object({
  id: z.string().uuid("ID pengeluaran tidak valid"),
  kategori: z
    .string()
    .trim()
    .min(1, "Kategori tidak boleh kosong")
    .max(150, "Kategori maksimal 150 karakter")
    .optional(),
  nominal: z.coerce
    .number({ invalid_type_error: "Nominal harus berupa angka" })
    .min(0, "Nominal tidak boleh negatif")
    .optional(),
  tanggal: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
    .optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
