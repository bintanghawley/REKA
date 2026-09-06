"use client";

import React, { useEffect } from "react";
import { AlertTriangle, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "danger",
  isLoading = false,
  icon,
}: ConfirmModalProps) {
  // Tutup modal jika tombol Escape ditekan
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  // Kunci scrolling body saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Konfigurasi visual berdasarkan varian
  const variantStyles = {
    danger: {
      iconBg: "bg-[#fee2e2]",
      iconColor: "text-[#d61f1f]",
      defaultIcon: <AlertTriangle size={24} className="text-[#d61f1f]" />,
      confirmBtn:
        "bg-[#d61f1f] hover:bg-[#b91c1c] text-white shadow-[rgba(214,31,31,0.25)_0px_2px_8px_0px]",
    },
    warning: {
      iconBg: "bg-[#fef3c7]",
      iconColor: "text-[#d97706]",
      defaultIcon: <AlertCircle size={24} className="text-[#d97706]" />,
      confirmBtn:
        "bg-[#d97706] hover:bg-[#b45309] text-white shadow-[rgba(217,119,6,0.25)_0px_2px_8px_0px]",
    },
    primary: {
      iconBg: "bg-[#fff1ec]",
      iconColor: "text-[#f35b22]",
      defaultIcon: <CheckCircle2 size={24} className="text-[#f35b22]" />,
      confirmBtn:
        "bg-[#f35b22] hover:bg-[#d14200] text-white shadow-[rgba(243,91,34,0.25)_0px_2px_8px_0px]",
    },
  }[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-[#e4e5e1] p-6 shadow-2xl relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Close silang */}
        {!isLoading && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#8c8c89] hover:text-[#141415] hover:bg-[#f0f0ef] rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        )}

        <div className="flex items-start gap-4">
          {/* Ikon Varian */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${variantStyles.iconBg}`}
          >
            {icon || variantStyles.defaultIcon}
          </div>

          {/* Konten Teks */}
          <div className="space-y-1.5 flex-1 pr-4">
            <h3
              id="confirm-modal-title"
              className="text-lg font-semibold text-[#141415] leading-snug"
            >
              {title}
            </h3>
            <div className="text-sm text-[#6e6f6c] leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#f0f0ef]">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-[#454542] hover:text-[#141415] bg-[#f0f0ef] hover:bg-[#e4e5e1] rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer ${variantStyles.confirmBtn}`}
          >
            {isLoading && <Loader2 size={15} className="animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
