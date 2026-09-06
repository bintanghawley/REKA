"use client";

import React from "react";

interface FormattedMarkdownProps {
  content: string;
  variant?: "bot" | "user" | "dark";
  className?: string;
}

/**
 * Helper untuk mem-parsing token inline seperti:
 * - Bold: **teks** atau __teks__
 * - Italic: *teks* atau _teks_
 * - Bold Italic: ***teks*** atau ___teks___
 * - Code: `kode`
 */
function parseInline(text: string, variant: "bot" | "user" | "dark"): React.ReactNode[] {
  // Regex untuk mencocokkan pola formatting markdown inline
  const regex = /(\*\*\*[^*]+?\*\*\*|\*\*[^*]+?\*\*|\*[^*]+?\*|___[^_]+?___|__[^_]+?__|_[^_]+?_|`[^`]+?`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold + Italic: ***teks*** atau ___teks___
    if (
      (part.startsWith("***") && part.endsWith("***") && part.length > 6) ||
      (part.startsWith("___") && part.endsWith("___") && part.length > 6)
    ) {
      const inner = part.slice(3, -3);
      const colorClass =
        variant === "user" ? "text-white" : variant === "dark" ? "text-white" : "text-[#141415]";
      return (
        <strong key={index} className={`font-semibold italic ${colorClass}`}>
          {inner}
        </strong>
      );
    }

    // Bold: **teks** atau __teks__
    if (
      (part.startsWith("**") && part.endsWith("**") && part.length > 4) ||
      (part.startsWith("__") && part.endsWith("__") && part.length > 4)
    ) {
      const inner = part.slice(2, -2);
      const colorClass =
        variant === "user" ? "text-white" : variant === "dark" ? "text-white font-bold" : "text-[#141415] font-semibold";
      return (
        <strong key={index} className={colorClass}>
          {inner}
        </strong>
      );
    }

    // Italic: *teks* atau _teks_
    if (
      (part.startsWith("*") && part.endsWith("*") && part.length > 2) ||
      (part.startsWith("_") && part.endsWith("_") && part.length > 2)
    ) {
      const inner = part.slice(1, -1);
      return (
        <em key={index} className="italic font-normal">
          {inner}
        </em>
      );
    }

    // Inline Code: `teks`
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      const inner = part.slice(1, -1);
      const codeStyle =
        variant === "user"
          ? "bg-white/20 text-white"
          : variant === "dark"
          ? "bg-[#2e2e2c] text-[#88d2c3] border border-[#454542]"
          : "bg-[#f0f0ef] text-[#f35b22] border border-[#e4e5e1]";
      return (
        <code key={index} className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${codeStyle}`}>
          {inner}
        </code>
      );
    }

    return part;
  });
}

/**
 * Komponen FormattedMarkdown
 * Merender format teks markdown (bold, italic, lists, paragraphs)
 * secara native tanpa raw symbols (seperti ** atau *) dan tanpa dangerouslySetInnerHTML.
 */
export function FormattedMarkdown({
  content,
  variant = "bot",
  className = "",
}: FormattedMarkdownProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;
  let paragraphLines: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      elements.push(
        <p key={`p-${elements.length}`} className="my-1.5 first:mt-0 last:mb-0 leading-relaxed">
          {paragraphLines.map((line, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <br />}
              {parseInline(line, variant)}
            </React.Fragment>
          ))}
        </p>
      );
      paragraphLines = [];
    }
  };

  const flushList = () => {
    if (currentList && currentList.items.length > 0) {
      const ListTag = currentList.type;
      const listClass =
        currentList.type === "ul"
          ? "list-disc list-outside ml-4 my-1.5 space-y-1"
          : "list-decimal list-outside ml-4 my-1.5 space-y-1";

      elements.push(
        <ListTag key={`list-${elements.length}`} className={listClass}>
          {currentList.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {parseInline(item, variant)}
            </li>
          ))}
        </ListTag>
      );
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Baris kosong -> pisahkan paragraf/list
    if (trimmed === "") {
      flushList();
      flushParagraph();
      continue;
    }

    // Deteksi unordered list: "- " atau "* "
    const bulletMatch = rawLine.match(/^(\s*)[-*]\s+(.+)$/);
    if (bulletMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(bulletMatch[2]);
      continue;
    }

    // Deteksi ordered list: "1. ", "2. "
    const numberMatch = rawLine.match(/^(\s*)\d+\.\s+(.+)$/);
    if (numberMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(numberMatch[2]);
      continue;
    }

    // Baris teks biasa
    flushList();
    paragraphLines.push(rawLine);
  }

  flushList();
  flushParagraph();

  return <div className={`break-words ${className}`}>{elements}</div>;
}
