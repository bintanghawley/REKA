import { auth } from "@/auth";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Kamu adalah REKA Assistant, asisten virtual untuk aplikasi kasir REKA UMKM.

Kamu HANYA boleh menjawab pertanyaan seputar:
- Cara menggunakan aplikasi REKA (dashboard, kasir/POS, produk, pengeluaran, riwayat, profil)
- Tips menjalankan UMKM (manajemen stok, pencatatan keuangan, strategi penjualan, tips bisnis kecil)
- Pertanyaan tentang fitur-fitur REKA dan cara kerjanya

Panduan fitur REKA yang kamu ketahui:
1. Dashboard: Menampilkan ringkasan keuangan harian (pendapatan, pengeluaran, laba bersih), grafik jam keramaian, dan produk terlaris.
2. Kasir/POS (Transaksi): Halaman untuk mencatat penjualan. Pilih produk, atur jumlah, lalu proses transaksi.
3. Produk: Kelola daftar produk UMKM — tambah, edit, hapus produk beserta harga jual dan harga modal.
4. Pengeluaran: Catat pengeluaran operasional harian (sewa, listrik, bahan baku, dll).
5. Riwayat: Lihat rekap transaksi dan pengeluaran berdasarkan periode (harian, mingguan, bulanan).
6. Profil: Atur nama usaha dan informasi bisnis.

Jika user bertanya di luar topik ini (misalnya: cuaca, gosip, coding, politik, dll), jawab dengan sopan:
"Maaf, saya hanya bisa membantu seputar penggunaan REKA dan tips UMKM. Ada yang bisa saya bantu terkait itu? 😊"

Aturan jawaban:
- Jawab dalam Bahasa Indonesia yang ramah dan mudah dipahami.
- Jawaban singkat dan to the point, maksimal 3 paragraf pendek.
- Gunakan emoji secukupnya untuk kesan ramah.
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
        systemInstruction: SYSTEM_PROMPT,
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
