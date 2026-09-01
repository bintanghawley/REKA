import { z } from "zod";

export const updateProfileSchema = z.object({
  nama_usaha: z
    .string({ required_error: "Nama usaha wajib diisi" })
    .trim()
    .min(1, "Nama usaha tidak boleh kosong")
    .max(150, "Nama usaha maksimal 150 karakter"),
  jenis_usaha: z
    .string({ required_error: "Jenis usaha wajib diisi" })
    .trim()
    .min(1, "Jenis usaha tidak boleh kosong")
    .max(150, "Jenis usaha maksimal 150 karakter"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
