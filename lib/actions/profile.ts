"use server";

import { createClient } from "@/lib/supabase/server";
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
 */
export async function getProfileAction(): Promise<ActionResult<Profile>> {
  try {
    const user = await requireAuth();
    const supabase = createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengambil data profil.";
    return { success: false, error: message };
  }
}

/**
 * Memperbarui data profil usaha UMKM.
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
    const supabase = createClient();

    const { data, error } = await supabase
      .from("profiles")
      .update({
        nama_usaha,
        jenis_usaha,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/onboarding");
    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memperbarui profil usaha.";
    return { success: false, error: message };
  }
}
