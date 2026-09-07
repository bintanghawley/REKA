<div align="center">

? REKA (Rekap Kasir)
### Aplikasi Kasir Point-of-Sale (POS) Kilat & Manajemen Keuangan Real-Time Berbasis AI untuk UMKM Indonesia

[![Live Demo](https://reka-umkm.vercel.app)]
[!GitHub](https://github.com/bintanghawley/REKA)

**Submission for ITECHNO CUP 2026 - Web Development**

**By Tim REKA**
</div>

---

## 📋 Daftar Isi
- [Tentang Proyek]#-tentang-proyek)
- [Fitur Unggulan]#-fitur-unggulan)
- [Demo & Screenshot]#-demo--screenshot)
- [Teknologi]#-teknologi)
- [Arsitektur Sistem]#-arsitektur-sistem)
- [Instalasi & Setup]#-instalasi--setup)
- [Penggunaan](#-penggunaan)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Tim Developer]#-tim-developer)
- [Lisensi](#-lisensi)

---

## 👧 Tim Developer

| Nama | Peran | GitHub |
|------|-------|--------|
| **Kevin Daniswara Raditya** | Project Lead & Full Stack Developer | [GitHub](https://github.com/Vinz-Villain) |
| **Raffi Setiawan Putra** | Backend Developer | [GitHub](https://github.com/bintanghawley) |
| **Atha Fakhri Arkana** | Frontend Developer | [GitHub](https://github.com/Bluzee-igni)

---

## 🏯 Tentang Proyek

### Latar Belakang
Aplikasi kasir (POS) saat ini sering kali terlalu rumit untuk UMKM menengah ke bawah karena menuntut input data yang panjang di tengah kesibukan melayani pembeli. Selain itu, masalah paling mematikan bagi pedagang kecil bukanlah sepinya pelanggan, melainkan kebocoran arus kas (uang campur aduk). Uang laci sering terpakai untuk pengeluaran darurat (beli gas, es batu) tanpa dicatat, membuat pedagang buta akan angka Laba Bersih riil mereka.

Lebih jauh lagi, data transaksi yang tercatat seringkali hanya menjadi angka mati karena pedagang tidak memiliki waktu menganalisis strategi jualan. Absennya pembukuan dasar dan wawasan data inilah yang selama ini menghambat kemajuan UMKM

### Solusi yang Ditawarkan
**REKA (Rekap Kasir)** hadir dengan pendekatan inovatif:
1. **Pencatatan Transaksi 3 Detik (*Fast POS))**: Antarmuka *grid tap-to-add* tanpa lag yang dirancang untuk kecepatan tinggi saat jam sibuk.
2. **Integritas *Historical Price Snapshotting***: Setiap transaksi mengunci harga jual dan modal (HPP) pada detik transaksi dilakukan, sehingga laporan laba historis tidak terdistorsi saat harga produk berubah di masa depan.
3. **Pencatatan Pengeluaran Dadakan Seketika**: Mengintegrasikan biaya operasional mikro harian yang langsung mengoreksi laba kotor menjadi laba bersih riil.
4. **AI Business Advisor (Google Gemini)**: Mengubah data transaksi menjadi wawasan bisnis aplikatif, evaluasi margin profit, dan strategi peningkatan omzet.

### Tujuan Proyek
**REKA** hadir sebagai solusi aplikasi kasir digital terpadu yang dirancang khusus untuk mempermudah operasional harian UMKM:
1. **Kecepatan Transaksi:** Memungkinkan kasir mencatat transaksi hanya dalam **3 detik** (*Tap-to-Add & Instant Checkout*).
2. **Otomasi Laba Bersih Real-Time:** Otomatis menghitung Omzet, HPP, Pengeluaran Operasional, hingga Laba Bersih seketika saat transaksi disimpan tanpa perlu rekap manual.
3. **Integritas Finansial:** Mengunci *snapshot* modal dan harga jual saat transaksi terjadi, menjamin laporan keuangan historis tetap akurat meski harga bahan baku di masa depan berubah.
4. **Pendampingan Bisnis Cerdas:** Mengintegrasikan kecerdasan buatan untuk memberikan wawasan bisnis, evaluasi margin profit, dan rekomendasi strategi penjualan bagi pemilik usaha.

---

## ☨ Fitur Unggulan

### Fitur Utama

| Fitur | Deskripsi | Keunggulan |
|-------|-----------|------------|
| **Kasir Kilat (3-Second POS)** | Antarmuka kasir cepat berbasis grid & kategori dengan kalkulasi subtotal instan. | Mengurangi antrean pembeli secara drastis melalui metode *Tap-to-Add* & *Instant Checkout*. |
| **Historical Price Snapshotting** | Sistem mengunci nilai `hevha_jual` dan `hpp` saat transaksi terjadi ke tabel relasional. | Laporan laba-rugi historis tetap 100% akurat meski harga bahan baku atau harga katalog diubah sewaktu-waktu. |
| **Pengcatatan Pengeluaran Dadakan** | Modul pencatatan pengeluaran operasional mikro harian (listrik, es batu, retribusi). | Menghilangkan masalah uang campur aduk dan otomatis menghitung laba bersih riil seketika. |
| **Dashboard & KPI Finansial Interaktif** | Visualisasi metrik bisnis lengkap (Total Omzet, Laba Kotor, Pengeluaran, Laba Bersih) serta grafik tren harian. | Membantu pemilik bisnis memantau kesehatan finansial secara visual tanpa perlu keahlian akuntansi. |
| **AI Business Advisor & Smart Insight** | Chatbot konsultasi bisnis interaktif dan ringkasan insight performa berbasis model Google Gemini. | Memberikan rekomendasi taktis peningkatan profit dan strategi efisiensi biaya yang terpersonalisasi. |
| **Manajemen Katalog & Status Produk** | Pengelolaan produk lengkap dengan kalkulasi margin keuntungan otomatis dan toggle status ketersediaan. | Pengaturan inventaris cepat, intuitif, dan terintegrasi langsung dengan menu kasir. |

### Fitur Tambahan
- **Mobile-First Warm Editorial UI** - Antarmuka modern yang nyaman di mata, ergonomis dioperasikan satu tangan via smartphone.
- **Role & Multi-device Sync** - Data tersinkronisasi instan via cloud Supabase PostgreSQL dark HP, tablet, maupun laptop.
- **Riwayat Transaksi & Filter Tanggal** - Penelusuran log riwayat penjualan terperinci dengan filter rentang waktu.
- **Export & Rekap Rinwkas** - Ringkasan performa finansial harian yang siap ditinjau kapan saja.

---

## �0 Demo & Screenshot

### Live Demo
🔗 **[Kunjungi Website REKA](https://reka-umkm.vercel.app)**

> **Akun Uji Coba Demo:**
> - **Email:** `kuliner@reka.id`
> - **Password:** `demo123`

### Screenshot Aplikasi
<div align="center">
  <img src="/public/ss-landingpages.png" alt="Landing Page REKA" width="800"/>
  <p><em>Homepage - Tampilan utama dan landing page REKA</em></p>

  <img src="/public/ss-transaksi.png" alt="Kasir Kilat POS" width="800"/>
  <p><em>Kasir Kilat - Antarmuka transaksi cepat 3 detik berbasis grid</em></p>

  <img src="/public/ss-dashboard.png" alt="Dashboard Finansial" width="800"/>
  <p><em>Dashboard - Panel kontrol metrik finansial real-time dan grafik tren laba</em></p>

  <img src="/public/ss-chatbot.png" alt="AI Chatbot" width="800"/>
  <p><em>AI Business Advisor - Konsultasi taktis strategi UMKM berbasis Google Gemini</em></p>
</div>

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
| **Next.js (App Router)** | Menyediakan *Server Components* dan *Server Actions* yang meniadakan latensi API eksternal, membuat performa kasir sangat cepat **zero bundle overhead**. |
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

## 🏗 Arsitektur Sistem

### System Architecture
```mermaid
flowchart TD

    subgraph Client ["Client Layer (Responsive Web / Mobile)"]
        UIl[Next.js Client Components]
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
        DB[(postgreSQL (Supabase))]
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
    users ||--o{pengeluaran_dadakan : logs
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
        string produk_id FK\p        int qty
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
├── app/                        # Next.js App Router Pages & Actions
│   ├── (auth)/                 # Rute autentikasi (login, register)
│   ├── (protected)/            # Halaman utama yang butuh login
│   │   ├── dashboard/          # Halaman utama analytics & KPI
│   │   ├── pengeluaran/        # Halaman catat pengeluaran dadakan
│   │   ├── produk/             # Halaman manajemen katalog produk
│   │   ├── profil/             # Halaman pengaturan profil usaha
│   │   ├── riwayat/            # Halaman riwayat transaksi
│   │   └── transaksi/          # Halaman Kasir Kilat (POS)
│   ├── api/                    # Rute API Route Handlers
│   │   ├── auth/               # Endpoint autentikasi NextAuth
│   │   └── chat/               # Endpoint AI Business Advisor (Gemini)
│   ├── globals.css             # Styling global Tailwind
│   ├── layout.tsx              # Root layout aplikasi
│   └── page.tsx                # Landing page
├── components/                 # Komponen React yang dapat digunakan ulang
│   ├── ai-insight-card.tsx     # Kartu insight AI
│   ├── chat-widget.tsx         # Widget chatbot AI
│   ├── confirm-modal.tsx       # Modal konfirmasi aksi
│   ├── formatted-markdown.tsx  # Render markdown dari respons AI
│   └── landing-showcase.tsx    # Komponen showcase landing page
├── lib/                        # Utilitas & logika server
│   ├── actions/                # Server Actions
│   │   ├── ai-insight.ts       # Logika insight AI
│   │   ├── auth.ts             # Aksi autentikasi
│   │   ├── expense.ts          # Aksi pengeluaran
│   │   ├── optibiz-dashboard.ts# Aksi data dashboard
│   │   ├── product.ts          # Aksi manajemen produk
│   │   ├── profile.ts          # Aksi profil usaha
│   │   └── transaction.ts      # Aksi transaksi POS
│   ├── auth/                   # Konfigurasi sesi autentikasi
│   ├── validations/            # Skema validasi Zod
│   ├── prisma.ts               # Instance Prisma Client
│   └── utils.ts                # Fungsi utilitas umum
├── prisma/
│   └── schema.prisma           # Skema database PostgreSQL
├── public/                     # Aset statis (gambar, screenshot)
├── scripts/                    # Skrip utilitas development
├── types/                      # Definisi tipe TypeScript
├── middleware.ts               # Middleware proteksi rute
├── auth.ts                     # Konfigurasi Auth.js v5
├── auth.config.ts              # Konfigurasi edge Auth.js
├── next.config.mjs             # Konfigurasi Next.js
└── tailwind.config.ts          # Konfigurasi Tailwind CSS
```

<div align="center">

**Made with ❤️ by [KRA -Dev] for ITECHNO CUP 2026**

</div>