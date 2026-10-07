"use client";

import { useMemo, useState } from "react";
import { Search, X, Lightbulb, TriangleAlert } from "lucide-react";
import {
  glossaryTerms,
  GLOSSARY_GROUPS,
  type GlossaryGroup,
} from "@/lib/glossary";

export default function GlossaryBrowser() {
  const [group, setGroup] = useState<GlossaryGroup | "all">("all");
  const [keyword, setKeyword] = useState("");

  const list = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return glossaryTerms.filter((t) => {
      if (group !== "all" && t.group !== group) return false;
      if (!q) return true;
      return (
        t.term.toLowerCase().includes(q) ||
        (t.en ?? "").toLowerCase().includes(q) ||
        t.plain.toLowerCase().includes(q)
      );
    });
  }, [group, keyword]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="w-4 h-4 text-faint absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜一个你听到过但没听懂的名词，比如：token、幻觉、RAG"
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

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setGroup("all")}
          className={
            "px-3.5 py-2 rounded-xl border text-xs transition-all " +
            (group === "all"
              ? "border-accent/40 bg-accent-soft text-accent font-semibold"
              : "border-edge bg-surface-alt text-muted hover:text-accent hover:border-accent/30")
          }
        >
          全部
        </button>
        {GLOSSARY_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setGroup(g.id)}
            title={g.hint}
            className={
              "px-3.5 py-2 rounded-xl border text-xs transition-all " +
              (group === g.id
                ? "border-accent/40 bg-accent-soft text-accent font-semibold"
                : "border-edge bg-surface-alt text-muted hover:text-accent hover:border-accent/30")
            }
          >
            {g.name}
          </button>
        ))}
      </div>

      <p className="text-xs text-faint">共 {list.length} 个词。</p>

      {list.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm text-muted">没找到这个词。</p>
          <p className="text-xs text-faint mt-2">
            它可能只是别人随口造的营销词。听不懂的术语，直接问 AI「用大白话解释一下，举个生活里的例子」就行。
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((t) => (
            <article key={t.term} className="card p-5">
              <div className="flex flex-wrap items-baseline gap-2 mb-2.5">
                <h3 className="font-display text-lg font-bold">{t.term}</h3>
                {t.en && <span className="text-xs text-faint">{t.en}</span>}
              </div>

              <p className="text-sm leading-relaxed">{t.plain}</p>

              <div className="mt-3 flex gap-2.5 p-3.5 rounded-xl bg-accent-soft/60 border border-accent/15">
                <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-muted">{t.analogy}</p>
              </div>

              {t.watchOut && (
                <div className="mt-2.5 flex gap-2.5 p-3.5 rounded-xl bg-warning-soft/60 border border-warning/20">
                  <TriangleAlert className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed text-muted">{t.watchOut}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
