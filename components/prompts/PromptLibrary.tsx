"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  promptTemplates,
  PROMPT_CATEGORIES,
  type PromptCategory,
} from "@/lib/prompt-library";
import CopyButton from "@/components/CopyButton";

export default function PromptLibrary() {
  const [category, setCategory] = useState<PromptCategory | "all">("all");
  const [keyword, setKeyword] = useState("");

  const list = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return promptTemplates.filter((t) => {
      if (category !== "all" && t.category !== category) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.scene.toLowerCase().includes(q) ||
        t.prompt.toLowerCase().includes(q)
      );
    });
  }, [category, keyword]);

  return (
    <div className="space-y-6">
      {/* 搜索 */}
      <div className="relative">
        <Search className="w-4 h-4 text-faint absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜一下你的事，比如：请假、表格、翻译、海报"
          className="w-full rounded-xl border border-edge bg-surface-alt pl-11 pr-11 py-3.5 text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
        />
        {keyword && (
          <button
            type="button"
            onClick={() => setKeyword("")}
            aria-label="清空搜索"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-faint hover:text-accent"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 分类 */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={
            "px-3.5 py-2 rounded-xl border text-xs transition-all " +
            (category === "all"
              ? "border-accent/40 bg-accent-soft text-accent font-semibold"
              : "border-edge bg-surface-alt text-muted hover:text-accent hover:border-accent/30")
          }
        >
          全部
        </button>
        {PROMPT_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            title={c.hint}
            className={
              "px-3.5 py-2 rounded-xl border text-xs transition-all " +
              (category === c.id
                ? "border-accent/40 bg-accent-soft text-accent font-semibold"
                : "border-edge bg-surface-alt text-muted hover:text-accent hover:border-accent/30")
            }
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="text-xs text-faint">
        共 {list.length} 条。带【】的地方是你要替换成自己情况的部分。
      </p>

      {/* 列表 */}
      {list.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm text-muted">没找到合适的那条。</p>
          <p className="text-xs text-faint mt-2">
            换个词试试，或者去练习场自己写一条，写完会有人给你挑毛病。
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((t) => (
            <article key={t.id} className="card p-5 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h3 className="font-display font-bold leading-snug">{t.title}</h3>
                <CopyButton text={t.prompt} compact />
              </div>
              <p className="text-xs text-muted mb-4">{t.scene}</p>

              <pre className="flex-1 rounded-xl border border-edge bg-surface-alt p-3.5 text-xs leading-relaxed whitespace-pre-wrap font-sans text-muted">
                {t.prompt}
              </pre>

              {t.tip && (
                <p className="mt-3 text-[11px] leading-relaxed text-accent flex gap-1.5">
                  <span className="shrink-0 font-semibold">再改一步：</span>
                  <span>{t.tip}</span>
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
