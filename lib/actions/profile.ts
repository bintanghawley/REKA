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
 * 1. Mengambil profil usaha milik user yang sedang terautentikasi.
 */
export async function getProfileAction(): Promise<ActionResult<Profile>> {
  try {
    const user = await requireAuth();

    const profile = await db.profile.findUnique({
      where: { id: user.id },
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
 * 2. Memperbarui data profil usaha UMKM.
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
      where: { id: user.id },
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
    revalidatePath("/profil");
    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memperbarui profil usaha.";
    return { success: false, error: message };
  }
}


