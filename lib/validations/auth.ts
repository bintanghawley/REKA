import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email wajib diisi" })
    .email("Format email tidak valid")
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: "Password wajib diisi" })
    .min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z.object({
  email: z
    .string({ required_error: "Email wajib diisi" })
    .email("Format email tidak valid")
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: "Password wajib diisi" })
    .min(6, "Password minimal 6 karakter"),
  nama_usaha: z
    .string()
    .trim()
    .max(100, "Nama usaha maksimal 100 karakter")
    .optional()
    .default(""),
  jenis_usaha: z
    .string()
    .trim()
    .max(100, "Jenis usaha maksimal 100 karakter")
    .optional()
    .default(""),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
