"use server";

import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations/profile";
import type { Profile } from "@/types/database";
import { revalidatePath } from "next/cache";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Mengambil profil usaha milik user yang sedang terautentikasi.
 *
 * PENEGAKAN OWNERSHIP (pengganti RLS):
 * profiles.id === users.id (relasi 1-to-1). Query dengan where: { id: user.id }
 * secara inheren hanya bisa mengembalikan profil milik user aktif.
 */
export async function getProfileAction(): Promise<ActionResult<Profile>> {
  try {
    const user = await requireAuth();

    const profile = await db.profile.findUnique({
      where: { id: user.id }, // PENEGAKAN OWNERSHIP: profiles.id = users.id
    });

    if (!profile) {
      return { success: false, error: "Profil tidak ditemukan." };
    }

    const data: Profile = {
      id: profile.id,
      nama_usaha: profile.nama_usaha,
      jenis_usaha: profile.jenis_usaha,
      created_at: profile.created_at.toISOString(),
      updated_at: profile.updated_at.toISOString(),
    };

    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengambil data profil.";
    return { success: false, error: message };
  }
}

/**
 * Memperbarui data profil usaha UMKM.
 *
 * PENEGAKAN OWNERSHIP (pengganti RLS):
 * update dengan where: { id: user.id } — hanya bisa update profil diri sendiri.
 * Prisma akan throw jika record tidak ditemukan (P2025).
 */
export async function updateProfileAction(
  input: UpdateProfileInput
): Promise<ActionResult<Profile>> {
  const parseResult = updateProfileSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: "Validasi data profil gagal.",
      fieldErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  const { nama_usaha, jenis_usaha } = parseResult.data;

  try {
    const user = await requireAuth();

    const profile = await db.profile.update({
      where: { id: user.id }, // PENEGAKAN OWNERSHIP
      data: { nama_usaha, jenis_usaha },
    });

    const data: Profile = {
      id: profile.id,
      nama_usaha: profile.nama_usaha,
      jenis_usaha: profile.jenis_usaha,
      created_at: profile.created_at.toISOString(),
      updated_at: profile.updated_at.toISOString(),
    };

    revalidatePath("/dashboard");
    revalidatePath("/onboarding");
    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memperbarui profil usaha.";
    return { success: false, error: message };
  }
}
