"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Lightbulb, TriangleAlert, ChevronLeft, ChevronRight } from "lucide-react";
import {
  glossaryTerms,
  GLOSSARY_GROUPS,
  type GlossaryGroup,
  type GlossaryTerm,
} from "@/lib/glossary";

/**
 * 名词表。
 *
 * 68 个词铺成一整面卡片墙没法用，所以拆成「索引 + 详情抽屉」两层：
 * 索引只给词、英文名和分组，点开右侧抽屉看解释。
 *
 * 抽屉是可关闭的详情层：Escape 关闭、关闭后焦点回到刚才那一行、
 * 打开时不清空底下的列表也不改变滚动位置（只锁 body 滚动）。
 */
export default function GlossaryBrowser() {
  const [group, setGroup] = useState<GlossaryGroup | "all">("all");
  const [keyword, setKeyword] = useState("");
  const [openTerm, setOpenTerm] = useState<GlossaryTerm | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  const openIndex = openTerm ? list.findIndex((t) => t.term === openTerm.term) : -1;

  const close = useCallback(() => {
    setOpenTerm((current) => {
      // 焦点还给触发那一行；用 id 找，避免列表被筛掉后找不到
      if (current) {
        const trigger = document.getElementById("glossary-term-" + termSlug(current.term));
        trigger?.focus();
      }
      return null;
    });
  }, []);

  const move = useCallback(
    (delta: number) => {
      if (openIndex < 0) return;
      const next = list[openIndex + delta];
      if (next) setOpenTerm(next);
    },
    [list, openIndex],
  );

  // Escape 关闭；打开时锁住底层滚动，但底层列表保持挂载
  useEffect(() => {
    if (!openTerm) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openTerm, close]);

  const groupName = (id: GlossaryGroup) =>
    GLOSSARY_GROUPS.find((g) => g.id === id)?.name ?? id;

  const chip = (active: boolean) =>
    "dn-focus inline-flex min-h-[44px] items-center border px-3.5 text-xs font-semibold transition-colors " +
    (active
      ? "border-teal bg-teal text-on-color"
      : "border-edge-strong bg-surface text-text-primary hover:bg-surface-alt");

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="glossary-search" className="see-kicker block text-text-secondary">
          搜索
        </label>
        <div className="relative mt-2">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
            aria-hidden="true"
          />
          <input
            id="glossary-search"
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜一个你听到过但没听懂的名词，比如：token、幻觉、RAG"
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
        <p className="see-kicker text-text-secondary">按分组筛</p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="按分组筛选">
          <button type="button" onClick={() => setGroup("all")} aria-pressed={group === "all"} className={chip(group === "all")}>
            全部
          </button>
          {GLOSSARY_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              aria-pressed={group === g.id}
              title={g.hint}
              className={chip(group === g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <p className="border-t border-edge pt-4 text-sm tabular-nums text-text-secondary" role="status">
        共 {list.length} 个词。点开任意一个看解释。
      </p>

      {list.length === 0 ? (
        <div className="border border-edge bg-surface p-8 text-center">
          <p className="text-sm font-semibold">没找到这个词。</p>
          <p className="mx-auto mt-2 max-w-[46ch] text-xs leading-relaxed text-text-secondary">
            它可能只是别人随口造的营销词。听不懂的术语，直接问 AI「用大白话解释一下，举个生活里的例子」就行。
          </p>
        </div>
      ) : (
        <ul className="border-t border-edge">
          {list.map((t) => (
            <li key={t.term} className="border-b border-edge">
              <button
                id={"glossary-term-" + termSlug(t.term)}
                type="button"
                onClick={() => setOpenTerm(t)}
                className="dn-focus flex min-h-[64px] w-full items-center gap-4 px-3 py-3 text-left hover:bg-surface-alt sm:px-4"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className="font-display text-lg leading-none">{t.term}</span>
                    {t.en && (
                      <span className="font-mono text-[11px] text-text-secondary">{t.en}</span>
                    )}
                  </span>
                  <span className="mt-1.5 block truncate text-xs text-text-secondary">
                    {t.plain}
                  </span>
                </span>
                <span className="hidden shrink-0 bg-surface-raised px-2 py-1 text-[11px] text-text-primary sm:block">
                  {groupName(t.group)}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {openTerm && (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            aria-label="关闭词条详情"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-[var(--dn-overlay)]"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="glossary-detail-title"
            tabIndex={-1}
            className="dn-elevation-4 absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col bg-surface outline-none"
          >
            <div className="flex items-center justify-between gap-3 border-b border-edge px-4 py-3">
              <span className="see-kicker text-text-secondary">
                {groupName(openTerm.group)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  disabled={openIndex <= 0}
                  aria-label="上一个词"
                  className="dn-focus flex h-11 w-11 items-center justify-center border border-edge-strong text-text-primary disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  disabled={openIndex < 0 || openIndex >= list.length - 1}
                  aria-label="下一个词"
                  className="dn-focus flex h-11 w-11 items-center justify-center border border-edge-strong text-text-primary disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={close}
                  aria-label="关闭词条详情"
                  className="dn-focus ml-1 flex h-11 items-center gap-1.5 border border-edge-strong px-3 text-xs font-semibold"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  关闭
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
              <h2 id="glossary-detail-title" className="font-display text-3xl leading-tight">
                {openTerm.term}
              </h2>
              {openTerm.en && (
                <p className="mt-2 font-mono text-xs text-text-secondary">{openTerm.en}</p>
              )}

              <p className="mt-5 text-[15px] leading-relaxed">{openTerm.plain}</p>

              <div className="mt-5 flex gap-3 bg-teal-tint p-4">
                <Lightbulb className="h-4 w-4 shrink-0 text-teal-ink" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-teal-ink">生活里的比方</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-primary">
                    {openTerm.analogy}
                  </p>
                </div>
              </div>

              {openTerm.watchOut && (
                <div className="mt-3 flex gap-3 bg-amber-tint p-4">
                  <TriangleAlert className="h-4 w-4 shrink-0 text-amber-ink" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold text-amber-ink">最容易踩的坑</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-primary">
                      {openTerm.watchOut}
                    </p>
                  </div>
                </div>
              )}

              <p className="mt-6 text-xs leading-relaxed text-text-secondary">
                按 Escape 或点「关闭」回到列表，会回到你刚才点开的那一行。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** DOM id 里不能直接用中文标点和空格，统一转成稳定 slug */
function termSlug(term: string): string {
  return term.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "-");
}
