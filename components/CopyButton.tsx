"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  compact?: boolean;
}

/**
 * 复制按钮。目标读者很多是第一次用这类工具，
 * 所以按下去要有明确的"已经复制走了"的反馈——
 * 反馈同时用图标、文字和颜色三重线索，不只靠变色。
 */
export default function CopyButton({
  text,
  label = "复制",
  copiedLabel = "已复制",
  className = "",
  compact = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // 老浏览器或者非 https 环境下的兜底写法
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
      } catch {
        // 实在复制不了就算了，用户还能手动选中
      }
      document.body.removeChild(area);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const base =
    "dn-focus dn-interactive inline-flex shrink-0 items-center justify-center gap-1.5 border font-semibold " +
    (compact ? "min-h-[44px] px-3 text-[11px] " : "min-h-[44px] px-4 text-xs ");

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      className={
        base +
        (copied
          ? "border-emerald bg-emerald text-on-color"
          : "border-edge-strong bg-surface text-text-primary hover:bg-surface-alt") +
        " " +
        className
      }
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {copied ? copiedLabel : label}
    </button>
  );
}
