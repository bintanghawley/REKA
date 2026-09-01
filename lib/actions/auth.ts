"use server";

import { signIn, signOut } from "@/auth";
import { db } from "@/lib/prisma";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export type AuthActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Server action untuk registrasi akun baru UMKM.
 *
 * Menggantikan supabase.auth.signUp() + trigger handle_new_user().
 * Proses dilakukan dalam satu transaksi Prisma agar atomic:
 *   1. Hash password dengan bcrypt
 *   2. Buat user baru di tabel `users`
 *   3. Buat profil default di tabel `profiles` (1-to-1 dengan user)
 *   4. Login otomatis dengan signIn() dari Auth.js
 */
export async function registerAction(
  input: RegisterInput
): Promise<AuthActionResult> {
  const parseResult = registerSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: "Validasi data registrasi gagal.",
      fieldErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  const { email, password, nama_usaha, jenis_usaha } = parseResult.data;

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.",
      };
    }

    // Hash password sebelum disimpan
    const password_hash = await bcrypt.hash(password, 12);

    // Buat user + profil dalam satu transaksi Prisma (atomic)
    // Menggantikan trigger handle_new_user() dari Supabase
    await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password_hash,
        },
      });

      await tx.profile.create({
        data: {
          id: newUser.id, // profiles.id = users.id (1-to-1)
          nama_usaha: nama_usaha || "Usaha Saya",
          jenis_usaha: jenis_usaha || "Lainnya",
        },
      });
    });

    // Login otomatis setelah registrasi berhasil
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (err: unknown) {
    if (err instanceof AuthError) {
      return {
        success: false,
        error: "Registrasi berhasil, tapi login otomatis gagal. Silakan masuk manual.",
      };
    }
    const message =
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan pada server saat registrasi.";
    return { success: false, error: message };
  }
}

/**
 * Server action untuk login dengan email & password.
 * Mendelegasikan verifikasi ke Auth.js Credentials provider.
 */
export async function loginAction(input: LoginInput): Promise<AuthActionResult> {
  const parseResult = loginSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: "Validasi input login gagal.",
      fieldErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parseResult.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (err: unknown) {
    if (err instanceof AuthError) {
      // AuthError.type memberi tahu jenis kegagalan
      switch (err.type) {
        case "CredentialsSignin":
          return {
            success: false,
            error: "Email atau password salah.",
          };
        default:
          return {
            success: false,
            error: "Terjadi kesalahan autentikasi.",
          };
      }
    }
    const message =
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan pada server saat login.";
    return { success: false, error: message };
  }
}

/**
 * Server action untuk logout user dan menghapus session cookie.
 * Memanggil signOut() dari Auth.js.
 */
export async function logoutAction(): Promise<AuthActionResult> {
  try {
    await signOut({ redirect: false });
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan saat logout.";
    return { success: false, error: message };
  }
}
