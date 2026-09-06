import { auth } from "@/auth";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

const SYSTEM_PROMPT = `Kamu adalah REKA Assistant, asisten virtual cerdas untuk aplikasi kasir REKA UMKM.

Filosofi & Target Pengguna REKA:
REKA adalah aplikasi kasir kilat dan manajemen laba bersih yang dirancang khusus untuk UMKM menengah ke bawah (warung makan, kedai kopi, kios retail kecil, toko kelontong, fashion, jasa, dll) yang mengutamakan AKSES CEPAT, KEPRAKTISAN, dan ANTI-RIBET.

BATASAN PENTING & FITUR REKA (WAJIB DIPATUHI):
- REKA TIDAK MEMILIKI fitur manajemen stok, stok opname, inventaris gudang, kuantitas stok, ataupun batas minimum stok.
- JANGAN PERNAH menyarankan atau menyebut "kelola stok", "manajemen stok", "cek sisa stok", "stok opname", atau istilah kelola stok lainnya yang seolah-olah fiturnya ada di REKA.
- Di REKA, menu untuk produk adalah "Menu Produk" (katalog daftar produk/menu untuk mengatur nama, harga jual, modal HPP, dan status ketersediaan Tersedia/Habis).
- Langkah taktis yang disarankan kepada user harus selalu realistis dan sesuai dengan fitur REKA yang sebenarnya.

Panduan 6 Fitur Utama REKA:
1. Dashboard (/dashboard): Ringkasan performa finansial harian/mingguan (omzet kotor, total HPP/modal, pengeluaran operasional, laba bersih), grafik tren jam sibuk (waktu transaksi), produk terlaris, dan AI Smart Business Insight.
2. Kasir POS / Transaksi (/transaksi): Kasir kilat untuk melayani pembeli secepat kilat. Cukup pilih/tap produk, tentukan jumlah, hitung uang pembayaran & kembalian, lalu proses transaksi langsung tercatat.
3. Produk (/produk): Katalog daftar menu dan produk usaha — kelola nama produk, kategori, harga jual, dan modal HPP (Harga Pokok Penjualan) untuk mengetahui margin untung tiap porsi/barang secara akurat.
4. Pengeluaran (/pengeluaran): Catat pengeluaran dadakan atau biaya operasional harian (sewa, listrik, bahan baku belanja pasar, kemasan/kantong plastik, gas, dll) agar laba bersih terhitung akurat.
5. Riwayat (/riwayat): Rekap riwayat transaksi penjualan dan pengeluaran dengan filter tanggal/periode.
6. Profil (/profil): Pengaturan identitas usaha (nama usaha dan bidang usaha).

Topik yang Boleh Dijawab:
- Cara penggunaan seluruh fitur REKA di atas.
- Tips praktis bisnis UMKM menengah ke bawah: penentuan harga jual vs modal HPP yang menguntungkan, efisiensi biaya operasional, strategi paket bundling menu hemat, pelayanan kasir kilat, dan optimalisasi jam ramai pembeli.

Jika user bertanya di luar topik ini (misalnya: cuaca, gosip, coding, politik, dll), jawab dengan sopan:
"Maaf, saya hanya bisa membantu seputar penggunaan REKA dan tips UMKM. Ada yang bisa saya bantu terkait itu? 😊"

Aturan Jawaban:
- Jawab dalam Bahasa Indonesia yang ramah, ringkas, dan mudah dipahami pelaku UMKM.
- To the point, maksimal 3-4 paragraf pendek atau poin-poin terstruktur.
- Jangan gunakan istilah yang rumit. Fokus pada aksi nyata yang relevan dengan fitur REKA (misal: "perbarui modal HPP di menu Produk", "catat biaya operasional di menu Pengeluaran").
- Jangan pernah menyebut bahwa kamu adalah AI model dari Google/Gemini. Kamu adalah "REKA Assistant".`;

const MAX_INPUT_LENGTH = 500;
const RATE_LIMIT_PER_HOUR = 20;
const RATE_LIMIT_BURST_PER_MINUTE = 5;

const rateLimitMap = new Map<string, number[]>();

let cachedAI: GoogleGenAI | null = null;
let cachedKey: string | null = null;

function getAIClient(apiKey: string): GoogleGenAI {
  if (!cachedAI || cachedKey !== apiKey) {
    cachedAI = new GoogleGenAI({ apiKey });
    cachedKey = apiKey;
  }
  return cachedAI;
}

let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 10 * 60 * 1000;

function checkRateLimit(userId: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();

  if (now - lastCleanup > CLEANUP_INTERVAL) {
    const cutoff = now - 60 * 60 * 1000;
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const valid = timestamps.filter((t) => t > cutoff);
      if (valid.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, valid);
      }
    }
    lastCleanup = now;
  }

  const timestamps = rateLimitMap.get(userId) || [];

  const oneHourAgo = now - 60 * 60 * 1000;
  const oneMinuteAgo = now - 60 * 1000;

  const hourlyRequests = timestamps.filter((t) => t > oneHourAgo);
  const minuteRequests = timestamps.filter((t) => t > oneMinuteAgo);

  if (minuteRequests.length >= RATE_LIMIT_BURST_PER_MINUTE) {
    const oldest = minuteRequests[0];
    const retryAfter = Math.ceil((oldest + 60 * 1000 - now) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  if (hourlyRequests.length >= RATE_LIMIT_PER_HOUR) {
    const oldest = hourlyRequests[0];
    const retryAfter = Math.ceil((oldest + 60 * 60 * 1000 - now) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  hourlyRequests.push(now);
  rateLimitMap.set(userId, hourlyRequests);

  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Kamu harus login terlebih dahulu." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const rateCheck = checkRateLimit(userId);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Terlalu banyak pertanyaan. Coba lagi dalam ${rateCheck.retryAfterSeconds} detik.`,
          retryAfterSeconds: rateCheck.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong." },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong." },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        { error: `Pesan terlalu panjang. Maksimal ${MAX_INPUT_LENGTH} karakter.` },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "ganti_dengan_api_key_dari_aistudio_google_com") {
      return NextResponse.json(
        { error: "Chatbot belum dikonfigurasi. Hubungi admin." },
        { status: 503 }
      );
    }

    const ai = getAIClient(apiKey);

    let userContext = "";
    try {
      const profile = await db.profile.findUnique({
        where: { id: userId },
        select: { nama_usaha: true, jenis_usaha: true },
      });
      if (profile?.nama_usaha || profile?.jenis_usaha) {
        userContext = `\n\nKonteks Pengguna Saat Ini:
- Nama Usaha: ${profile.nama_usaha || "Belum diatur"}
- Jenis/Bidang Usaha: ${profile.jenis_usaha || "UMKM"}
Instruksi personalisasi:
- Sapa atau kaitkan jawaban secara alami dengan nama usaha "${profile.nama_usaha || "usaha Anda"}" dan bidang usaha "${profile.jenis_usaha || "UMKM"}" jika relevan.
- Berikan contoh nyata atau strategi yang cocok untuk jenis usaha tersebut.`;
      }
    } catch (dbErr) {
      console.warn("[REKA Chat] Failed to fetch profile context:", dbErr);
    }

    const chatHistory: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        if (msg.role === "user" || msg.role === "model") {
          chatHistory.push({
            role: msg.role,
            parts: [{ text: String(msg.text || "").slice(0, MAX_INPUT_LENGTH) }],
          });
        }
      }
    }

    chatHistory.push({
      role: "user",
      parts: [{ text: trimmedMessage }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: chatHistory,
      config: {
        systemInstruction: SYSTEM_PROMPT + userContext,
        maxOutputTokens: 350,
        temperature: 0.6,
        topP: 0.9,
      },
    });

    const text = response.text ?? "Maaf, saya tidak bisa menjawab saat ini. Coba lagi nanti.";

    return NextResponse.json({ reply: text });
  } catch (error: unknown) {
    console.error("[REKA Chat API Error]", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("SAFETY")) {
      return NextResponse.json(
        { reply: "Maaf, saya tidak bisa menjawab pertanyaan tersebut. Coba tanyakan hal lain seputar REKA atau tips UMKM. 😊" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server. Coba lagi nanti." },
      { status: 500 }
    );
  }
}
