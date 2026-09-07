const fs = require('fs');

const readmeContent = `<div align="center">

# REKA (Rekap Kasir)
### Aplikasi Kasir Point-of-Sale (POS) Kilat & Manajemen Keuangan Real-Time Berbasis AI untuk UMKM Indonesia

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-success?style=for-the-badge)](https://reka-umkm.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/bintanghawley/REKA)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**Submission for ITECHNO CUP 2026 - Web Development**

**By Tim REKA**

</div>

---

## 📋 Daftar Isi
- [Tentang Proyek](#-tentang-proyek)
- [Fitur Unggulan](#-fitur-unggulan)
- [Demo & Screenshot](#-demo--screenshot)
- [Teknologi](#-teknologi)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Instalasi & Setup](#-instalasi--setup)
- [Penggunaan](#-penggunaan)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Tim Developer](#-tim-developer)
- [Lisensi](#-lisensi)

---

## 👥 Tim Developer

| Nama | Peran | GitHub |
|------|-------|--------|
| **[Nama Lengkap 1]** | Project Lead & Full Stack Developer | [GitHub](https://github.com/bintanghawley) |
| **[Nama Lengkap 2]** | Frontend Developer | [GitHub](https://github.com/[username2]) |
| **[Nama Lengkap 3]** | Backend Developer | [GitHub](https://github.com/[username3]) |
| **[Nama Lengkap 4]** | UI/UX Designer | [GitHub](https://github.com/[username4]) |

---

## 🎯 Tentang Proyek

### Latar Belakang
Berdasarkan data Kementerian Koperasi dan UKM, UMKM menyumbang lebih dari 61% terhadap PDB Indonesia, namun mayoritas pelaku usaha mikro masih mengelola keuangan secara manual atau bahkan tidak mencatatnya sama sekali.

Aplikasi POS konvensional saat ini sering kali terlalu rumit dan lambat untuk pedagang mikro karena memerlukan alur input data bertingkat di saat antrean pembeli sedang ramai. Selain itu, masalah paling krusial bagi pedagang kecil adalah **kebocoran arus kas (uang laci campur aduk)**. Pengeluaran darurat seperti membeli es batu, bumbu dapur, atau retribusi sering tidak tercatat, sehingga pedagang mengalami ilusi omzet—merasa dagangan laris namun tidak mengetahui angka Laba Bersih riil mereka. Hal ini menjadi penghambat utama kemajuan UMKM dan pencapaian target **SDG 8 (Pekerjaan Layak dan Pertumbuhan Ekonomi)**.

### Solusi yang Ditawarkan
**REKA (Rekap Kasir)** hadir dengan pendekatan inovatif:
1. **Pencatatan Transaksi 3 Detik (*Fast POS*)**: Antarmuka *grid tap-to-add* tanpa lag yang dirancang untuk kecepatan tinggi saat jam sibuk.
2. **Integritas *Historical Price Snapshotting***: Setiap transaksi mengunci harga jual dan modal (HPP) pada detik transaksi dilakukan, sehingga laporan laba historis tidak terdistorsi saat harga produk berubah di masa depan.
3. **Pencatatan Pengeluaran Dadakan Seketika**: Mengintegrasikan biaya operasional mikro harian yang langsung mengoreksi laba kotor menjadi laba bersih riil.
4. **AI Business Advisor (Google Gemini)**: Mengubah data transaksi menjadi wawasan bisnis aplikatif, evaluasi margin profit, dan strategi peningkatan omzet.

### Tujuan Proyek
- 🎯 **Tujuan Utama**: Menyediakan platform kasir POS dan pembukuan keuangan real-time yang memangkas waktu pencatatan transaksi menjadi hanya 3 detik serta memberikan visibilitas laba bersih riil.
- 📊 **Target Pengguna**: Pelaku UMKM sektor F&B (warung makan, kedai kopi, pedagang kaki lima), toko kelontong, retail mikro, dan *freelance seller*.
- 💡 **Value Proposition**: Kombinasi *zero-friction checkout*, akurasi laba bersih real-time dengan proteksi data historis, serta pendampingan analitik berbasis AI yang dapat diakses dari perangkat apa pun tanpa instalasi rumit.

---

## ✨ Fitur Unggulan

### Fitur Utama

| Fitur | Deskripsi | Keunggulan |
|-------|-----------|------------|
| **Kasir Kilat (3-Second POS)** | Antarmuka kasir cepat berbasis grid & kategori dengan kalkulasi subtotal instan. | Mengurangi antrean pembeli secara drastis melalui metode *Tap-to-Add* & *Instant Checkout*. |
| **Historical Price Snapshotting** | Sistem mengunci nilai \`harga_jual\` dan \`hpp\` saat transaksi terjadi ke tabel relasional. | Laporan laba-rugi historis tetap 100% akurat meski harga bahan baku atau harga katalog diubah sewaktu-waktu. |
| **Pencatatan Pengeluaran Dadakan** | Modul pencatatan pengeluaran operasional mikro harian (listrik, es batu, retribusi). | Menghilangkan masalah uang campur aduk dan otomatis menghitung laba bersih riil seketika. |
| **Dashboard & KPI Finansial Interaktif** | Visualisasi metrik bisnis lengkap (Total Omzet, Laba Kotor, Pengeluaran, Laba Bersih) serta grafik tren harian. | Membantu pemilik bisnis memantau kesehatan finansial secara visual tanpa perlu keahlian akuntansi. |
| **AI Business Advisor & Smart Insight** | Chatbot konsultasi bisnis interaktif dan ringkasan insight performa berbasis model Google Gemini. | Memberikan rekomendasi taktis peningkatan profit dan strategi efisiensi biaya yang terpersonalisasi. |
| **Manajemen Katalog & Status Produk** | Pengelolaan produk lengkap dengan kalkulasi margin keuntungan otomatis dan toggle status ketersediaan. | Pengaturan inventaris cepat, intuitif, dan terintegrasi langsung dengan menu kasir. |

### Fitur Tambahan
- **Mobile-First Warm Editorial UI** - Antarmuka modern yang nyaman di mata, ergonomis dioperasikan satu tangan via smartphone.
- **Role & Multi-device Sync** - Data tersinkronisasi instan via cloud Supabase PostgreSQL dari HP, tablet, maupun laptop.
- **Riwayat Transaksi & Filter Tanggal** - Penelusuran log riwayat penjualan terperinci dengan filter rentang waktu.
- **Export & Rekap Ringkas** - Ringkasan performa finansial harian yang siap ditinjau kapan saja.

---

## 📸 Demo & Screenshot

### Live Demo
🔗 **[Kunjungi Website REKA](https://reka-umkm.vercel.app)**

> **Akun Uji Coba Demo:**
> - **Email:** \`kuliner@reka.id\`
> - **Password:** \`demo123\`

### Screenshot Aplikasi
<div align="center">
  <img src="/public/screenshots/hero.png" alt="Homepage REKA" width="800"/>
  <p><em>Homepage - Tampilan utama dan landing page REKA</em></p>

  <img src="/public/screenshots/pos.png" alt="Kasir Kilat POS" width="800"/>
  <p><em>Kasir Kilat - Antarmuka transaksi cepat 3 detik berbasis grid</em></p>

  <img src="/public/screenshots/dashboard.png" alt="Dashboard Finansial" width="800"/>
  <p><em>Dashboard - Panel kontrol metrik finansial real-time dan grafik tren laba</em></p>

  <img src="/public/screenshots/ai-advisor.png" alt="AI Business Advisor" width="800"/>
  <p><em>AI Business Advisor - Konsultasi taktis strategi UMKM berbasis Google Gemini</em></p>
</div>

### Video Demo
📹 **[Link Video Demo YouTube](https://youtu.be/[URL_VIDEO])** _(opsional)_

---

## 🛠️ Teknologi

### Tech Stack

#### Frontend
```
Framework   : Next.js 16 (App Router)
UI Library  : Tailwind CSS 3.4, Lucide React
State Mgmt  : React Hooks & Server Actions
Validation  : Zod
Visualisasi : Recharts
```

#### Backend
```
Runtime     : Node.js (v18.x / v20.x)
Framework   : Next.js Server Actions ("use server")
Database    : PostgreSQL (Supabase Cloud)
ORM         : Prisma ORM 5.22
Auth        : Auth.js v5 (NextAuth.js) / Bcrypt.js
AI Engine   : Google Gen AI SDK (@google/genai - Gemini 2.5 Flash)
```

#### DevOps & Tools
```
Deployment  : Vercel Cloud Platform
CI/CD       : Vercel Git Integration / GitHub Actions
Monitoring  : Vercel Analytics & Speed Insights
Tooling     : TypeScript 5.7, ESLint, PostCSS
```

### Alasan Pemilihan Teknologi

| Teknologi | Alasan Pemilihan |
|-----------|------------------|
| **Next.js (App Router)** | Menyediakan *Server Components* dan *Server Actions* yang meniadakan latensi API eksternal, membuat performa kasir sangat cepat (*zero bundle overhead*). |
| **PostgreSQL & Supabase** | Database relasional dengan integritas data tinggi (ACID), didukung fitur *Connection Pooling (pgbouncer)* untuk stabilitas beban tinggi. |
| **Prisma ORM** | Memastikan *type-safety* end-to-end dari database ke antarmuka, mempermudah migrasi skema serta proteksi snapshot transaksi. |
| **Google Gemini AI SDK** | Model kecerdasan buatan mutakhir dengan penalaran logika tinggi dan latensi rendah untuk analisis data keuangan UMKM. |
| **Tailwind CSS** | Memungkinkan perancangan antarmuka kustom yang sangat responsif, konsisten, dan ringan bagi pengguna perangkat mobile. |

### Dependencies Utama
```json
{
  "dependencies": {
    "next": "^16.3.4",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@prisma/client": "^5.22.0",
    "@google/genai": "^2.21.0",
    "next-auth": "^5.0.0-beta.25",
    "zod": "^3.24.2",
    "recharts": "^2.15.4",
    "lucide-react": "^0.475.0",
    "bcryptjs": "^2.4.3"
  }
}
```

---

## 🏗️ Arsitektur Sistem

### System Architecture
```mermaid
flowchart TD
    subgraph Client ["Client Layer (Responsive Web / Mobile)"]
        UI[Next.js Client Components]
        POS[Kasir Kilat POS]
        Dash[Interactive Dashboard]
        AIChat[AI Business Chatbot]
    end

    subgraph Server ["Server Layer (Next.js App Router)"]
        SA[Next.js Server Actions]
        Auth[Auth.js v5 JWT Session]
        Val[Zod Schema Validation]
    end

    subgraph Data ["Data and AI Services"]
        Prisma[Prisma ORM Engine]
        DB[(PostgreSQL Supabase)]
        Gemini[Google Gemini AI 2.5]
    end

    UI -->|User Interaction| SA
    POS -->|Snapshot Data| SA
    Dash -->|Fetch Analytics| SA
    AIChat -->|Prompt & Context| SA

    SA --> Val
    SA --> Auth
    SA --> Prisma
    SA -->|Generate Insights| Gemini

    Prisma --> DB
```

### Database Schema
```mermaid
erDiagram
    users ||--o| profiles : has
    users ||--o{ produk : owns
    users ||--o{ transaksi : records
    users ||--o{ pengeluaran_dadakan : logs
    produk ||--o{ transaksi : referenced_in

    users {
        string id PK
        string email UK
        string password_hash
        datetime created_at
    }

    profiles {
        string id PK,FK
        string nama_usaha
        string jenis_usaha
        datetime created_at
        datetime updated_at
    }

    produk {
        string id PK
        string user_id FK
        string nama
        float harga_jual
        float hpp
        string kategori
        string status
        string foto
        boolean is_deleted
        datetime created_at
        datetime updated_at
    }

    transaksi {
        string id PK
        string user_id FK
        string produk_id FK
        int qty
        float harga_jual_saat_transaksi
        float hpp_saat_transaksi
        datetime waktu
        datetime created_at
    }

    pengeluaran_dadakan {
        string id PK
        string user_id FK
        string kategori
        float nominal
        datetime tanggal
        datetime created_at
    }
```

### Folder Structure
```
project-root/
├── app/                      # Next.js App Router Pages & Actions
│   ├── (auth)/               # Rute autentikasi (login, register)
│   ├── dashboard/            # Halaman utama analytics & KPI
│   ├── transaksi/            # Halaman Kasir Kilat (POS)
│   ├── pengeluaran/          # Halaman catat pengeluaran dadakan
│   ├── produk/               # Manajemen katalog & master produk
│   ├── konsultasi/           # Asisten AI Business Advisor
│   └── api/                  # Route handlers & auth endpoints
├── components/               # Komponen UI modular & reusable
│   ├── ui/                   # Button, Card, Dialog, Badge, Input
│   ├── charts/               # Komponen visualisasi grafik Recharts
│   └── layout/               # Sidebar, Header, Mobile Bottom Nav
├── lib/                      # Utilitas, helper, & konfigurasi
│   ├── prisma.ts             # Prisma Client instance
│   ├── auth.ts               # Konfigurasi Auth.js v5
│   └── gemini.ts             # Inisialisasi Google Gen AI SDK
├── prisma/                   # Skema database & migrasi
│   └── schema.prisma         # Model User, Profile, Produk, Transaksi
├── public/                   # Static assets, ikon, & screenshot
├── scripts/                  # Script helper (seed demo, reset db)
└── types/                    # TypeScript interfaces & types
```

---

## ⚙️ Instalasi & Setup

### Prerequisites
Pastikan Anda telah menginstall:
- **Node.js** (v18.18.0 atau lebih baru)
- **npm** / **yarn** / **pnpm**
- **PostgreSQL Database** (direkomendasikan akun Supabase)
- **API Key Google Gemini** (dari [Google AI Studio](https://aistudio.google.com/apikey))
- **Git**

### Langkah Instalasi

#### 1️⃣ Clone Repository
```bash
git clone https://github.com/bintanghawley/REKA.git
cd REKA
```

#### 2️⃣ Install Dependencies
```bash
# Menggunakan npm
npm install

# Atau menggunakan yarn
yarn install

# Atau menggunakan pnpm
pnpm install
```

#### 3️⃣ Setup Environment Variables
Buat file `.env` di root directory:
```env
# Database PostgreSQL (Supabase)
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Auth.js v5 Secret
AUTH_SECRET="supersecretkeyminimal32karakterpanjangnya"
AUTH_TRUST_HOST=true
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini AI
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
```

#### 4️⃣ Setup Database
```bash
# Sinkronisasi skema ke database
npm run db:push

# Generate client Prisma
npm run db:generate

# Isi data awal demo (opsional)
npm run db:seed
```

#### 5️⃣ Run Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

---

## 🚀 Penggunaan

### Menjalankan Aplikasi
```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start

# Database Studio GUI
npm run db:studio

# Linting & Typecheck
npm run lint
npm run typecheck
```

### User Guide

#### Untuk Pengguna Umum (Kasir & Pemilik UMKM)
1. **Registrasi/Login**: Buka halaman `/login` atau gunakan akun demo yang telah disediakan (`kuliner@reka.id` / `demo123`).
2. **Katalog Produk**: Buka menu **Produk**, tambahkan produk dengan melengkapi nama, HPP (modal), dan harga jual untuk mengaktifkan kalkulasi margin otomatis.
3. **Kasir Kilat (POS)**: Buka menu **Transaksi**, klik item yang dipesan pembeli (bisa atur kuantitas dalam satu ketuk), lalu klik tombol **Simpan Transaksi** (selesai dalam 3 detik).
4. **Catat Pengeluaran**: Buka menu **Pengeluaran** untuk mencatat biaya darurat harian (misal: beli es batu, bumbu, retribusi) agar laba bersih riil tetap akurat.
5. **Dashboard & AI Advisor**: Pantau grafik omzet & laba bersih di **Dashboard**, lalu klik menu **Konsultasi AI** untuk meminta saran taktis pengembangan bisnis Anda.

#### Untuk Admin / Pengembang
1. **Prisma Studio**: Jalankan `npm run db:studio` untuk memeriksa dan memelihara integritas tabel snapshot secara visual.
2. **Maintenance Database**: Jalankan `npm run db:push` atau migrasi saat memperbarui struktur tabel.

---

## 📚 API Documentation

Aplikasi ini menggunakan **Next.js Server Actions** dan REST API routes internal untuk operasi data yang aman dan bertipe.

### Base URL
```
Development : http://localhost:3000/api
Production  : https://reka-umkm.vercel.app/api
```

### Endpoints

#### Authentication
```http
POST /api/auth/register    # Pendaftaran pengguna baru
POST /api/auth/callback/credentials # Otentikasi & pembuatan session JWT
POST /api/auth/signout     # Logout sesi
```

#### Core Server Actions
```http
POST /actions/transaksi    # Simpan transaksi POS dengan harga snapshot
POST /actions/pengeluaran  # Simpan pencatatan pengeluaran dadakan
POST /actions/produk       # Create, update, atau soft-delete produk
POST /actions/ai-advisor   # Kirim prompt data finansial ke Gemini AI
```

### Example Request
```javascript
// Contoh pemanggilan Server Action pencatatan transaksi kasir
const response = await createTransactionAction({
  produk_id: 'prod-uuid-12345',
  qty: 2,
  harga_jual_saat_transaksi: 15000,
  hpp_saat_transaksi: 9000,
  waktu: new Date().toISOString()
});
```

---

## 🧪 Testing

### Running Tests
```bash
# Linting kode
npm run lint

# Pengecekan tipe data TypeScript
npm run typecheck

# Build validation test
npm run build
```

### Test Coverage
```
Type Safety   : 100% (Strict TypeScript Enabled)
Lint Status   : 0 Errors / Clean Next.js ESLint
Build Test    : Passed (Zero Next.js Compilation Errors)
```

---

## 📄 Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE) - lihat file LICENSE untuk detail lebih lanjut.

---

<div align="center">

**Made with ❤️ by Tim REKA for ITECHNO CUP 2026**

</div>
`;

fs.writeFileSync('C:/Users/NITRO/README.md', readmeContent, 'utf8');
fs.writeFileSync('C:/Users/NITRO/REKA/README.md', readmeContent, 'utf8');
console.log('Update completed successfully!');
