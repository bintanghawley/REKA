import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";
import type { User } from "@supabase/supabase-js";

/**
 * Mengambil authenticated user dari session server saat ini.
 * Memanggil auth.getUser() yang memverifikasi token terhadap Supabase Auth server.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Mengambil profil usaha milik authenticated user yang sedang login.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const supabase = createClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      return null;
    }

    return profile;
  } catch {
    return null;
  }
}

/**
 * Memastikan user terautentikasi sebelum mengeksekusi operasi server.
 * Melempar error jika user tidak memiliki session yang valid.
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED: Sesi login tidak ditemukan atau telah kedaluwarsa.");
  }
  return user;
}
