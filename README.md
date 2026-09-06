# 🏪 REKA (Rekap Kasir Kilat & AI Laba Rugi UMKM)

> **Dokumen Proposal Karya & Deskripsi Produk Inovasi Digital**  
> *Platform Kasir Point-of-Sale (POS) Kilat 3-Detik dan Manajemen Finansial Real-Time Berbasis AI untuk Pemberdayaan UMKM Indonesia.*

---

### 🌐 Akses Langsung Aplikasi (Live Demo):
# 👉 [https://reka-umkm.vercel.app](https://reka-umkm.vercel.app) 👈

[![Live Demo](https://img.shields.io/badge/Live_App-reka--umkm.vercel.app-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://reka-umkm.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-bintanghawley%2FREKA-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/bintanghawley/REKA)
[![Next.js](https://img.shields.io/badge/Next.js-16%2B_(App_Router)-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_Business_Advisor-8E75B2?style=flat-square&logo=google)](https://aistudio.google.com/)

---

## 🎯 Akun Demo Pengujian (Untuk Dewan Juri & Penilai)

Untuk mempermudah proses evaluasi dan pengujian langsung seluruh fitur, kami telah menyiapkan **5 akun demo spesifik per sektor UMKM** yang telah dilengkapi dengan data riil transaksi 7 hari terakhir, katalog produk, riwayat belanja, dan analisis AI:

| Sektor UMKM | Email Akun Demo | Kata Sandi | Profil Usaha | Skenario Penilaian Juri |
| :--- | :--- | :--- | :--- | :--- |
| **🍔 Kuliner & Makanan** | `kuliner@reka.id` | `demo123` | **Warung Makan Mbak Sri** | Uji jam sibuk makan siang/malam, efisiensi bahan mentah, dan strategi paket kombo menu hemat. |
| **☕ Coffee Shop & Cafe** | `kopi@reka.id` | `demo123` | **Kopi Titik Temu** | Uji margin tinggi (60%+), pola nongkrong sore/malam, dan rekomendasi bundling kopi + pastry. |
| **🛒 Toko Sembako & Ritel** | `sembako@reka.id` | `demo123` | **Toko Sembako Barokah** | Uji perputaran cepat margin tipis (10–15%), transaksi belanja harian, dan kontrol laba kotor vs operasional. |
| **👕 Fashion & Distro** | `fashion@reka.id` | `demo123` | **Reka Threads & Apparel** | Uji transaksi nominal tinggi (Rp 100k–300k+), margin tebal ritel kreatif, dan rekap pengeluaran kemasan/stiker. |
| **🧪 QA Master Sandbox** | `qa@warungberkah.com` | `password123` | **Warung Berkah QA** | Akun sandbox bebas untuk mencoba tambah/edit/hapus produk, transaksi kasir, dan pencatatan pengeluaran. |

> *Catatan: Dewan juri juga dapat mencoba mendaftarkan akun baru secara instan melalui menu registrasi publik (`/register`).*

---

## 📌 1. Latar Belakang & Pernyataan Masalah

### Realitas UMKM di Indonesia
Sektor Usaha Mikro, Kecil, dan Menengah (UMKM) merupakan tulang punggung ekonomi nasional yang menyumbang lebih dari **61% PDB Indonesia** dan menyerap **97% tenaga kerja**. Namun, di lapangan mayoritas pelaku usaha mikro (warung makan, kedai kopi kecil, toko kelontong, kios pakaian) menghadapi 3 kendala operasional fatal:

1. **Kasir Terlalu Rumit (*Friction-Heavy POS*):**
   Aplikasi kasir konvensional di pasaran mewajibkan kasir memasukkan data berlapis-lapis (pencarian SKU rumit, manajemen stok opname gudang yang membingungkan) di saat antrean pembeli sedang memuncak. Akibatnya, pedagang memilih kembali ke buku kertas atau bahkan tidak mencatat sama sekali.
2. **Kebocoran Arus Kas (*Cash Leakage*):**
   Uang hasil penjualan di laci kasir kerap terpakai spontan untuk pengeluaran darurat harian (beli gas elpiji, es batu, kantong plastik, atau bayar retribusi pasar) tanpa pembukuan. Pedagang merasa omzetnya tinggi, tetapi heran mengapa uang tunai di akhir bulan habis.
3. **Data Mati (*Passive Data Problem*):**
   Kalaupun transaksi tercatat, angka-angka tersebut hanya menjadi arsip pasif. Pedagang kecil tidak memiliki konsultan bisnis pribadi untuk memberi tahu menu mana yang paling menguntungkan atau jam berapa porsi jualan harus ditambah.

---

## 💡 2. Solusi Inovatif: REKA (Rekap Kasir)

**REKA** dirancang khusus untuk memecahkan masalah di atas dengan filosofi **"Anti-Ribet, Akses Kilat, dan Edukatif"** bagi pedagang menengah ke bawah:

- **⚡ 3-Second Checkout:** Proses kasir secepat kilat (cukup ketuk produk & hitung kembalian otomatis) tanpa beban birokrasi stok gudang yang memperlambat antrean.
- **💸 Pencatatan Pengeluaran Dadakan Terpadu:** Pengeluaran tak terduga dicatat dalam 5 detik dan langsung memotong laba kotor menjadi Laba Bersih riil secara otomatis.
- **🔒 Historical Price Snapshotting:** Mengunci modal HPP dan harga jual riil pada detik transaksi terjadi, menjamin laporan margin masa lalu tetap akurat 100% meskipun harga beli bahan di masa depan naik.
- **🧠 AI Smart Business Advisor (Gemini AI):** Menganalisis 4 pilar bisnis pedagang (Jam Sibuk, Tren Omzet, Menu Terlaris & Bundling, Efisiensi Biaya) dan memberikan instruksi langkah taktis yang mudah dipahami pedagang awam.

---

## 🌍 3. Keselarasan Target SDG (Sustainable Development Goals)

Inovasi REKA berkontribusi nyata terhadap target pembangunan berkelanjutan global:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SDG 8: DECENT WORK AND ECONOMIC GROWTH                                 │
│  Target 8.3: Mendukung formalisasi dan pertumbuhan usaha mikro melalui   │
│  pencatatan finansial digital yang transparan dan akuntabel.            │
├─────────────────────────────────────────────────────────────────────────┤
│  SDG 9: INDUSTRY, INNOVATION, AND INFRASTRUCTURE                        │
│  Target 9.b: Mendemokratisasi akses kecerdasan buatan (Gen-AI) mutakhir │
│  agar dapat dinikmati oleh pedagang kecil dan UMKM akar rumput.         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ 4. Fitur Utama & Nilai Kebaruan

| Fitur Unggulan | Deskripsi & Nilai Tambah bagi Pedagang |
| :--- | :--- |
| **⚡ Kasir Kilat (3-Second POS)** | Antarmuka kasir grid sentuh dengan kategori dinamis. Dilengkapi tombol nominal uang pas (Rp 10k, 20k, 50k, 100k) dan kalkulasi kembalian otomatis bebas salah hitung. |
| **🔒 Historical Price Snapshotting** | Mengabadikan nilai `harga_jual` dan `hpp` pada detik transaksi. Laporan laba rugi toko kebal dari fluktuasi perubahan harga barang di masa mendatang. |
| **💸 Pengeluaran Dadakan Terintegrasi** | Form pencatatan belanja harian mikro (Bahan Baku, Operasional, Kemasan, Gas/Listrik). Laba bersih otomatis terkoreksi seketika tanpa perlu kalkulator manual. |
| **📊 Dashboard Finansial Interaktif** | Visualisasi 4 pilar kunci usaha: Total Omzet, Modal HPP, Pengeluaran Operasional, dan Laba Bersih Riil disertai grafik tren harian Recharts yang intuitif. |
| **🧠 AI Smart Business Advisor** | Kartu analisis otomatis membedah 4 aspek: **Waktu Transaksi (Pola Jam Sibuk)**, **Pola Omzet**, **Menu Terlaris & Paket Bundling**, serta **Kesehatan Margin & Biaya Operasional**. |
| **💬 REKA Assistant Chatbot** | Asisten virtual berbasis Google Gemini dengan *Strict Business Guardrail* dan dukungan format teks Markdown yang rapi untuk konsultasi strategi usaha 24/7. |
| **🛡️ Modal Konfirmasi Keamanan (Safe Actions)** | Dialog pop-up konfirmasi modern pada tindakan penting dan destruktif (Logout, Hapus Catatan Pengeluaran, Kosongkan Keranjang Kasir, Tambah Produk). |
| **🚪 Secure Session & Smooth Navigation** | Keamanan otentikasi JWT dengan pengalihan langsung ke Landing Page publik saat logout dan proteksi route dari akses tak terdaftar. |

---

## 📊 5. Perbandingan: Solusi Konvensional vs REKA

| Aspek Penilaian | Kasir Manual / Aplikasi Konvensional | REKA UMKM |
| :--- | :--- | :--- |
| **Kecepatan Transaksi** | Lambat (15–30 detik per pembeli) | **Kilat (3–5 detik per pembeli)** |
| **Beban Input Data** | Berat (Wajib kelola stok gudang & SKU) | **Ringan (Fokus kecepatan kasir)** |
| **Pencatatan Biaya Dadakan** | Terpisah / Sering terlupa | **Terintegrasi langsung memotong laba** |
| **Akurasi Laba Masa Lalu** | Berantakan jika harga beli master naik | **Akurat 100% (Historical Snapshot)** |
| **Pemanfaatan Data** | Arsip pasif tanpa analisis | **AI Advisor proaktif membedah 4 pilar** |
| **Aksesibilitas** | Membutuhkan pelatihan rumit | **Intuitif untuk pedagang awam sekalipun** |

---

## 🏗️ 6. Arsitektur Sistem & Alur Data

REKA dibangun menggunakan arsitektur modern berbasis **Next.js 16 App Router** dengan **Server Actions** dan basis data relasional di cloud:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      USER INTERACTION LAYER (FRONTEND)                      │
│   Pelaku UMKM / Kasir ──► Next.js 16 App Router (Responsive POS & Dashboard)│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
┌───────────────────────────────┐             ┌───────────────────────────────┐
│     SECURITY & AUTH LAYER     │             │     SERVER ACTIONS & API      │
│  Auth.js v5 (JWT & Middleware)│             │  Next.js Server Actions       │
│  Proteksi Akses Data Usaha    │             │  Atomic Transaction & Mutasi  │
└───────────────┬───────────────┘             └───────────────┬───────────────┘
                │                                             │
                └──────────────────────┬──────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
┌───────────────────────────────┐             ┌───────────────────────────────┐
│     CLOUD DATABASE & ORM      │             │     AI INTELLIGENCE ENGINE    │
│  Prisma ORM 5.22              │             │  Google Gemini 3.5 Flash-Lite │
│  Supabase PostgreSQL Cloud    │             │  Analisis 4 Pilar Finansial   │
│  Koneksi Pooler Port 6543     │             │  Chatbot Asisten Rekomendasi  │
└───────────────────────────────┘             └───────────────────────────────┘
```

### Mekanisme Integritas & Keamanan:
1. **Multi-Tenant Data Isolation:** Setiap query database secara ketat difilter berdasarkan `userId` yang tervalidasi di sesi JWT terenkripsi.
2. **Atomic Transaction Guarantees:** Transaksi kasir dan item detail disimpan secara atomik menggunakan Prisma Transaction, mencegah inkonsistensi data.
3. **Optimized Latency:** Koneksi database menggunakan PgBouncer Pooler pada port 6543 untuk efisiensi koneksi serverless di Vercel.

---

## 🛠️ 7. Teknologi Pembangun Sistem

- **Framework Inti:** Next.js 16 (App Router, Server Actions, Route Handlers)
- **Bahasa Pemrograman:** TypeScript 5.7 (*Type-safe 100%*)
- **Styling & Desain:** Tailwind CSS 3.4 (*Warm Paper & Editorial Palette*)
- **Database & Backend:** PostgreSQL Cloud via Supabase & Prisma ORM 5.22
- **Keamanan & Autentikasi:** Auth.js v5 (NextAuth Beta), Bcrypt.js, Zod Validation
- **Kecerdasan Buatan (AI):** Google Gen AI SDK (`@google/genai`) — Model Gemini 3.5 Flash-Lite
- **Visualisasi Data:** Recharts 2.15 & Lucide React Icons
- **Infrastruktur Cloud:** Vercel Edge & Serverless Deployment

---

## 📈 8. Dampak Sosio-Ekonomi bagi UMKM

1. **Mencegah Kebangkrutan Dini Akibat Uang Hilang:**
   Dengan pencatatan pengeluaran dadakan yang langsung memotong laba kotor, pedagang terhindar dari ilusi omzet semu.
2. **Efisiensi Waktu Pelayanan Antrean:**
   Kecepatan transaksi kasir 3-detik memungkinkan warung melayani lebih banyak pelanggan pada jam-jam sibuk makan siang dan malam.
3. **Peningkatan Literasi Finansial & Bisnis:**
   Analisis otomatis Gemini AI mengedukasi pedagang mengenai konsep margin, menu terlaris, dan jam efektif berjualan tanpa perlu menyewa konsultan mahal.

---

## 🏆 9. Rencana Pengembangan Masa Depan (Roadmap)

- [x] **Fase 1:** Kasir POS kilat 3-detik, kalkulasi laba rugi instan, dan Historical Price Snapshotting.
- [x] **Fase 2:** Pencatatan biaya operasional mikro dadakan terintegrasi.
- [x] **Fase 3:** AI Business Advisor (Gemini) untuk pola jam sibuk dan kartu Smart Insight 4 pilar.
- [x] **Fase 4:** Sistem modal konfirmasi aksi kritis dan akun demo lintas sektor UMKM.
- [ ] **Fase 5 (Mendatang):** Integrasi pembayaran non-tunai statis **QRIS Nasional** sekali pindai.
- [ ] **Fase 6 (Mendatang):** Ekspor laporan keuangan berkala ke format spreadsheet Excel/PDF berstandar SAK EMKM.
- [ ] **Fase 7 (Mendatang):** Dukungan cetak struk fisik langsung ke printer thermal Bluetooth via Web Bluetooth API.

---

## 👥 10. Informasi Karya & Hak Cipta

- **Nama Proyek:** REKA (Rekap Kasir Kilat & AI Laba Rugi UMKM)
- **Tautan Aplikasi Live:** [https://reka-umkm.vercel.app](https://reka-umkm.vercel.app)
- **Repositori Sumber:** [https://github.com/bintanghawley/REKA](https://github.com/bintanghawley/REKA)
- **Lisensi:** MIT License — Didedikasikan untuk kemajuan ekonomi digital UMKM Indonesia.
