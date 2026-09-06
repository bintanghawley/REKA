"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";
import { FormattedMarkdown } from "@/components/formatted-markdown";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: number;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "model",
  text: "Halo! 👋 Saya REKA Assistant. Tanya apa saja seputar penggunaan REKA atau tips menjalankan UMKM.",
  timestamp: Date.now(),
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNewDot, setHasNewDot] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setHasNewDot(false);
    }
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    if (trimmed.length > 500) {
      setError("Pesan terlalu panjang. Maksimal 500 karakter.");
      return;
    }

    setError(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const historyForApi = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: historyForApi,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(data.error || "Terlalu banyak pertanyaan. Coba lagi nanti.");
        } else {
          setError(data.error || "Terjadi kesalahan.");
        }
        setIsLoading(false);
        return;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "model",
        text: data.reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setError("Gagal menghubungi server. Periksa koneksi internet.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const charCount = input.length;

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-20 right-4 sm:right-6 z-[60] transition-all duration-300 ease-out origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
        style={{ width: "min(380px, calc(100vw - 32px))" }}
      >
        <div className="bg-[#ffffff] rounded-xl border border-[#e4e5e1] overflow-hidden flex flex-col"
          style={{
            height: "min(520px, calc(100vh - 160px))",
            boxShadow: "0 20px 60px rgba(20,20,21,0.15), 0 4px 16px rgba(20,20,21,0.08)",
          }}
        >
          {/* Header */}
          <div className="bg-[#141415] px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2e2e2c] flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-[#88d2c3]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-semibold text-sm tracking-tight">
                    REKA Assistant
                  </span>
                  <span className="text-[10px] font-mono font-medium text-[#88d2c3] bg-[#88d2c3]/10 px-1.5 py-0.5 rounded">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-[#8c8c89] font-mono">
                  Siap membantu UMKM-mu
                </p>
              </div>
            </div>
            <button
              onClick={toggleOpen}
              className="w-7 h-7 rounded-md flex items-center justify-center text-[#8c8c89] hover:text-white hover:bg-[#2e2e2c] transition-colors"
              aria-label="Tutup chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={chatBodyRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            style={{ backgroundColor: "#fafaf8" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                {msg.role === "model" && (
                  <div className="w-6 h-6 rounded-md bg-[#ffcab5] flex items-center justify-center mr-2 mt-0.5 shrink-0">
                    <Sparkles className="w-3 h-3 text-[#d14200]" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 text-[13px] leading-[1.55] ${
                    msg.role === "user"
                      ? "bg-[#f35b22] text-white rounded-xl rounded-br-sm"
                      : "bg-[#ffffff] text-[#141415] border border-[#e4e5e1] rounded-xl rounded-bl-sm"
                  }`}
                  style={
                    msg.role === "user"
                      ? { boxShadow: "0 1px 3px rgba(243,91,34,0.25)" }
                      : { boxShadow: "rgba(228,229,225,0.3) 0px 1px 0px 0px inset, rgba(110,111,109,0.1) 0px -1px 0px 0px inset" }
                  }
                >
                  <FormattedMarkdown
                    content={msg.text}
                    variant={msg.role === "user" ? "user" : "bot"}
                  />
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="w-6 h-6 rounded-md bg-[#ffcab5] flex items-center justify-center mr-2 mt-0.5 shrink-0">
                  <Sparkles className="w-3 h-3 text-[#d14200]" />
                </div>
                <div className="bg-[#ffffff] border border-[#e4e5e1] rounded-xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-[#b7b7b4] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-[#b7b7b4] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-[#b7b7b4] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Error Toast */}
            {error && (
              <div className="flex justify-center animate-fadeIn">
                <div className="bg-[#f67976]/10 border border-[#f67976]/30 text-[#be400f] rounded-lg px-3 py-2 text-xs text-center max-w-[85%]">
                  {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-[#e4e5e1] bg-[#ffffff] px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Tanya seputar REKA..."
                  maxLength={500}
                  disabled={isLoading}
                  className="w-full bg-[#fafaf8] border border-[#e4e5e1] rounded-lg px-3.5 py-2.5 text-[13px] text-[#141415] placeholder:text-[#b7b7b4] focus:outline-none focus:border-[#f35b22] focus:ring-1 focus:ring-[#f35b22]/20 transition-colors disabled:opacity-50"
                />
                {charCount > 400 && (
                  <span
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono ${
                      charCount >= 500 ? "text-[#f67976]" : "text-[#b7b7b4]"
                    }`}
                  >
                    {charCount}/500
                  </span>
                )}
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-lg bg-[#f35b22] text-white flex items-center justify-center shrink-0 hover:bg-[#ff5e24] disabled:opacity-40 disabled:hover:bg-[#f35b22] transition-colors"
                style={{ boxShadow: "rgba(255,255,255,0.2) 0px 1px 0px 0px inset, rgba(24,25,22,0.06) 0px 1px 2px 0px" }}
                aria-label="Kirim pesan"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-[#b7b7b4] text-center mt-1.5 font-mono">
              REKA AI · Hanya topik UMKM & kasir
            </p>
          </div>
        </div>
      </div>

      {/* FAB Button */}
      <button
        onClick={toggleOpen}
        className={`fixed bottom-4 right-4 sm:right-6 z-[60] w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group ${
          isOpen
            ? "bg-[#141415] rotate-0"
            : "bg-[#ffffff] border border-[#e4e5e1] hover:border-[#f35b22] hover:scale-105"
        }`}
        style={{
          boxShadow: isOpen
            ? "0 8px 24px rgba(20,20,21,0.3)"
            : "0 4px 16px rgba(20,20,21,0.1), 0 1px 3px rgba(20,20,21,0.06)",
        }}
        aria-label={isOpen ? "Tutup chat" : "Buka REKA Assistant"}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-[#f35b22] group-hover:scale-110 transition-transform" />
            {hasNewDot && (
              <span className="absolute top-2 right-2 w-3 h-3 bg-[#f35b22] rounded-full animate-pulse border-2 border-white" />
            )}
          </>
        )}
      </button>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>
    </>
  );
}
