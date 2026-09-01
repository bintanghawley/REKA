"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";

export type AuthActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Server action untuk registrasi akun baru UMKM.
 * Data nama_usaha & jenis_usaha dikirim di options.data agar trigger handle_new_user()
 * otomatis membuat record di public.profiles secara aman.
 */
export async function registerAction(input: RegisterInput): Promise<AuthActionResult> {
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
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nama_usaha: nama_usaha || "Usaha Saya",
          jenis_usaha: jenis_usaha || "Lainnya",
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan pada server saat registrasi.";
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Server action untuk login dengan email & password.
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
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan pada server saat login.";
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Server action untuk logout user dan menghapus session cookie.
 */
export async function logoutAction(): Promise<AuthActionResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan saat logout.";
    return {
      success: false,
      error: message,
    };
  }
}
