"use server";

import { db } from "@/lib/prisma";
import { requireAuth, getCurrentProfile } from "@/lib/auth/session";
import { GoogleGenAI } from "@google/genai";

export type InsightCardData = {
  title: string;
  desc: string;
  badge: string;
};

export type AiBusinessInsightResult = {
  success: boolean;
  hasData: boolean;
  businessName: string;
  businessType: string;
  updatedAt: string;
  insights: {
    peakHour: InsightCardData;
    productStrategy: InsightCardData;
    marginTip: InsightCardData;
  };
  error?: string;
};

let cachedAI: GoogleGenAI | null = null;
let cachedKey: string | null = null;

function getAIClient(apiKey: string): GoogleGenAI {
  if (!cachedAI || cachedKey !== apiKey) {
    cachedAI = new GoogleGenAI({ apiKey });
    cachedKey = apiKey;
  }
  return cachedAI;
}

const insightCache = new Map<string, { data: AiBusinessInsightResult; timestamp: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 menit cache in-memory

/**
 * Server Action: Menghasilkan AI Smart Business Insight berbasis data transaksi riil.
 * Dilengkapi in-memory caching 15 menit per user agar navigasi dashboard instan (0ms).
 */
export async function getAiBusinessInsightsAction(
  forceRefresh = false
): Promise<AiBusinessInsightResult> {
  try {
    const user = await requireAuth();

    // 1. Cek cache in-memory jika bukan forceRefresh
    if (!forceRefresh) {
      const cached = insightCache.get(user.id);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.data;
      }
    }

    const profile = await getCurrentProfile();

    const businessName = profile?.nama_usaha || "Warung Anda";
    const businessType = profile?.jenis_usaha || "Kuliner / Dagang";

    // Waktu WIB (UTC+7)
    const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
    const nowWib = new Date(Date.now() + WIB_OFFSET_MS);
    const startOf7DaysAgo = new Date(nowWib.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Ambil transaksi & pengeluaran 7 hari terakhir secara paralel untuk performa maksimal
    const [transactions, expenses] = await Promise.all([
      db.transaksi.findMany({
        where: {
          user_id: user.id,
          waktu: { gte: startOf7DaysAgo },
        },
        select: {
          qty: true,
          harga_jual_saat_transaksi: true,
          hpp_saat_transaksi: true,
          waktu: true,
          produk: { select: { nama: true } },
        },
        orderBy: { waktu: "desc" },
      }),
      db.pengeluaranDadakan.findMany({
        where: {
          user_id: user.id,
          tanggal: { gte: startOf7DaysAgo },
        },
        select: { nominal: true, kategori: true },
      }),
    ]);

    // 1. Jika belum ada data transaksi sama sekali
    if (transactions.length === 0) {
      const emptyResult: AiBusinessInsightResult = {
        success: true,
        hasData: false,
        businessName,
        businessType,
        updatedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        insights: {
          peakHour: {
            title: "Pola Jam Ramai",
            desc: "Belum terdeteksi — Mulai catat transaksi penjualan hari ini di Kasir POS untuk mengetahui jam belanja pembeli.",
            badge: "Menunggu Data",
          },
          productStrategy: {
            title: "Katalog & Menu Andalan",
            desc: "Daftarkan menu unggulan di menu Produk dengan modal HPP agar sistem otomatis menghitung keuntungan murni.",
            badge: "Mulai Sekarang",
          },
          marginTip: {
            title: "Kunci Untung Bersih",
            desc: "Catat pengeluaran kecil seperti es batu, gas, atau kemasan di menu Pengeluaran agar uang di laci kasir selalu cocok.",
            badge: "Tips Keuangan",
          },
        },
      };
      insightCache.set(user.id, { data: emptyResult, timestamp: Date.now() });
      return emptyResult;
    }

    // 2. Agregasi data riil untuk dianalisis
    let totalOmzet = 0;
    let totalHpp = 0;
    const hourCounts: Record<number, number> = {};
    const productQtyMap: Record<string, { qty: number; omzet: number }> = {};

    for (const trx of transactions) {
      const omzet = trx.harga_jual_saat_transaksi * trx.qty;
      const hpp = trx.hpp_saat_transaksi * trx.qty;
      totalOmzet += omzet;
      totalHpp += hpp;

      // Jam transaksi WIB
      const trxWib = new Date(trx.waktu.getTime() + WIB_OFFSET_MS);
      const hour = trxWib.getUTCHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + trx.qty;

      const pName = trx.produk?.nama || "Produk";
      if (!productQtyMap[pName]) {
        productQtyMap[pName] = { qty: 0, omzet: 0 };
      }
      productQtyMap[pName].qty += trx.qty;
      productQtyMap[pName].omzet += omzet;
    }

    // Cari jam puncak (peak hour window)
    let peakHour = 12;
    let maxTrxInHour = 0;
    for (const [hourStr, count] of Object.entries(hourCounts)) {
      const h = Number(hourStr);
      if (count > maxTrxInHour) {
        maxTrxInHour = count;
        peakHour = h;
      }
    }
    const peakHourWindow = `${String(peakHour).padStart(2, "0")}:00 – ${String((peakHour + 2) % 24).padStart(2, "0")}:00`;

    // Ranking produk terlaris
    const sortedProducts = Object.entries(productQtyMap)
      .sort((a, b) => b[1].qty - a[1].qty)
      .slice(0, 3);
    const topProdName = sortedProducts[0] ? sortedProducts[0][0] : "Menu Andalan";
    const topProdQty = sortedProducts[0] ? sortedProducts[0][1].qty : 0;

    const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.nominal), 0);
    const grossMargin = totalOmzet > 0 ? Math.round(((totalOmzet - totalHpp) / totalOmzet) * 100) : 0;

    // Fallback heurisitik deterministik (selalu siap jika AI offline)
    const fallbackInsights = {
      peakHour: {
        title: "Tren Jam Sibuk",
        desc: `Aktivitas pembeli tertinggi tercatat pada ${peakHourWindow} (${maxTrxInHour} item terjual). Siapkan porsi dan bahan baku sebelum jam ini agar kasir tidak kewalahan.`,
        badge: peakHourWindow,
      },
      productStrategy: {
        title: "Menu Terlaris & Bundling",
        desc: `${topProdName} menjadi pilihan favorit pelanggan (${topProdQty} terjual). Coba buat paket kombo hemat dengan minuman untuk meningkatkan nominal rata-rata per transaksi.`,
        badge: `${topProdName} (#1)`,
      },
      marginTip: {
        title: "Kesehatan Margin & Biaya",
        desc: `Margin laba kotor toko Anda berada di kisaran ${grossMargin}%. Pantau pos pengeluaran operasional agar laba bersih yang siap diambil tetap stabil.`,
        badge: `Margin ${grossMargin}%`,
      },
    };

    // 3. Coba panggil Gemini untuk menghasilkan insight yang lebih personal & kontekstual
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes("ganti_dengan")) {
      return {
        success: true,
        hasData: true,
        businessName,
        businessType,
        updatedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        insights: fallbackInsights,
      };
    }

    try {
      const ai = getAIClient(apiKey);
      const prompt = `Analisis data penjualan toko berikut dan berikan 3 rekomendasi taktis singkat dalam format JSON:
Nama Toko: ${businessName}
Bidang Usaha: ${businessType}
Total Transaksi 7 Hari: ${transactions.length} transaksi (${totalOmzet} rupiah)
Jam Teramai: Sekitar jam ${peakHourWindow} (${maxTrxInHour} item)
Produk Terlaris: ${sortedProducts.map(([n, d]) => `${n} (${d.qty}x)`).join(", ")}
Margin Laba Kotor: ${grossMargin}%
Total Pengeluaran Dicatat: Rp ${totalExpense.toLocaleString("id-ID")}

Instruksi:
Berikan output HANYA JSON murni (tanpa tanda kutip markdown backtick):
{
  "peakHour": {
    "title": "Tren Jam Ramai",
    "desc": "penjelasan konkret 1-2 kalimat (sebutkan jam dan tindakan persiapan)",
    "badge": "Jam ${peakHourWindow}"
  },
  "productStrategy": {
    "title": "Menu & Manajemen Stok",
    "desc": "penjelasan konkret 1-2 kalimat terkait produk terlaris dan strategi bundling",
    "badge": "Peluang Cuan"
  },
  "marginTip": {
    "title": "Optimasi Laba & Operasional",
    "desc": "penjelasan konkret 1-2 kalimat terkait efisiensi biaya dan margin",
    "badge": "Tips Finansial"
  }
}`;

      const aiRes = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
          temperature: 0.5,
          maxOutputTokens: 400,
        },
      });

      const responseText = aiRes.text?.trim() || "";
      const jsonCleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(jsonCleaned);

      if (parsed.peakHour?.desc && parsed.productStrategy?.desc && parsed.marginTip?.desc) {
        const aiResult: AiBusinessInsightResult = {
          success: true,
          hasData: true,
          businessName,
          businessType,
          updatedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          insights: {
            peakHour: {
              title: parsed.peakHour.title || "Tren Jam Ramai",
              desc: parsed.peakHour.desc,
              badge: parsed.peakHour.badge || peakHourWindow,
            },
            productStrategy: {
              title: parsed.productStrategy.title || "Menu & Manajemen Stok",
              desc: parsed.productStrategy.desc,
              badge: parsed.productStrategy.badge || "Peluang Cuan",
            },
            marginTip: {
              title: parsed.marginTip.title || "Optimasi Laba & Biaya",
              desc: parsed.marginTip.desc,
              badge: parsed.marginTip.badge || `Margin ${grossMargin}%`,
            },
          },
        };
        insightCache.set(user.id, { data: aiResult, timestamp: Date.now() });
        return aiResult;
      }
    } catch (aiErr) {
      console.warn("[getAiBusinessInsightsAction AI Fallback used]:", aiErr);
    }

    // Jika AI error atau output tidak sesuai schema, gunakan fallback heurisitik berkualitas tinggi
    const fallbackResult: AiBusinessInsightResult = {
      success: true,
      hasData: true,
      businessName,
      businessType,
      updatedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      insights: fallbackInsights,
    };
    insightCache.set(user.id, { data: fallbackResult, timestamp: Date.now() });
    return fallbackResult;
  } catch (error) {
    console.error("[getAiBusinessInsightsAction Error]:", error);
    return {
      success: false,
      hasData: false,
      businessName: "Warung Anda",
      businessType: "UMKM",
      updatedAt: "-",
      insights: {
        peakHour: { title: "Puncak Keramaian", desc: "Data belum cukup untuk dianalisis.", badge: "-" },
        productStrategy: { title: "Strategi Produk", desc: "Data belum cukup untuk dianalisis.", badge: "-" },
        marginTip: { title: "Tips Finansial", desc: "Data belum cukup untuk dianalisis.", badge: "-" },
      },
      error: "Gagal memuat analisis AI.",
    };
  }
}
