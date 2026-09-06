"use client";

import { useState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);

    try {
      const res = await loginAction({ email, password });
      if (!res.success) {
        setError(res.error || "Login gagal.");
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      } else {
        router.push("/dashboard");
        router.refresh();
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
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl pointer-events-none"></div>

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
            href="/register"
            className="bg-primary hover:bg-primary-light text-white text-xs sm:text-sm font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all shadow-sm"
          >
            Daftar Akun
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 my-6 relative z-10">
        <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-dark/10 shadow-xl p-8 sm:p-10 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-primary-light to-primary-dark"></div>

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
              Masuk ke Akun
            </h1>
            <p className="text-sm text-neutral-dark mt-2 leading-relaxed">
              Kelola kasir kilat, katalog produk, dan pantau laba bersih harian usaha Anda secara instan.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-danger-light border border-danger/20 text-danger text-sm rounded-2xl flex items-start gap-3 animate-fade-in">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-primary-dark uppercase tracking-wider mb-2">
                Alamat Email
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-primary-dark uppercase tracking-wider">
                  Password
                </label>
              </div>
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 bg-primary hover:bg-primary-light text-white font-bold text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk Ke Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-dark/10 text-center text-sm text-neutral-dark">
            Belum punya akun REKA UMKM?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline hover:text-primary-dark transition-colors">
              Daftar Gratis Sekarang
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-neutral-dark/60 border-t border-neutral-dark/5 bg-white/50">
        &copy; {new Date().getFullYear()} REKA UMKM — Aplikasi Kasir Kilat &amp; Manajemen Laba Rugi
      </footer>
    </div>
  );
}

