# 🏪 REKA (Rekap Kasir Kilat & AI Laba Rugi UMKM)

> **Platform Kasir Point-of-Sale (POS) Kilat 3-Detik dan Manajemen Finansial Real-Time Berbasis AI untuk Pemberdayaan UMKM Indonesia.**

[![Next.js](https://img.shields.io/badge/Next.js-16%2B_(App_Router)-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-black?style=flat-square&logo=auth0)](https://authjs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_Business_Advisor-8E75B2?style=flat-square&logo=google)](https://aistudio.google.com/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel_Ready-success?style=flat-square&logo=vercel)](https://vercel.com/)

---

## 🎯 Akun Demo Siap Pakai (Untuk Penilaian Juri & Evaluator)

Dewan juri dan penguji dapat langsung masuk menggunakan akun demo yang telah terisi data transaksi riil 7 hari terakhir, katalog produk, dan laporan keuangan sesuai sektor usaha masing-masing:

| Sektor UMKM | Email Akun Demo | Kata Sandi | Profil Usaha | Skenario Penilaian Juri |
| :--- | :--- | :--- | :--- | :--- |
| **🍔 Kuliner & Makanan Basah** | `kuliner@reka.id` | `demo123` | **Warung Makan Mbak Sri** | Uji jam sibuk makan siang/malam, efisiensi bahan mentah, dan strategi paket kombo menu hemat. |
| **☕ Coffee Shop & Cafe** | `kopi@reka.id` | `demo123` | **Kopi Titik Temu** | Uji margin keuntungan tinggi (60%+), analisis jam nongkrong sore/malam, dan rekomendasi bundling kopi + pastry. |
| **🛒 Toko Sembako & Kelontong** | `sembako@reka.id` | `demo123` | **Toko Sembako Barokah** | Uji perputaran cepat margin tipis (10–15%), transaksi belanja harian, dan kontrol laba kotor vs operasional. |
| **👕 Fashion & Distro Apparel** | `fashion@reka.id` | `demo123` | **Reka Threads & Apparel** | Uji transaksi nominal tinggi (Rp 100k–300k+), margin tebal ritel kreatif, dan rekap pengeluaran kemasan/stiker. |
| **🧪 QA Master Sandbox** | `qa@warungberkah.com` | `password123` | **Warung Berkah QA** | Akun sandbox bebas untuk mencoba tambah/edit/hapus produk, transaksi kasir, dan pengeluaran. |

> *Catatan: Anda juga dapat mendaftarkan akun baru secara instan kapan saja melalui menu `/register`.*

---

## 📌 1. Latar Belakang & Pernyataan Masalah

### Realitas UMKM di Indonesia
Sektor Usaha Mikro, Kecil, dan Menengah (UMKM) menyumbang lebih dari **61% terhadap PDB Indonesia** dan menyerap **97% tenaga kerja nasional**. Namun, mayoritas pelaku usaha mikro (warung makan, kedai kopi kecil, toko kelontong, kios pakaian) menghadapi tantangan operasional mendasar:

1. **Kasir Terlalu Rumit (*Friction-Heavy POS*):**
   Aplikasi kasir konvensional mewajibkan kasir memasukkan input yang berlapis-lapis (pencarian SKU rumit, manajemen stok opname gudang yang membingungkan) di saat antrean pembeli sedang memuncak. Akibatnya, pedagang memilih kembali ke buku kertas atau bahkan tidak mencatat sama sekali.
2. **Kebocoran Arus Kas (*Cash Leakage*):**
   Uang hasil penjualan di laci kasir kerap terpakai spontan untuk pengeluaran darurat harian (beli gas elpiji, es batu, kantong plastik, atau bayar retribusi) tanpa pembukuan. Pedagang merasa omzetnya tinggi, tetapi tidak tahu mengapa uang tunai di akhir bulan habis.
3. **Data Mati (*Passive Data Problem*):**
   Kalaupun transaksi tercatat, angka-angka tersebut hanya menjadi arsip pasif. Pedagang kecil tidak memiliki analis keuangan pribadi untuk memberi tahu produk mana yang paling menguntungkan atau kapan jam paling tepat menyiapkan porsi jualan.

### Tujuan & Solusi: REKA
**REKA (Rekap Kasir)** dirancang dari nol dengan filosofi **"Anti-Ribet, Akses Cepat, dan Edukatif"** khusus bagi UMKM menengah ke bawah:
- **3-Second Checkout:** Proses kasir secepat kilat (cukup ketuk produk & hitung kembalian instan) tanpa beban manajemen stok inventaris gudang yang rumit.
- **Pencatatan Pengeluaran Dadakan Terpadu:** Pengeluaran tak terduga dicatat dalam 5 detik dan langsung memotong laba kotor menjadi Laba Bersih riil secara otomatis.
- **Historical Price Snapshotting:** Mengunci modal HPP dan harga jual riil pada detik transaksi terjadi, menjamin laporan keuangan masa lalu tidak berubah saat harga beli masa depan naik.
- **AI Business Advisor (Didukung Gemini AI):** Asisten virtual yang menganalisis tren 7 hari penjualan pedagang dan memberikan instruksi taktis bisnis yang aplikatif.

---

## 🌍 2. Keselarasan Target SDG (Sustainable Development Goals)

Inovasi **REKA** secara langsung mendukung pencapaian target global PBB:

```
┌─────────────────────────────────────────────────────────┐
│  SDG 8: DECENT WORK AND ECONOMIC GROWTH                 │
│  Target 8.3: Mendorong formalisasi & pertumbuhan        │
│  UMKM melalui adopsi pembukuan finansial digital.       │
├─────────────────────────────────────────────────────────┤
│  SDG 9: INDUSTRY, INNOVATION, AND INFRASTRUCTURE        │
│  Target 9.b: Mendemokratisasi pemanfaatan kecerdasan    │
│  buatan (Gen-AI) bagi pedagang akar rumput Indonesia.   │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ 3. Fitur Unggulan & Nilai Kebaruan

| Fitur Inovatif | Deskripsi & Nilai Tambah bagi Pedagang |
| :--- | :--- |
| **⚡ Kasir Kilat (3-Second POS)** | Antarmuka kasir berbasis grid sentuh dengan kategori dinamis. Mendukung hitung kembalian cepat uang pas, tombol nominal uang instan (Rp 10k, 20k, 50k, 100k), dan validasi keranjang. |
| **🔒 Historical Price Snapshotting** | Setiap transaksi mengabadikan snapshot `harga_jual_saat_transaksi` dan `hpp_saat_transaksi`. Laporan margin laba historis toko dijamin 100% akurat dan kebal dari perubahan harga master barang di kemudian hari. |
| **💸 Pengeluaran Dadakan Terintegrasi** | Form pencatatan belanja harian mikro dengan kategori cepat (Bahan Baku, Operasional, Kemasan, Gas/Listrik). Laba bersih otomatis terkoreksi seketika tanpa perlu hitung manual di kalkulator. |
| **📊 Dashboard KPI Finansial Interaktif** | Ringkasan 4 pilar kunci usaha: Total Omzet, Total Modal HPP, Total Pengeluaran, dan Laba Bersih Riil. Dilengkapi grafik visualisasi tren harian menggunakan Recharts. |
| **🧠 AI Smart Business Advisor** | Kartu *AI Smart Insight* yang otomatis membedah 4 aspek: **Waktu Transaksi (Pola Jam Sibuk)**, **Pola Omzet**, **Menu Terlaris & Paket Bundling**, serta **Kesehatan Margin & Biaya Operasional**. |
| **💬 REKA Assistant Chatbot** | Asisten virtual berbasis Google Gemini dengan *Strict Business Guardrail* dan dukungan format teks Markdown yang rapi (bold, italic, list) untuk konsultasi pengembangan usaha. |
| **🛡️ Modal Konfirmasi Keamanan (Safe Actions)** | Dialog pop-up konfirmasi modern pada tindakan penting dan destruktif (Logout, Hapus Catatan Pengeluaran, Kosongkan Keranjang Kasir, dan Tambah Produk Baru). |
| **🚪 Secure Logout & Landing Redirect** | Pengakhiran sesi autentikasi yang aman dengan pembersihan sesi Auth.js dan pengalihan langsung ke Landing Page publik (`/`). |

---

## 🏗️ 4. Arsitektur Sistem & Alur Data

Aplikasi REKA mengusung arsitektur modern berbasis **Next.js 16 App Router** dengan **Server Actions** dan koneksi database awan berkecepatan tinggi:

```mermaid
graph TD
    User["Pelaku UMKM / Kasir"] -->|Interaksi Web Responsif| NextClient["Frontend Next.js 16 App Router (Client Components)"]
    
    subgraph "Next.js Security & Serverless Layer"
        NextClient -->|Sesi JWT & Middleware| Auth["Auth.js v5 (NextAuth)"]
        NextClient -->|Mutasi Data Atomik| ServerActions["Next.js Server Actions ('use server')"]
        NextClient -->|Tanya Jawab AI| ChatAPI["Route Handler /api/chat"]
    end
    
    subgraph "Cloud Database & ORM"
        ServerActions -->|Type-Safe Query| Prisma["Prisma ORM 5.22"]
        Prisma -->|Port 6543 (PgBouncer Pooler)| Supabase["Supabase PostgreSQL Cloud"]
    end

    subgraph "AI Intelligence Engine"
        ChatAPI -->|Prompting Contextual System| Gemini["Google Gemini AI (gemini-3.5-flash-lite)"]
        ServerActions -->|Analisis Data 7 Hari Riil| Gemini
        Gemini -->|Rekomendasi Taktis Bisnis| NextClient
    end
```

---

## 🛠️ 5. Teknologi yang Digunakan

### **Frontend & Antarmuka**
- **Next.js 16 (App Router)**: Framework React berkinerja tinggi dengan arsitektur *React Server Components* dan *Server Actions*.
- **React 18**: Pustaka inti komponen antarmuka yang reaktif dan modular.
- **TypeScript 5.7**: Penjaminan kualitas kode dengan pengetikan statis ketat (*type-safety* 100%).
- **Tailwind CSS 3.4**: Framework desain utilitas dengan sistem warna hangat *Warm Paper & Editorial Palette*.
- **Lucide React**: Ikon antarmuka modern, tajam, dan ringan.
- **Recharts 2.15**: Pustaka visualisasi grafik finansial interaktif.

### **Backend, Database, & Keamanan**
- **PostgreSQL via Supabase**: Basis data relasional berdaya tahan tinggi di cloud dengan koneksi pooler PgBouncer.
- **Prisma ORM 5.22**: ORM bertipe aman untuk migrasi skema database relasional.
- **Auth.js v5 (NextAuth Beta 25)**: Sistem otentikasi JWT terproteksi dengan integrasi middleware.
- **Bcrypt.js**: Enkripsi password searah menggunakan 12 salt rounds.
- **Zod**: Validasi data form input dan skema payload backend.

### **Kecerdasan Buatan (AI Engine)**
- **Google Gen AI SDK (`@google/genai`)**: Integrasi model bahasa besar (LLM) **Google Gemini 3.5 Flash-Lite** untuk analisis bisnis kilat dan asisten chatbot virtual.

---

## 💻 6. Panduan Instalasi Lokal (Local Setup)

### Prasyarat
- **Node.js**: Versi `18.18.0` atau yang lebih baru (disarankan Node.js 20+ LTS).
- **NPM** atau package manager pilihan Anda.
- Akun **Supabase** (Database PostgreSQL gratis).
- API Key **Google Gemini** (gratis di [Google AI Studio](https://aistudio.google.com/apikey)).

### Langkah Instalasi

1. **Clone Repositori:**
   ```bash
   git clone https://github.com/bintanghawley/REKA.git
   cd REKA
   ```

2. **Install Dependensi:**
   ```bash
   npm install
   ```
   *(File `.npmrc` dengan `legacy-peer-deps=true` sudah tersedia sehingga instalasi dijamin lancar).*

3. **Konfigurasi Environment Variables:**
   Salin file `.env.example` menjadi `.env`:
   ```bash
   # Windows (PowerShell):
   copy .env.example .env

   # macOS / Linux:
   cp .env.example .env
   ```
   Lalu lengkapi nilai kredensial di file `.env`.

4. **Sinkronisasi Skema Database & Seeding Akun Demo:**
   ```bash
   # Push schema ke Supabase
   npm run db:push

   # Seed akun demo lengkap (Kuliner, Kopi, Sembako, Fashion)
   npm run db:seed
   ```

5. **Jalankan Server Development:**
   ```bash
   npm run dev
   ```
   Buka peramban di: **`http://localhost:3000`**

---

## 🚀 7. Panduan Deployment ke Vercel (Production)

Proyek ini telah dikonfigurasi secara optimal untuk deployment instan di platform **Vercel**:

### 1. Hubungkan Repositori ke Vercel
1. Masuk ke [vercel.com](https://vercel.com) dan klik **Add New Project**.
2. Pilih repositori **`bintanghawley/REKA`**.
3. Framework Preset akan otomatis terdeteksi sebagai **Next.js**.

### 2. Isi Environment Variables di Vercel
Pada bagian **Environment Variables**, tambahkan 6 variabel berikut:

| Key | Contoh Nilai |
| :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres` |
| `AUTH_SECRET` | `string_acak_rahasia_minimal_32_karakter` |
| `AUTH_TRUST_HOST` | `true` |
| `NEXTAUTH_URL` | `https://[nama-aplikasi-anda].vercel.app` |
| `GEMINI_API_KEY` | `API_KEY_DARI_GOOGLE_AI_STUDIO` |

### 3. Deploy
Klik **Deploy**. Script `postinstall` di `package.json` akan otomatis men-generate Prisma Client dan menghasilkan build produksi dalam waktu kurang dari 1 menit!

---

## 📋 8. Struktur Direktori Proyek

```
REKA/
├── app/
│   ├── (auth)/             # Halaman autentikasi publik (/login & /register)
│   ├── (protected)/        # Route terproteksi khusus pengguna terautentikasi
│   │   ├── dashboard/      # KPI finansial, grafik tren, dan AI Smart Insight
│   │   ├── produk/         # Katalog produk, modal HPP, dan tambah produk
│   │   ├── transaksi/      # Kasir POS kilat (3-second tap to cart)
│   │   ├── pengeluaran/    # Pencatatan biaya operasional mikro harian
│   │   ├── riwayat/        # Log riwayat penjualan & rekap berkala
│   │   ├── profil/         # Identitas usaha pedagang
│   │   └── layout.tsx      # Sidebar statis, Mobile bar, & Chatbot FAB
│   ├── api/                # API handler (Auth.js & Chatbot Gemini)
│   ├── globals.css         # Styling global Tailwind & variabel token warna
│   └── page.tsx            # Landing Page publik interaktif
├── components/             # Komponen UI modular (Chatbot, Modal Konfirmasi, AI Card)
├── lib/
│   ├── actions/            # Server Actions mutasi data (Auth, Produk, Transaksi, AI)
│   ├── auth/               # Validasi sesi dan helper otentikasi
│   ├── prisma.ts           # Instance Prisma Client singleton
│   └── utils.ts            # Helper format mata uang Rupiah dan tanggal
├── prisma/
│   └── schema.prisma       # Skema database relasional PostgreSQL
├── scripts/
│   ├── seed-demo-accounts.mjs # Skrip seeding otomatis akun demo UMKM
│   └── reset-dev.ps1       # Skrip pembersihan cache server development
├── types/                  # Definisi TypeScript data transfer object
├── .env.example            # Template variabel lingkungan
└── README.md               # Dokumentasi resmi & proposal karya
```

---

## 🏆 9. Roadmap Pengembangan Masa Depan

- [x] **Fase 1:** Kasir POS kilat 3-detik, kalkulasi laba rugi instan, dan Historical Price Snapshotting.
- [x] **Fase 2:** Pencatatan biaya operasional mikro dadakan terintegrasi.
- [x] **Fase 3:** AI Business Advisor (Gemini) untuk pola jam sibuk dan kartu Smart Insight.
- [x] **Fase 4:** Sistem modal konfirmasi aksi kritis dan akun demo lintas sektor UMKM.
- [ ] **Fase 5 (Mendatang):** Integrasi pembayaran non-tunai statis **QRIS Nasional** sekali pindai.
- [ ] **Fase 6 (Mendatang):** Ekspor laporan keuangan berkala ke format spreadsheet Excel/PDF berstandar SAK EMKM.
- [ ] **Fase 7 (Mendatang):** Dukungan cetak struk fisik langsung ke printer thermal Bluetooth via Web Bluetooth API.

---

## 👥 10. Tautan Karya & Pengembang

- **Repositori GitHub**: [github.com/bintanghawley/REKA](https://github.com/bintanghawley/REKA)
- **Aplikasi Siap Diakses (Live)**: `https://[nama-aplikasi-anda].vercel.app`
- **Lisensi**: MIT License — Terbuka untuk kemajuan ekosistem UMKM Indonesia.
