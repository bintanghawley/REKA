import { z } from "zod";

export const STANDARD_EXPENSE_CATEGORIES = [
  "Bahan Baku Tambahan",
  "Transportasi & Bensin",
  "Kemasan & Plastik",
  "Listrik, Air & Gas",
  "Makan & Minum Karyawan",
  "Kebersihan & Perlengkapan",
  "Sewa & Retribusi Lapak",
  "Lain-lain",
] as const;

export const createExpenseSchema = z.object({
  kategori: z
    .string({ required_error: "Kategori pengeluaran wajib diisi" })
    .trim()
    .min(1, "Kategori tidak boleh kosong")
    .max(150, "Kategori maksimal 150 karakter"),
  nominal: z.coerce
    .number({ required_error: "Nominal wajib diisi", invalid_type_error: "Nominal harus berupa angka" })
    .min(1, "Nominal pengeluaran minimal Rp 1")
    .max(500_000_000, "Nominal melebihi batas wajar UMKM (maksimal Rp 500.000.000)"),
  tanggal: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
    .optional(),
});

export const filterExpenseSchema = z.object({
  tanggalMulai: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
    .optional(),
  tanggalAkhir: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
    .optional(),
  kategori: z.string().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type FilterExpenseInput = z.infer<typeof filterExpenseSchema>;

