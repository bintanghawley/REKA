"use client";

import { useState, useTransition } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { FormattedMarkdown } from "@/components/formatted-markdown";
import {
  getAiBusinessInsightsAction,
  type AiBusinessInsightResult,
  type InsightCardData,
} from "@/lib/actions/ai-insight";

interface FeatureAiInsightProps {
  insight?: InsightCardData;
  featureName: string;
  className?: string;
}

/**
 * Komponen AI Insight per Fitur (Embedded Callout Box)
 * Tersemat langsung di bawah masing-masing visualisasi grafik / kartu fitur:
 * 1. Waktu Transaksi (Tren Transaksi)
 * 2. Omzet (Porsi Omzet)
 * 3. Produk Terlaris (Ranking Produk)
 * 4. Laba & Margin (Struktur Laba & Arus Kas)
 */
export function FeatureAiInsight({
  insight,
  featureName,
  className = "",
}: FeatureAiInsightProps) {
  if (!insight?.desc) return null;

  return (
    <div className={`mt-4 pt-3 border-t border-[#e4e5e1] ${className}`}>
      <div className="bg-[#141415] rounded-[8px] p-3 sm:p-3.5 text-white border border-[#2e2e2c] shadow-xs transition-all">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#88d2c3] shrink-0 animate-pulse" />
            <span className="font-mono text-[10px] font-semibold text-[#88d2c3] uppercase tracking-wider">
              AI Insight • {featureName}
            </span>
          </div>
          {insight.badge && (
            <span className="font-mono text-[9px] font-medium text-[#f0f0ef] bg-[#2e2e2c] border border-[#454542] px-1.5 py-0.5 rounded-[3px] shrink-0">
              {insight.badge}
            </span>
          )}
        </div>
        <FormattedMarkdown
          content={insight.desc}
          variant="dark"
          className="text-[11px] sm:text-xs text-[#e4e5e1] leading-relaxed font-sans"
        />
      </div>
    </div>
  );
}

interface AiInsightStatusBarProps {
  data: AiBusinessInsightResult;
  onRefresh: (updated: AiBusinessInsightResult) => void;
  isPending?: boolean;
}

/**
 * Header status bar ramping untuk mengontrol dan memperbarui AI Insight dashboard.
 */
export function AiInsightStatusBar({
  data,
  onRefresh,
  isPending = false,
}: AiInsightStatusBarProps) {
  const [internalPending, startTransition] = useTransition();
  const loading = isPending || internalPending;

  const handleRefresh = () => {
    startTransition(async () => {
      const res = await getAiBusinessInsightsAction(true);
      if (res.success) {
        onRefresh(res);
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#ffffff] border border-[#e4e5e1] px-4 py-2.5 rounded-[8px] shadow-[rgba(24,25,22,0.04)_0px_1px_2px_0px] text-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-[4px] bg-[#141415] flex items-center justify-center text-[#88d2c3] shrink-0">
          <Sparkles size={13} className="animate-pulse" />
        </div>
        <div className="text-xs">
          <span className="font-semibold text-[#141415]">AI Smart Insight Aktif</span>
          <span className="hidden sm:inline text-[#6e6f6c] ml-1.5">
            — Rekomendasi taktis riil tersemat pada tiap grafik di bawah.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
        <span className="text-[#8c8c89]">
          Update: {data.updatedAt || "Baru saja"}
        </span>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-[#141415] hover:bg-[#2e2e2c] active:scale-95 text-[#88d2c3] border border-[#2e2e2c] font-mono text-[11px] font-medium transition-all cursor-pointer disabled:opacity-50"
          title="Analisis ulang riwayat transaksi dengan Gemini AI"
        >
          <RefreshCw size={11} className={`text-[#88d2c3] ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Menganalisis..." : "Perbarui AI"}</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Komponen backward-compatibility jika diperlukan
 */
export function AiInsightCard({ initialData }: { initialData: AiBusinessInsightResult }) {
  const [data, setData] = useState(initialData);
  return <AiInsightStatusBar data={data} onRefresh={setData} />;
}
