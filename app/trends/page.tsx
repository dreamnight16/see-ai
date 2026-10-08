import type { Metadata } from "next";
import Link from "next/link";
import { TriangleAlert, ArrowUpRight, BookMarked, Info } from "lucide-react";
import { loadTrendReport, getSourceNames, isStale } from "@/lib/trends";
import ToolHeader from "@/components/shell/ToolHeader";

export const metadata: Metadata = {
  title: "本周热词 | 见 AI",
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

  if (report === null) {
    return (
      <div>
        <ToolHeader
          kicker="每周热词 · 由定时任务生成"
          title="还没有可读的报告"
          lead="这个页面读的是仓库里的 data/trends/latest.json。那份文件由每周定时任务生成并提交回仓库，此刻还没有。"
          field="bg-amber text-on-color"
          facts={[
            { value: "—", label: "本周条目：无数据" },
            { value: "—", label: "候选词：无数据" },
          ]}
          footnote="没有数据时页面就明说没有，不显示任何占位统计或示例数字。"
        />
        <div className="mx-auto max-w-[var(--see-shell)] px-[var(--see-gutter)] py-10">
          <div className="border border-edge bg-surface p-6">
            <h2 className="font-display text-xl">在项目根目录跑一次下面的命令就有了</h2>
            <pre className="see-code mt-4 overflow-x-auto p-4 font-mono text-xs">
              <code>python scripts/trends/crawl.py</code>
            </pre>
            <p className="mt-4 max-w-[62ch] text-xs leading-relaxed text-text-secondary">
              爬虫只产出「候选词 + 出现次数 + 出处链接」，不写解释。
              名词表里的每条解释仍然由人写完再上线。
            </p>
          </div>
        </div>
      </div>
    );
  }

  const weekParts = report.week.split("-W");
  const year = weekParts[0];
  const weekNo = Number(weekParts[1]);
  const stale = isStale(report);
  const sources = getSourceNames(report);
  const needWriting = report.watchlist.filter((w) => !w.inGlossary);

  return (
    <div>
      <ToolHeader
        kicker="每周热词 · 机器抓的，没有解释"
        title="这周有人在说的新词，先摆出来"
        lead="每周自动扫一遍 AI 圈的论文、模型和热榜，把反复出现的说法挑出来。这里只放候选词和出处，不放解释——解释一律由人写，机器写的没人核对过，放上来是给你添乱。"
        field="bg-amber text-on-color"
        facts={[
          { value: String(report.candidates.length), label: "个新候选词" },
          { value: String(report.stats.aiItems), label: "条筛出的 AI 条目" },
          { value: year + " W" + weekNo, label: "报告周期" },
        ]}
        footnote={`报告生成于 ${formatTime(report.generatedAt)}，共扫描 ${report.stats.totalItems} 条。这些都是机器统计，不是人确认过的事实。`}
      />

      <div className="mx-auto max-w-[var(--see-shell)] px-[var(--see-gutter)] py-8">
        {/* 数据来源与健康度 */}
        <section className="card p-5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <h2 className="see-kicker text-text-secondary">这一轮的数据源</h2>
            {stale && (
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-ink">
                <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
                这份报告超过两周了，定时任务可能没跑
              </p>
            )}
          </div>

          <ul className="mt-3 flex flex-wrap gap-2">
            {sources.map((name) => (
              <li
                key={name}
                className="inline-flex min-h-[36px] items-center gap-2 bg-surface-raised px-3 text-xs text-text-primary"
              >
                {name}
                <span className="tabular-nums font-semibold">
                  {report.stats.sourceCounts[name]}
                </span>
              </li>
            ))}
          </ul>

          {report.stats.failedSources.length > 0 && (
            <p className="mt-3 border-l-4 border-crimson bg-crimson-tint p-3 text-xs leading-relaxed text-text-primary">
              <span className="font-semibold text-crimson-ink">这一轮没抓到：</span>
              {report.stats.failedSources.join("、")}。少几个源不影响结论，但下面这些词可能因此偏少。
            </p>
          )}
        </section>

        {/* 该写解释了 */}
        {needWriting.length > 0 && (
          <section className="mt-[var(--see-section)]">
            <header className="max-w-[62ch]">
              <p className="see-kicker text-amber-ink">待办</p>
              <h2 className="font-display mt-3 text-[clamp(1.5rem,3vw,2.1rem)] leading-tight">
                这些词该写进名词表了
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                我们盯的几个说法里，这几个已经出现在正文里，但名词表还没收。
              </p>
            </header>

            <ul className="mt-6 grid gap-[3px] md:grid-cols-2">
              {needWriting.map((entry, i) => (
                <li
                  key={entry.term}
                  className="dn-rise card p-5"
                  style={{ ["--dn-enter-index" as string]: Math.min(i, 10) }}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl leading-tight">{entry.term}</h3>
                    <span className="shrink-0 text-xs tabular-nums text-text-secondary">
                      这周 {entry.hits} 次
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-text-secondary">
                    {entry.sources.join("、")}
                  </p>
                  <ul className="mt-3 border-t border-edge">
                    {entry.samples.map((sample) => (
                      <li key={sample.url} className="border-b border-edge last:border-b-0">
                        <a
                          href={sample.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dn-focus flex min-h-[44px] items-start gap-2 py-2.5 text-xs leading-relaxed text-text-primary hover:bg-surface-alt"
                        >
                          <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-ink" aria-hidden="true" />
                          <span>{sample.title}</span>
                          <span className="sr-only">（在新标签页打开原文）</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 机器抽出来的新词 */}
        <section className="mt-[var(--see-section)]">
          <header className="max-w-[62ch]">
            <p className="see-kicker text-amber-ink">机器抽的</p>
            <h2 className="font-display mt-3 text-[clamp(1.5rem,3vw,2.1rem)] leading-tight">
              这周冒出来的新词
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              从论文和热榜标题里自动抠出来的缩写和专名。名词表里还没有它们的解释。
              看到眼熟的，点进去翻一眼原文就知道了；没兴趣的直接跳过，不影响学课。
            </p>
          </header>

          {report.candidates.length === 0 ? (
            <p className="mt-6 border border-edge bg-surface p-6 text-center text-sm text-text-secondary">
              这周没抽到新词。没有就是没有，不补占位内容。
            </p>
          ) : (
            <ul className="mt-6 grid gap-[3px] sm:grid-cols-2 lg:grid-cols-3">
              {report.candidates.map((c, i) => (
                <li
                  key={c.term}
                  className="dn-rise flex flex-col bg-amber p-4 text-on-color"
                  style={{ ["--dn-enter-index" as string]: Math.min(i, 14) }}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl leading-tight">{c.term}</h3>
                    <span className="shrink-0 text-xs tabular-nums">{c.hits} 次</span>
                  </div>
                  <p className="mt-2 text-[11px]">
                    {c.sources.join("、")} · 首次 {c.firstSeen}
                  </p>
                  <a
                    href={c.sampleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dn-focus mt-3 flex flex-1 items-start gap-1.5 border-t-2 border-[var(--dn-ink-primary)] pt-2.5 text-[11px] leading-relaxed"
                  >
                    <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                    <span className="line-clamp-3">{c.sampleTitle}</span>
                    <span className="sr-only">（在新标签页打开原文）</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 名词表里已有但很热 */}
        {report.knownCandidates.length > 0 && (
          <section className="mt-[var(--see-section)]">
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.1rem)] leading-tight">
              名词表里已经有了，但这周很热
            </h2>
            <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-text-secondary">
              这些词你在名词表里查得到解释。
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {report.knownCandidates.map((c) => (
                <li key={c.term}>
                  <Link
                    href="/glossary"
                    className="dn-focus inline-flex min-h-[44px] items-center gap-2 border border-edge-strong bg-surface px-3.5 text-sm text-text-primary hover:bg-surface-alt"
                  >
                    {c.term}
                    <span className="text-[11px] tabular-nums text-text-secondary">{c.hits}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 条目 */}
        <section className="mt-[var(--see-section)]">
          <h2 className="font-display text-[clamp(1.5rem,3vw,2.1rem)] leading-tight">
            这周筛出来的 AI 条目
          </h2>
          <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-text-secondary">
            判断标准是标题里出现了 AI 关键词。原样列出，没有排序偏好，也没有摘要。
          </p>
          <ul className="mt-5 border-t border-edge">
            {report.items.map((item) => (
              <li key={item.url} className="border-b border-edge">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dn-focus flex min-h-[52px] items-start gap-3 py-3 hover:bg-surface-alt"
                >
                  <span className="mt-0.5 shrink-0 bg-surface-raised px-2 py-0.5 text-[11px] text-text-primary">
                    {item.source}
                  </span>
                  <span className="min-w-0 flex-1 text-sm leading-relaxed text-text-primary">
                    {item.title}
                  </span>
                  <span className="sr-only">（在新标签页打开原文）</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-[var(--see-section)] flex max-w-[68ch] items-start gap-3 border-l-4 border-cyan bg-cyan-tint p-5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-ink" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-text-primary">
            <BookMarked className="mr-1 inline h-3.5 w-3.5 align-[-2px] text-cyan-ink" aria-hidden="true" />
            这是个信号板，不是课程。候选词只代表「这周有人在说」，不代表「它是个值得学的东西」。
            真正沉淀下来的解释在{" "}
            <Link href="/glossary" className="see-link">名词表</Link>
            ，想系统学一条主线的话，回{" "}
            <Link href="/" className="see-link">课程表</Link>
            挑一条轨道。
          </p>
        </div>
      </div>
    </div>
  );
}
