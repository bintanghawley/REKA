"use client";

import { useState } from "react";
import { registerAction } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Store,
  Tag,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [namaUsaha, setNamaUsaha] = useState("");
  const [jenisUsaha, setJenisUsaha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);

    try {
      const res = await registerAction({
        email,
        password,
        nama_usaha: namaUsaha,
        jenis_usaha: jenisUsaha,
      });

      if (!res.success) {
        setError(res.error || "Registrasi gagal.");
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1200);
      }
    } catch {
      setError("Terjadi kesalahan jaringan atau server.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-bg flex flex-col font-sans relative overflow-x-hidden">
      {/* Subtle Background Glows matching Landing Page */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-neutral-dark/10 px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center group">
          <img
            src="/logo.png"
            alt="REKA"
            loading="lazy"
            decoding="async"
            className="h-8 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-dark hover:text-primary transition-colors px-3 py-2 rounded-full border border-neutral-dark/10 hover:border-primary/30 bg-white"
          >
            <ArrowLeft size={14} /> Beranda
          </Link>
          <Link
            href="/login"
            className="text-xs sm:text-sm font-semibold text-primary-dark hover:text-primary transition-colors px-4 py-2"
          >
            Masuk
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 my-6 relative z-10">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-neutral-dark/10 shadow-xl p-8 sm:p-10 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-dark via-primary to-primary-light"></div>

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
              Daftar Akun UMKM
            </h1>
            <p className="text-sm text-neutral-dark mt-2 leading-relaxed max-w-sm mx-auto">
              Tinggalkan rekap manual. Buat akun sekarang dan mulai kelola usaha lebih profesional.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-danger-light border border-danger/20 text-danger text-sm rounded-2xl flex items-start gap-3 animate-fade-in">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess && (
            <div className="mb-6 p-4 bg-success-light border border-success/20 text-success text-sm rounded-2xl flex items-center gap-3 animate-fade-in font-medium">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>Registrasi berhasil! Mengalihkan Anda ke Dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-primary-dark uppercase tracking-wider mb-2">
                  Alamat Email <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-dark/50">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-neutral-bg border border-neutral-dark/15 rounded-2xl text-sm text-primary-dark placeholder-neutral-dark/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    placeholder="nama@usaha.com"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-danger mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle size={12} /> {fieldErrors.email[0]}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-primary-dark uppercase tracking-wider mb-2">
                  Password <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-dark/50">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-11 py-3 bg-neutral-bg border border-neutral-dark/15 rounded-2xl text-sm text-primary-dark placeholder-neutral-dark/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    placeholder="Minimal 6 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-dark/50 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-danger mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle size={12} /> {fieldErrors.password[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-dark uppercase tracking-wider mb-2">
                  Nama Usaha / Toko
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-dark/50">
                    <Store size={18} />
                  </div>
                  <input
                    type="text"
                    value={namaUsaha}
                    onChange={(e) => setNamaUsaha(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-bg border border-neutral-dark/15 rounded-2xl text-sm text-primary-dark placeholder-neutral-dark/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    placeholder="Contoh: Toko Maju Berkah"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-dark uppercase tracking-wider mb-2">
                  Jenis Usaha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-dark/50">
                    <Tag size={18} />
                  </div>
                  <input
                    type="text"
                    value={jenisUsaha}
                    onChange={(e) => setJenisUsaha(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-bg border border-neutral-dark/15 rounded-2xl text-sm text-primary-dark placeholder-neutral-dark/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    placeholder="Kuliner, Kelontong, Jasa..."
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full py-3.5 px-6 bg-primary hover:bg-primary-light text-white font-bold text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Mendaftarkan...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Berhasil!</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Sekarang</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-dark/10 text-center text-sm text-neutral-dark">
            Sudah memiliki akun REKA UMKM?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline hover:text-primary-dark transition-colors">
              Masuk di Sini
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-neutral-dark/60 border-t border-neutral-dark/5 bg-white/50">
        &copy; {new Date().getFullYear()} REKA UMKM — Solusi Pencatatan Usaha Berkelanjutan (SDG 8)
      </footer>
    </div>
  );
}

