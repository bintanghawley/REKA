"use server";

import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations/profile";
import type { Profile, Produk } from "@/types/database";
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

/**
 * 3. Menyelesaikan Onboarding Setup Awal (Profil + Produk Awal sekaligus).
 */
export async function completeOnboardingAction(input: {
  nama_usaha: string;
  jenis_usaha: string;
  initialProducts?: Array<{ nama: string; harga_jual: number; hpp: number }>;
}): Promise<ActionResult<{ profile: Profile; productsCount: number }>> {
  const parseResult = updateProfileSchema.safeParse({
    nama_usaha: input.nama_usaha,
    jenis_usaha: input.jenis_usaha,
  });

  if (!parseResult.success) {
    return {
      success: false,
      error: "Validasi data profil gagal.",
      fieldErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuth();

    const result = await db.$transaction(async (tx) => {
      // 1. Update atau upsert profil usaha
      const updatedProfile = await tx.profile.upsert({
        where: { id: user.id },
        update: {
          nama_usaha: parseResult.data.nama_usaha,
          jenis_usaha: parseResult.data.jenis_usaha,
        },
        create: {
          id: user.id,
          nama_usaha: parseResult.data.nama_usaha,
          jenis_usaha: parseResult.data.jenis_usaha,
        },
      });

      // 2. Tambah produk awal jika ada
      let productsCount = 0;
      if (input.initialProducts && input.initialProducts.length > 0) {
        const validProducts = input.initialProducts.filter(
          (p) => p.nama.trim().length > 0 && p.harga_jual >= 0 && p.hpp >= 0
        );

        if (validProducts.length > 0) {
          for (const prod of validProducts) {
            await tx.produk.create({
              data: {
                user_id: user.id,
                nama: prod.nama.trim(),
                harga_jual: prod.harga_jual,
                hpp: prod.hpp,
              },
            });
          }
          productsCount = validProducts.length;
        }
      }

      return { profile: updatedProfile, productsCount };
    });

    const profileData: Profile = {
      id: result.profile.id,
      nama_usaha: result.profile.nama_usaha,
      jenis_usaha: result.profile.jenis_usaha,
      created_at: result.profile.created_at.toISOString(),
      updated_at: result.profile.updated_at.toISOString(),
    };

    revalidatePath("/dashboard");
    revalidatePath("/profil");
    revalidatePath("/transaksi");

    return {
      success: true,
      data: {
        profile: profileData,
        productsCount: result.productsCount,
      },
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menyelesaikan onboarding.";
    return { success: false, error: message };
  }
}

