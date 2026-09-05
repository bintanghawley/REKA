# AGENTS.md - Panduan untuk AI / Developer

## Project
REKA UMKM - Aplikasi kasir kilat dan manajemen laba rugi UMKM.
Next.js 14 (App Router) + TypeScript + Tailwind + Prisma (PostgreSQL via Supabase) + Auth.js v5. Target hosting: Vercel.

## Command penting
- `npm run dev` - jalankan dev server (port 3000)
- `npm run dev:reset` - reset cache `.next` & restart dev server (saat halaman blank/macet)
- `npm run build` - production build (validasi kode paling akurat)
- `npm run typecheck` - TypeScript check
- `npm run db:push` - push schema Prisma ke DB

## POLA PENTING - Jangan rusak dev server

`next dev` SANGAT rapuh terhadap perubahan file massal. Setiap kali
melakukan perubahan LARGE/rename/delete banyak file sekaligus
(20+ file, atau rename komponen/route), akan terjadi HAL INI:

1. Cache `.next` (manifest webpack) menjadi basi/korup
2. Gejala:
   - Halaman blank putih
   - Error "missing required error components, refreshing..."
   - Error "Unsupported Server Component type: undefined"
   - `GET /_next/static/*` mengembalikan 404
   - Route mengembalikan 404/500 padahal file sumbernya ada
3. INI BUKAN BUG DI KODE - ini bug cache dev server

### Aturan untuk menghindari & memperbaiki

1. SEBELUM melakukan perubahan besar (edit/rename/delete massal):
   - Matikan dulu dev server (`Ctrl+C` di terminal dev,
     atau kill proses di port 3000), ATAU
   - Selesaikan semua perubahan, lalu jalankan ulang.

2. Prinsipnya: JANGAN biarkan `next dev` berjalan LIVE saat Anda
   me-rename/menghapus/ mengubah banyak file sekaligus.

3. Jika terlanjur terjadi gejala di atas:
   - Jalankan `npm run dev:reset` (Windows PowerShell)
   - Atau manual: kill proses port 3000 -> hapus folder `.next`
     -> `npm run dev`
   - User harus HARD REFRESH browser (Ctrl+Shift+R)

4. Mengganti nilai di `.env` setara dengan perubahan besar:
   - Restart dev server setelah mengubah `.env` atau `.env.local`

## Struktur route
- `/` landing, `/dashboard`, `/produk`, `/transaksi`, `/pengeluaran`,
  `/profil` (halaman Profil usaha, bukan onboarding), `/riwayat`
- Auth: `/login`, `/register`
- Route group: `app/(protected)/` (butuh login), `app/(auth)/`
- Semua action di `lib/actions/` memakai `revalidatePath("/profil")`
  (diubah dari `/onboarding` - JANGAN kembalikan ke /onboarding)

## Konvensi kode
- Tanpa komentar tambahan kecuali diminta
- Bahasa UI: Bahasa Indonesia
- UI pakai Tailwind, ikon lucide-react
- Server actions: `"use server"` di `lib/actions/`
- Client components: `"use client"`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
