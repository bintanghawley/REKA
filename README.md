# 🏪 REKA (Rekap Kasir)

> **Aplikasi Kasir Point-of-Sale (POS) Kilat dan Manajemen Keuangan Real-Time Berbasis AI untuk Pelaku UMKM Indonesia.**

[![Next.js](https://img.shields.io/badge/Next.js-16%2B_(App_Router)-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-black?style=flat-square&logo=auth0)](https://authjs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_Assistant-8E75B2?style=flat-square&logo=google)](https://aistudio.google.com/)

---

# Akun Demo
- Email     : kuliner@reka.id
- Password  : demo123

---

## 📌 1. Penjelasan Aplikasi

### Latar Belakang
Aplikasi kasir (POS) saat ini sering kali terlalu rumit untuk UMKM menengah ke bawah karena menuntut input data yang panjang di tengah kesibukan melayani pembeli. Selain itu, masalah paling mematikan bagi pedagang kecil bukanlah sepinya pelanggan, melainkan kebocoran arus kas (uang campur aduk). Uang laci sering terpakai untuk pengeluaran darurat (beli gas, es batu) tanpa dicatat, membuat pedagang buta akan angka Laba Bersih riil mereka.

Lebih jauh lagi, data transaksi yang tercatat seringkali hanya menjadi angka mati karena pedagang tidak memiliki waktu menganalisis strategi jualan. Absennya pembukuan dasar dan wawasan data inilah yang selama ini menghambat kemajuan UMKM dan pencapaian target SDG 8 (Pekerjaan Layak dan Pertumbuhan Ekonomi).

### Tujuan
**REKA** hadir sebagai solusi aplikasi kasir digital terpadu yang dirancang khusus untuk mempermudah operasional harian UMKM:
1. **Kecepatan Transaksi:** Memungkinkan kasir mencatat transaksi hanya dalam **3 detik** (*Tap-to-Add & Instant Checkout*).
2. **Otomasi Laba Bersih Real-Time:** Otomatis menghitung Omzet, HPP, Pengeluaran Operasional, hingga Laba Bersih seketika saat transaksi disimpan tanpa perlu rekap manual.
3. **Integritas Finansial:** Mengunci *snapshot* modal dan harga jual saat transaksi terjadi, menjamin laporan keuangan historis tetap akurat meski harga bahan baku di masa depan berubah.
4. **Pendampingan Bisnis Cerdas:** Mengintegrasikan kecerdasan buatan untuk memberikan wawasan bisnis, evaluasi margin profit, dan rekomendasi strategi penjualan bagi pemilik usaha.

---

## 2. Fitur Utama & Keunggulan

Berikut adalah fitur-fitur pembeda sekaligus keunggulan utama dari **REKA**:

| Fitur | Deskripsi & Keunggulan |
| :--- | :--- |
|  **Kasir Kilat (3-Second POS)** | Antarmuka kasir cepat berbasis grid & kategori. Mendukung penambahan kuantitas satu ketuk, kalkulasi subtotal otomatis, dan checkout instan tanpa hambatan antrean. |
|  **Historical Price Snapshotting** | Setiap transaksi mengunci nilai `harga_jual` dan `hpp` pada detik transaksi dibuat. Laporan laba kotor & bersih masa lalu tidak akan terdistorsi ketika master harga produk diperbarui. |
|  **Pencatatan Pengeluaran Dadakan** | Menu pencatatan biaya operasional mikro yang terjadi di luar rencana (listrik, es batu, bumbu habis, retribusi) yang langsung memotong laba kotor hari itu menjadi laba bersih riil. |
|  **Dashboard & KPI Finansial Interaktif** | Visualisasi metrik bisnis penting (Total Omzet, Laba Kotor, Pengeluaran, Laba Bersih) serta grafik tren penjualan interaktif harian menggunakan Recharts. |
|  **AI Business Advisor** | Chatbot asisten finansial interaktif serta kartu *AI Smart Insight* yang menganalisis tren performa usaha dan memberikan saran taktis peningkatan margin. |
|  **Manajemen Katalog & HPP Produk** | Pengelolaan produk lengkap dengan kalkulasi otomatis margin keuntungan, pengaturan kategori, status ketersediaan (*Tersedia/Habis*), dan pencarian instan. |
|  **Riwayat & Timeline Transaksi** | Log riwayat transaksi harian yang rapi dengan rincian item, waktu penjualan, serta kemampuan peninjauan berkala. |
|  **Mobile-First & Warm Editorial Design** | Desain antarmuka modern yang nyaman di mata (*warm CRT & clean editorial palette*), ringan, serta sangat responsif dibuka via smartphone kasir, tablet, maupun laptop. |

---

## 🛠️ 3. Teknologi yang Digunakan

### **Frontend & Framework**
- **Next.js (App Router)**: Framework React modern untuk *Server Components*, *Server Actions*, routing dinamis, dan optimasi performa *zero-bundle-overhead*.
- **React**: Library antarmuka komponen UI yang reaktif dan modular.
- **TypeScript**: Menjamin keandalan kode (*type-safety*) dan meminimalkan potensi *runtime error*.
- **Tailwind CSS**: Utility-first CSS framework untuk styling responsif, cepat, dan konsisten.
- **Lucide React**: Paket ikon modern dan ringan.
- **Recharts**: Library visualisasi data dan grafik tren laba/omzet interaktif.

### **Backend & Database**
- **PostgreSQL via Supabase**: Database relasional tangguh berbasis *cloud* dengan dukungan koneksi pooling (Transaction Mode via PgBouncer).
- **Prisma ORM**: Object-Relational Mapping bertipe aman untuk skema database, migrasi, dan eksekusi query relasional.
- **Next.js Server Actions (`"use server"`)**: Penanganan mutasi data backend langsung tanpa memerlukan boilerplate API REST eksternal terpisah.
- **Zod**: Validasi skema data *input form* dan *payload request*.

### **Autentikasi & Keamanan**
- **Auth.js v5 (NextAuth.js)**: Sistem otentikasi sesi berbasis JWT yang aman dan terintegrasi dengan middleware proteksi rute.
- **Bcrypt.js**: Algoritma hashing *one-way* untuk perlindungan password pengguna.

### **Kecerdasan Buatan (AI)**
- **Google Gen AI SDK (`@google/genai`)**: Integrasi model LLM **Google Gemini** untuk fitur chatbot konsultasi bisnis dan analisis finansial otomatis.

---

## 4. Cara Instalasi (Setup Project)

Ikuti panduan langkah-langkah di bawah ini untuk mengonfigurasi dan menjalankan proyek REKA di lingkungan lokal Anda:

### Prasyarat Sistem
- **Node.js**: Versi `18.18.0` atau yang lebih baru (disarankan LTS).
- **NPM** atau **PNPM** atau **Yarn** sebagai package manager.
- Akun **Supabase** (untuk database PostgreSQL gratis).
- API Key **Google Gemini** (dapat diperoleh gratis di [Google AI Studio](https://aistudio.google.com/apikey)).

---

### Langkah-Langkah Instalasi

#### 1. Clone Repositori
```bash
git clone https://github.com/bintanghawley/REKA.git
cd REKA
```

#### 2. Install Dependensi
```bash
npm install
```

#### 3. Konfigurasi Environment Variables
Salin file template `.env.example` menjadi file `.env`:

*Di Windows (Command Prompt / PowerShell):*
```powershell
copy .env.example .env
```
*Di Linux / macOS:*
```bash
cp .env.example .env
```

Buka file `.env` dan lengkapi nilai variabel lingkungan berikut:
```env
# 1. DATABASE (Supabase PostgreSQL via Prisma)
# Mode "Transaction" (Port 6543) dengan pgbouncer:
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Mode "Session" / Direct (Port 5432) untuk migrasi Prisma:
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# 2. AUTH.JS v5
# Secret minimal 32 karakter (dapat digenerate via 'openssl rand -base64 32'):
AUTH_SECRET="masukkan_random_secret_string_32_karakter_minimal"
AUTH_TRUST_HOST=true
NEXTAUTH_URL="http://localhost:3000"

# 3. GOOGLE GEMINI AI
# Dapatkan API Key gratis di https://aistudio.google.com/apikey
GEMINI_API_KEY="masukkan_api_key_google_gemini_anda"
```

#### 4. Sinkronisasi Skema Database ke Supabase
Jalankan sinkronisasi skema Prisma ke database PostgreSQL:
```bash
npm run db:push
```
*Atau generate Prisma Client:*
```bash
npm run db:generate
```

---

## 5. Cara Penggunaan & Snippet Perintah

###  Snippet Menjalankan Aplikasi

#### Mode Development (Lokal)
Untuk menjalankan server pengembangan lokal:
```bash
npm run dev
```
Buka browser dan akses aplikasi di: **`http://localhost:3000`**

#### Mode Production Build & Start
Untuk melakukan kompilasi build produksi dan memvalidasi tipe data secara menyeluruh:
```bash
# 1. Build aplikasi
npm run build

# 2. Jalankan aplikasi hasil build
npm run start
```

#### Membuka GUI Manajemen Database (Prisma Studio)
Untuk melihat dan mengelola data tabel secara visual melalui browser:
```bash
npm run db:studio
```

---

### Panduan Alur Penggunaan Pengguna

1. **Registrasi & Login Akun**:
   - Buka `/register` untuk membuat akun baru usaha Anda.
   - Masuk menggunakan email dan password di halaman `/login`.
2. **Lengkapi Profil Usaha**:
   - Atur nama usaha dan kategori bisnis di menu **Profil Usaha** (`/profil`).
3. **Tambahkan Master Data Produk**:
   - Masuk ke menu **Produk** (`/produk`), klik **Tambah Produk**.
   - Masukkan Nama Produk, Kategori, Harga Pokok Penjualan (HPP), dan Harga Jual.
4. **Mulai Mencatat Penjualan (Kasir Kilat)**:
   - Masuk ke menu **Kasir / Transaksi** (`/transaksi`).
   - Ketuk menu produk yang dipesan pembeli, atur jumlah pesanan, lalu klik **Simpan Transaksi**.
5. **Catat Pengeluaran Operasional**:
   - Masuk ke menu **Pengeluaran** (`/pengeluaran`) untuk mencatat belanja bahan dadakan atau operasional harian.
6. **Pantau Dashboard & Konsultasi AI**:
   - Buka **Dashboard** (`/dashboard`) untuk melihat grafik omzet, laba kotor, dan laba bersih hari ini.
   - Gunakan fitur **Chat AI / Smart Insight** untuk meminta rekomendasi efisiensi bisnis.

---

## Tautan Karya

- **Tautan Repositori GitHub**: `https://github.com/bintanghawley/REKA.git`
- **Tautan Hasil Karya Live (Hosted)**: `https://reka-umkm.vercel.app`