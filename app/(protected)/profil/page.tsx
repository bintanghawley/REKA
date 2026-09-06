import { getCurrentProfile } from "@/lib/auth/session";
import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header with DESIGN.md eyebrow */}
      <div className="border-b border-[#e4e5e1] pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141415]">
          Profil <span className="text-[#f35b22]">Usaha</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#6e6f6c] mt-1">
          Kelola identitas dan informasi usaha Anda di sini.
        </p>
      </div>

      <ProfileForm initialProfile={profile} />
    </div>
  );
}
