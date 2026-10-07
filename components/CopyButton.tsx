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
 * 所以按下去要有明确的"已经复制走了"的反馈。
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

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      className={
        "inline-flex items-center gap-1.5 rounded-lg border transition-all duration-200 shrink-0 " +
        (compact ? "px-2.5 py-1 text-[11px] " : "px-3.5 py-2 text-xs ") +
        (copied
          ? "border-success/40 bg-success-soft text-success"
          : "border-edge bg-surface-alt text-muted hover:text-accent hover:border-accent/40") +
        " " +
        className
      }
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? copiedLabel : label}
    </button>
  );
}
