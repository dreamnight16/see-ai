"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  promptTemplates,
  PROMPT_CATEGORIES,
  type PromptCategory,
} from "@/lib/prompt-library";
import CopyButton from "@/components/CopyButton";

/**
 * 提示词库。
 *
 * 筛选栏用直角分段按钮，选中态是实色块 + 字重变化，不靠颜色单独区分。
 * 每条话术直接铺在页面上，不做二次折叠——用户来这儿就是要复制的。
 */
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

  const chip = (active: boolean) =>
    "dn-focus inline-flex min-h-[44px] items-center border px-3.5 text-xs font-semibold transition-colors " +
    (active
      ? "border-violet bg-violet text-on-color"
      : "border-edge-strong bg-surface text-text-primary hover:bg-surface-alt");

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="prompt-search" className="see-kicker block text-text-secondary">
          搜索
        </label>
        <div className="relative mt-2">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
            aria-hidden="true"
          />
          <input
            id="prompt-search"
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜一下你的事，比如：请假、表格、翻译、海报"
            className="min-h-[52px] w-full border border-edge-strong bg-surface pl-11 pr-14 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-teal"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword("")}
              aria-label="清空搜索"
              className="dn-focus absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-text-secondary hover:text-text-primary"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="see-kicker text-text-secondary">按场景筛</p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="按分类筛选">
          <button type="button" onClick={() => setCategory("all")} aria-pressed={category === "all"} className={chip(category === "all")}>
            全部
          </button>
          {PROMPT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              aria-pressed={category === c.id}
              title={c.hint}
              className={chip(category === c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <p className="border-t border-edge pt-4 text-sm tabular-nums text-text-secondary" role="status">
        共 {list.length} 条。带【】的地方是你要替换成自己情况的部分。
      </p>

      {list.length === 0 ? (
        <div className="border border-edge bg-surface p-8 text-center">
          <p className="text-sm font-semibold">没找到合适的那条。</p>
          <p className="mx-auto mt-2 max-w-[46ch] text-xs leading-relaxed text-text-secondary">
            换个词试试，或者去练习场自己写一条，写完会有人给你挑毛病。
          </p>
        </div>
      ) : (
        <div className="grid gap-[3px] md:grid-cols-2">
          {list.map((t) => (
            <article
              key={t.id}
              className="card flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 border-b border-edge px-4 py-3">
                <div className="min-w-0">
                  <h3 className="font-display text-base leading-snug">{t.title}</h3>
                  <p className="mt-1 text-xs text-text-secondary">{t.scene}</p>
                </div>
                <CopyButton text={t.prompt} compact />
              </div>

              <pre className="flex-1 whitespace-pre-wrap bg-canvas px-4 py-3.5 font-sans text-[13px] leading-relaxed text-text-primary">
                {t.prompt}
              </pre>

              {t.tip && (
                <p className="border-t border-edge bg-violet-tint px-4 py-3 text-xs leading-relaxed text-text-primary">
                  <span className="font-semibold">再改一步：</span>
                  {t.tip}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
