"use client";

import { useState, useTransition } from "react";
import { Sparkles, Clock, TrendingUp, ShoppingBag, RefreshCw, Bot } from "lucide-react";
import { getAiBusinessInsightsAction, type AiBusinessInsightResult } from "@/lib/actions/ai-insight";

interface AiInsightCardProps {
  initialData: AiBusinessInsightResult;
}

export function AiInsightCard({ initialData }: AiInsightCardProps) {
  const [data, setData] = useState<AiBusinessInsightResult>(initialData);
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      const res = await getAiBusinessInsightsAction(true);
      if (res.success) {
        setData(res);
      }
    });
  };

  const { insights, businessName, updatedAt, hasData } = data;

  return (
    <div className="bg-[#ffffff] rounded-[12px] border border-[#e4e5e1] overflow-hidden shadow-[rgba(24,25,22,0.04)_0px_2px_4px_0px,rgba(24,25,22,0.06)_0px_1px_2px_0px] transition-all">
      {/* Top Terminal Bar (REKA Design Token: #141415 Dark Header) */}
      <div className="bg-[#141415] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-white border-b border-[#2e2e2c]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[6px] bg-[#2e2e2c] border border-[#454542] flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-[#88d2c3] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
                AI Smart Business Insight
              </h3>
              <span className="font-mono text-[10px] font-medium text-[#88d2c3] bg-[#88d2c3]/15 border border-[#88d2c3]/30 px-1.5 py-0.2 rounded-[3px]">
                GEMINI AI
              </span>
            </div>
            <p className="text-[11px] text-[#8c8c89] font-mono mt-0.5">
              Rekomendasi taktis berbasis data riil transaksi • {businessName}
            </p>
          </div>
        </div>

        {/* Right Action: Last updated & Refresh button */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline font-mono text-[11px] text-[#8c8c89]">
            Update: {updatedAt}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#2e2e2c] hover:bg-[#383835] active:scale-95 border border-[#454542] text-white font-mono text-xs transition-all cursor-pointer disabled:opacity-50"
            title="Analisis ulang data penjualan"
          >
            <RefreshCw
              size={13}
              className={`text-[#88d2c3] ${isPending ? "animate-spin" : ""}`}
            />
            <span>{isPending ? "Menganalisis..." : "Perbarui"}</span>
          </button>
        </div>
      </div>

      {/* 3 Insight Cards Grid */}
      <div className="p-4 sm:p-5 bg-[#fafaf8]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* 1. Peak Hour Insight */}
          <div className="bg-[#ffffff] rounded-[8px] p-4 border border-[#e4e5e1] shadow-[rgba(24,25,22,0.02)_0px_1px_1px_0px] flex flex-col justify-between hover:border-[#f35b22]/40 transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[4px] bg-[#ffcab5]/40 flex items-center justify-center text-[#f35b22]">
                    <Clock size={14} />
                  </div>
                  <span className="text-xs font-semibold text-[#141415]">
                    {insights.peakHour.title}
                  </span>
                </div>
                <span className="font-mono text-[10px] font-semibold text-[#f35b22] bg-[#ffcab5]/30 border border-[#ffcab5] px-1.5 py-0.5 rounded-[3px] truncate max-w-[120px]">
                  {insights.peakHour.badge}
                </span>
              </div>
              <p className="text-[12.5px] sm:text-[13px] text-[#454542] leading-[1.55]">
                {insights.peakHour.desc}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#f0f0ef] flex items-center gap-1.5 font-mono text-[10px] text-[#8c8c89]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f35b22]" />
              <span>Analisis Waktu Belanja</span>
            </div>
          </div>

          {/* 2. Product & Stock Strategy */}
          <div className="bg-[#ffffff] rounded-[8px] p-4 border border-[#e4e5e1] shadow-[rgba(24,25,22,0.02)_0px_1px_1px_0px] flex flex-col justify-between hover:border-[#0284c7]/40 transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[4px] bg-[#8bc5f3]/20 flex items-center justify-center text-[#0284c7]">
                    <ShoppingBag size={14} />
                  </div>
                  <span className="text-xs font-semibold text-[#141415]">
                    {insights.productStrategy.title}
                  </span>
                </div>
                <span className="font-mono text-[10px] font-semibold text-[#0284c7] bg-[#8bc5f3]/25 border border-[#8bc5f3]/60 px-1.5 py-0.5 rounded-[3px] truncate max-w-[120px]">
                  {insights.productStrategy.badge}
                </span>
              </div>
              <p className="text-[12.5px] sm:text-[13px] text-[#454542] leading-[1.55]">
                {insights.productStrategy.desc}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#f0f0ef] flex items-center gap-1.5 font-mono text-[10px] text-[#8c8c89]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7]" />
              <span>Strategi Menu & Bundling</span>
            </div>
          </div>

          {/* 3. Margin & Cost Optimization */}
          <div className="bg-[#ffffff] rounded-[8px] p-4 border border-[#e4e5e1] shadow-[rgba(24,25,22,0.02)_0px_1px_1px_0px] flex flex-col justify-between hover:border-[#165424]/40 transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[4px] bg-[#eef8f0] flex items-center justify-center text-[#165424]">
                    <TrendingUp size={14} />
                  </div>
                  <span className="text-xs font-semibold text-[#141415]">
                    {insights.marginTip.title}
                  </span>
                </div>
                <span className="font-mono text-[10px] font-semibold text-[#165424] bg-[#eef8f0] border border-[#62b06d] px-1.5 py-0.5 rounded-[3px] truncate max-w-[120px]">
                  {insights.marginTip.badge}
                </span>
              </div>
              <p className="text-[12.5px] sm:text-[13px] text-[#454542] leading-[1.55]">
                {insights.marginTip.desc}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#f0f0ef] flex items-center gap-1.5 font-mono text-[10px] text-[#8c8c89]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#165424]" />
              <span>Efisiensi Biaya & Margin</span>
            </div>
          </div>
        </div>

        {/* Informative Footer Bar */}
        {!hasData && (
          <div className="mt-3 p-2.5 bg-[#ffffff] border border-[#e4e5e1] rounded-[6px] flex items-center gap-2 text-xs text-[#6e6f6c]">
            <Bot size={15} className="text-[#f35b22] shrink-0" />
            <span>
              💡 <strong>Tips Memulai:</strong> Begitu Anda mencatat transaksi pertama di Kasir POS, AI REKA akan otomatis menganalisis jam paling ramai dan produk paling laku di warung Anda.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
