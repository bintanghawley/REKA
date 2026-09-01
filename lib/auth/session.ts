import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import type { Profile } from "@/types/database";

/**
 * Tipe SessionUser yang dikembalikan oleh Auth.js setelah login.
 * Menggantikan tipe User dari @supabase/supabase-js.
 */
export type SessionUser = {
  id: string;
  email: string | null | undefined;
};

/**
 * Mengambil authenticated user dari session JWT saat ini.
 * Membaca session dari Auth.js (httpOnly cookie) — tidak ada network request
 * ke Supabase Auth server.
 *
 * @returns SessionUser jika user sedang login, null jika tidak.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
    };
  } catch {
    return null;
  }
}

/**
 * Mengambil profil usaha milik authenticated user yang sedang login.
 * Query ke tabel `profiles` via Prisma menggunakan user.id dari session.
 *
 * @returns Profile jika ditemukan, null jika tidak ada session atau profil.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const profile = await db.profile.findUnique({
      where: { id: user.id },
    });

    if (!profile) return null;

    // Normalisasi ke tipe Profile yang dipakai seluruh aplikasi
    return {
      id: profile.id,
      nama_usaha: profile.nama_usaha,
      jenis_usaha: profile.jenis_usaha,
      created_at: profile.created_at.toISOString(),
      updated_at: profile.updated_at.toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Memastikan user terautentikasi sebelum mengeksekusi operasi server.
 * Melempar error jika user tidak memiliki session yang valid.
 *
 * Digunakan sebagai guard di setiap Server Action yang memerlukan auth.
 *
 * @returns SessionUser — dijamin ada jika tidak throw.
 * @throws Error "UNAUTHORIZED" jika tidak ada session.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED: Sesi login tidak ditemukan atau telah kedaluwarsa.");
  }
  return user;
}
