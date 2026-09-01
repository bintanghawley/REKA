import { getCurrentProfile } from "@/lib/auth/session";
import { ProfileForm } from "./profile-form";

export default async function OnboardingPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Profil Usaha UMKM</h1>
        <p className="text-sm text-slate-500 mt-1">
          Lengkapi atau perbarui identitas usaha Anda untuk personalisasi aplikasi.
        </p>
      </div>

      <ProfileForm initialProfile={profile} />
    </div>
  );
}
