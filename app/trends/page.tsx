import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronLeft,
  RefreshCw,
  TriangleAlert,
  ArrowUpRight,
  BookMarked,
  Rss,
  Info,
} from "lucide-react";
import { loadTrendReport, getSourceNames, isStale } from "@/lib/trends";

export const metadata: Metadata = {
  title: "本周热词 | 梦夜的 AI 课",
  description:
    "每周自动抓一次 AI 圈的新说法，只放候选词和出处，不放机器写的解释。看到感兴趣的，自己点进原文看一眼。",
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

export default function TrendsPage() {
  const report = loadTrendReport();

  return (
    <div className="max-w-[1000px] mx-auto px-6 pt-14 pb-section">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors mb-8"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        回到课程首页
      </Link>

      <header className="mb-8">
        <div className="decorative-line mb-4" />
        <h1 className="font-display text-4xl md:text-5xl font-black leading-tight mb-4">
          本周热词
        </h1>
        <p className="text-lg text-muted max-w-2xl leading-relaxed">
          每周自动扫一遍 AI 圈的论文、模型和热榜，把反复出现的说法挑出来。
          这里只放候选词和出处，不放解释——解释一律由人写，机器写的没人核对过，放上来是给你添乱。
        </p>
      </header>

      {report === null ? (
        <div className="card p-8 text-center">
          <RefreshCw className="w-8 h-8 text-faint mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">还没有报告</h2>
          <p className="text-sm text-muted max-w-md mx-auto leading-relaxed mb-4">
            这个页面读的是 data/trends/latest.json，仓库里还没有这个文件。
            在项目根目录跑一次下面的命令就有了：
          </p>
          <code className="inline-block px-4 py-2.5 rounded-xl bg-surface-alt border border-edge text-xs font-mono">
            python scripts/trends/crawl.py
          </code>
        </div>
      ) : (
        <>
          {/* 概况 */}
          <div className="card p-5 mb-8">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-8 h-8 rounded-lg bg-accent-soft text-accent flex items-center justify-center text-xs font-bold">
                  {report.week.split("-W")[1]}
                </span>
                <span className="text-muted">{report.week.split("-W")[0]} 年第 {Number(report.week.split("-W")[1])} 周</span>
              </span>
              <span className="text-faint">
                更新于 {formatTime(report.generatedAt)}
              </span>
              <span className="text-faint">
                扫了 {report.stats.totalItems} 条，筛出 AI 相关 {report.stats.aiItems} 条
              </span>
              {isStale(report) && (
                <span className="inline-flex items-center gap-1.5 text-warning text-xs">
                  <TriangleAlert className="w-3.5 h-3.5" />
                  这份报告有点旧了，定时任务可能没跑
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {getSourceNames(report).map((name) => (
                <span
                  key={name}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-surface-alt border border-edge text-muted"
                >
                  {name}
                  <span className="text-faint ml-1.5 tabular-nums">
                    {report.stats.sourceCounts[name]}
                  </span>
                </span>
              ))}
            </div>

            {report.stats.failedSources.length > 0 && (
              <p className="mt-3 text-xs text-warning leading-relaxed">
                这一轮没抓到的源：{report.stats.failedSources.join("、")}。
                少几个源不影响结论，但下面这些词可能因此偏少。
              </p>
            )}
          </div>

          {/* 该写解释了 */}
          {report.watchlist.filter((w) => !w.inGlossary).length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-8 h-8 rounded-lg bg-warning-soft flex items-center justify-center">
                  <BookMarked className="w-4 h-4 text-warning" />
                </span>
                <h2 className="font-display text-xl font-bold">这些词该写进名词表了</h2>
              </div>
              <p className="text-sm text-muted mb-5 leading-relaxed">
                我们盯的几个说法里，这几个已经出现在正文里，但名词表还没收。
              </p>
              <div className="space-y-4">
                {report.watchlist
                  .filter((w) => !w.inGlossary)
                  .map((entry) => (
                    <div key={entry.term} className="card p-5">
                      <div className="flex items-center gap-2.5 mb-3">
                        <h3 className="font-display text-lg font-bold">{entry.term}</h3>
                        <span className="text-[11px] text-faint">
                          这周出现 {entry.hits} 次 · {entry.sources.join("、")}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {entry.samples.map((sample) => (
                          <li key={sample.url}>
                            <a
                              href={sample.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-2 text-xs text-muted hover:text-accent transition-colors leading-relaxed"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              <span>{sample.title}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* 机器抽出来的新词 */}
          <section className="mb-12">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
                <Rss className="w-4 h-4 text-accent" />
              </span>
              <h2 className="font-display text-xl font-bold">
                这周冒出来的新词
              </h2>
            </div>
            <p className="text-sm text-muted mb-5 leading-relaxed">
              从论文和热榜标题里自动抠出来的缩写和专名。名词表里还没有它们的解释。
              看到眼熟的，点进去翻一眼原文就知道了；没兴趣的直接跳过，不影响学课。
            </p>

            {report.candidates.length === 0 ? (
              <div className="card p-6 text-center text-sm text-muted">
                这周没抽到新词。
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {report.candidates.map((c) => (
                  <div key={c.term} className="card p-4">
                    <div className="flex items-baseline justify-between gap-2 mb-1.5">
                      <h3 className="font-display font-bold">{c.term}</h3>
                      <span className="text-[10px] text-faint tabular-nums">
                        {c.hits} 次
                      </span>
                    </div>
                    <p className="text-[11px] text-faint mb-2.5">
                      {c.sources.join("、")} · 首次 {c.firstSeen}
                    </p>
                    <a
                      href={c.sampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-1.5 text-[11px] text-muted hover:text-accent transition-colors leading-relaxed"
                    >
                      <ArrowUpRight className="w-3 h-3 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{c.sampleTitle}</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 名词表里已有但很热 */}
          {report.knownCandidates.length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-xl font-bold mb-2">
                名词表里已经有了，但这周很热
              </h2>
              <p className="text-sm text-muted mb-4 leading-relaxed">
                这些词你在名词表里查得到解释。
              </p>
              <div className="flex flex-wrap gap-2">
                {report.knownCandidates.map((c) => (
                  <Link
                    key={c.term}
                    href="/glossary"
                    className="inline-flex items-baseline gap-2 px-3.5 py-2 rounded-xl border border-edge bg-surface-alt text-sm text-muted hover:text-accent hover:border-accent/30 transition-all"
                  >
                    {c.term}
                    <span className="text-[10px] text-faint tabular-nums">{c.hits}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 条目 */}
          <section>
            <h2 className="font-display text-xl font-bold mb-2">这周筛出来的 AI 条目</h2>
            <p className="text-sm text-muted mb-5 leading-relaxed">
              判断标准是标题里出现了 AI 关键词。原样列出，没有排序偏好，也没有摘要。
            </p>
            <ul className="space-y-2">
              {report.items.map((item) => (
                <li key={item.url}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent-soft/40 transition-colors group"
                  >
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-raised text-faint shrink-0 mt-0.5 whitespace-nowrap">
                      {item.source}
                    </span>
                    <span className="text-sm text-muted group-hover:text-accent transition-colors leading-relaxed min-w-0">
                      {item.title}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-12 flex items-start gap-3 p-5 rounded-xl bg-info-soft/60 border border-info/20">
            <Info className="w-4 h-4 text-info shrink-0 mt-0.5" />
            <p className="text-xs text-muted leading-relaxed">
              这是个信号板，不是课程。候选词只代表「这周有人在说」，不代表「它是个值得学的东西」。
              真正沉淀下来的解释在{" "}
              <Link href="/glossary" className="text-accent hover:underline">
                名词表
              </Link>
              ，想系统学一条主线的话，回{" "}
              <Link href="/" className="text-accent hover:underline">
                课程表
              </Link>
              挑一条轨道。
            </p>
          </div>
        </>
      )}
    </div>
  );
}
