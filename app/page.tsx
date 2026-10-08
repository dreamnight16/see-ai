import Link from "next/link";
import {
  lessons,
  totalLessons,
  totalMinutes,
  getLessonsGroupedByTrack,
  getLessonsByTrack,
} from "@/lib/lessons";
import { tracks, getTrack } from "@/lib/tracks";
import { glossaryTerms } from "@/lib/glossary";
import { promptTemplates } from "@/lib/prompt-library";
import { practiceScenarios } from "@/lib/practice-scenarios";
import { quizzes } from "@/lib/quiz-data";
import { BADGES } from "@/lib/achievements";
import { ArrowRight, Clock, WifiOff, Compass, BookOpen, Code } from "lucide-react";
import TotalProgress from "@/components/TotalProgress";
import Recommendations from "@/components/learning/Recommendations";
import TrackCard, { TrackRow } from "@/components/TrackCard";
import DailyTask from "@/components/DailyTask";
import { trackVisual } from "@/components/track-visuals";

/**
 * 首页 = 课程地图。
 *
 * 版式刻意不对称：左边是主张，右边是一面「数字色块墙」——
 * 墙上的每一个数字都直接来自课程数据（轨道数、课程数、提示词条数…），
 * 没有写死、也没有编造的学习时长或用户数。
 * 所有数字后面都跟着单位和一个真实入口，色块本身就是导航。
 */
const FACTS = [
  {
    href: "#tracks",
    value: String(tracks.length),
    unit: "条轨道",
    label: "哪条像你现在最头疼的事，就从那条开始",
    field: "bg-teal text-on-color",
  },
  {
    href: "/prompts",
    value: String(promptTemplates.length),
    unit: "条提示词",
    label: "带【】的地方换成你的情况，复制走",
    field: "bg-violet text-on-color",
  },
  {
    href: "/practice",
    value: String(practiceScenarios.length),
    unit: "个练习场景",
    label: "自己写一遍，本地规则立刻指出漏了什么",
    field: "bg-emerald text-on-color",
  },
  {
    href: "/glossary",
    value: String(glossaryTerms.length),
    unit: "个名词",
    label: "每个都配了生活里的比方和一处坑",
    field: "bg-amber text-on-color",
  },
] as const;

export default function Home() {
  const grouped = getLessonsGroupedByTrack();
  const hours = Math.round(totalMinutes / 60);
  const featured = tracks.filter((t) => t.featured);
  const rest = tracks.filter((t) => !t.featured);
  const quizCount = Object.keys(quizzes).length;

  return (
    <div>
      {/* ── 主张 + 数字色块墙 ─────────────────────────────────────────────── */}
      <section className="border-b border-edge">
        <div className="mx-auto grid max-w-[var(--see-shell)] gap-10 px-[var(--see-gutter)] py-[var(--see-section)] lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="see-kicker text-teal-ink">
              AI 入门课 · 不配 API Key 也能学完
            </p>

            <h1 className="font-display mt-5 text-[clamp(2.1rem,5.4vw,3.6rem)] leading-[1.08]">
              你手机里的豆包，
              <br />
              不该只用来聊天
            </h1>

            <p className="mt-6 max-w-[54ch] text-[17px] leading-relaxed text-text-secondary">
              这套课不讲模型原理，也不要求你会编程。它只解决一件事：让只会跟 AI
              闲聊的人，第一次真正用它把一件正事干完——作业、论文、汇报、简历、社团、四六级。
              后面还会讲到智能体这些新东西，以及怎么分辨真技术和炒作。
            </p>

            <div className="mt-8 flex flex-wrap items-stretch gap-3">
              <Link
                href="/start"
                className="dn-focus dn-interactive inline-flex min-h-[52px] items-center gap-2.5 bg-teal px-6 text-base font-semibold text-on-color"
              >
                <Compass className="h-5 w-5" aria-hidden="true" />
                四道题，排个顺序
              </Link>
              <Link
                href={"/lesson/" + lessons[0].id}
                className="dn-focus dn-interactive inline-flex min-h-[52px] items-center gap-2.5 border border-edge-strong px-6 text-base font-semibold text-text-primary hover:bg-surface-alt"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                直接从第一课开始
              </Link>
            </div>

            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                <dt className="sr-only">总时长</dt>
                <dd className="tabular-nums text-text-secondary">
                  全部学完约 {hours} 小时
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <WifiOff className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                <dt className="sr-only">离线可用性</dt>
                <dd className="text-text-secondary">课程、练习、名词表都不联网</dd>
              </div>
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                <dt className="sr-only">编程轨道</dt>
                <dd className="text-text-secondary">AI 编程只是其中一条轨道</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-[3px]">
              <Link
                href="#catalog"
                className="dn-focus dn-interactive col-span-2 flex min-h-[132px] flex-col justify-between bg-cyan p-5 text-on-color"
              >
                <span className="see-kicker">完整课程表</span>
                <span className="flex items-end gap-2">
                  <span className="font-display text-[3.25rem] leading-none tabular-nums">
                    {totalLessons}
                  </span>
                  <span className="pb-1 text-base font-semibold">节课</span>
                </span>
                <span className="text-xs">
                  {quizCount} 套章节测验 · {BADGES.length} 个徽章 · 全部有正文和前置关系
                </span>
              </Link>

              {FACTS.map((fact) => (
                <Link
                  key={fact.href}
                  href={fact.href}
                  className={
                    "dn-focus dn-interactive flex min-h-[168px] flex-col justify-between p-4 " +
                    fact.field
                  }
                >
                  <span className="flex items-end gap-1.5">
                    <span className="font-display text-[2.5rem] leading-none tabular-nums">
                      {fact.value}
                    </span>
                    <span className="pb-0.5 text-sm font-semibold">{fact.unit}</span>
                  </span>
                  <span className="text-[11px] leading-snug">{fact.label}</span>
                </Link>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-text-secondary">
              以上数字全部来自仓库里的课程数据，页面不展示任何没有来源的实时统计。
            </p>
          </div>
        </div>
      </section>

      {/* ── 你的进度 + 今天可以试的一件事 ──────────────────────────────── */}
      <section className="mx-auto grid max-w-[var(--see-shell)] gap-[3px] px-[var(--see-gutter)] pt-[var(--see-section)] lg:grid-cols-12">
        <div className="dn-rise card p-5 lg:col-span-5 sm:p-6" style={{ ["--dn-enter-index" as string]: 0 }}>
          <h2 className="see-kicker text-text-secondary">你的进度</h2>
          <div className="mt-4">
            <TotalProgress total={totalLessons} />
          </div>
        </div>
        <div className="dn-rise lg:col-span-7" style={{ ["--dn-enter-index" as string]: 1 }}>
          <DailyTask />
        </div>
      </section>

      {/* ── 学习建议（来自本地进度） ─────────────────────────────────── */}
      <section className="mx-auto max-w-[var(--see-shell)] px-[var(--see-gutter)] pt-6">
        <div className="dn-rise card p-5 sm:p-6" style={{ ["--dn-enter-index" as string]: 2 }}>
          <Recommendations limit={3} />
        </div>
      </section>

      {/* ── 轨道 ───────────────────────────────────────────────────────── */}
      <section id="tracks" className="mx-auto max-w-[var(--see-shell)] px-[var(--see-gutter)] pt-[var(--see-section)]">
        <header className="max-w-[62ch]">
          <p className="see-kicker text-teal-ink">十条轨道</p>
          <h2 className="font-display mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)] leading-tight">
            不用从头学到尾，挑一条就行
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            哪条轨道像你现在最头疼的事，就从那条开始。先看推荐的三条，其余七条在下面按顺序排开。
          </p>
        </header>

        <div className="mt-8 grid gap-[3px] md:grid-cols-3">
          {featured.map((track, i) => (
            <div key={track.id} className="dn-rise" style={{ ["--dn-enter-index" as string]: i }}>
              <TrackCard track={track} index={tracks.indexOf(track)} />
            </div>
          ))}
        </div>

        <ul className="mt-3 border border-edge bg-surface">
          {rest.map((track) => (
            <TrackRow key={track.id} track={track} />
          ))}
        </ul>
      </section>

      {/* ── 完整课程表 ─────────────────────────────────────────────────── */}
      <section id="catalog" className="mx-auto max-w-[var(--see-shell)] px-[var(--see-gutter)] pt-[var(--see-section)]">
        <header className="max-w-[62ch]">
          <p className="see-kicker text-teal-ink">完整课程表</p>
          <h2 className="font-display mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)] leading-tight">
            共 {totalLessons} 节课，点开一条轨道看里面讲什么
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            每条轨道下面按章节分组，标了预计分钟数和是否实战。学过的课会在这里留下记录。
          </p>
        </header>

        <div className="mt-8 border-t border-edge">
          {grouped.map(({ trackId, modules }) => {
            const track = getTrack(trackId);
            if (!track) return null;
            const visual = trackVisual(track.color);
            const trackLessons = getLessonsByTrack(trackId);
            const minutes = trackLessons.reduce((s, l) => s + l.estimatedMinutes, 0);
            const order = tracks.indexOf(track) + 1;

            return (
              <details key={trackId} className="group border-b border-edge">
                <summary className="dn-focus flex min-h-[72px] cursor-pointer list-none items-center gap-4 px-3 py-3 hover:bg-surface-alt sm:px-4">
                  <span
                    className={
                      "flex h-11 w-11 shrink-0 items-center justify-center font-display text-lg tabular-nums " +
                      visual.field
                    }
                  >
                    {String(order).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl leading-tight">
                      {track.name}
                    </span>
                    <span className="mt-1 block text-xs text-text-secondary">
                      {trackLessons.length} 节课 · 约 {minutes} 分钟 · {track.tagline}
                    </span>
                  </span>
                  <span className="hidden shrink-0 text-xs text-text-secondary sm:block">
                    <span className="group-open:hidden">展开</span>
                    <span className="hidden group-open:inline">收起</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={
                      "h-2.5 w-2.5 shrink-0 transition-transform group-open:rotate-45 " +
                      visual.bar
                    }
                  />
                </summary>

                <div className="px-3 pb-6 sm:px-4">
                  {modules.map((group) => (
                    <div key={group.module} className="mt-4">
                      <h4 className="see-kicker text-text-secondary">{group.module}</h4>
                      <ul className="mt-2 grid gap-x-6 md:grid-cols-2">
                        {group.lessons.map((lesson) => (
                          <li key={lesson.id}>
                            <Link
                              href={"/lesson/" + lesson.id}
                              className="dn-focus flex min-h-[52px] items-baseline gap-3 border-b border-edge py-2.5 last:border-b-0 hover:bg-surface-alt"
                            >
                              <span
                                className={
                                  "mt-1.5 h-2 w-2 shrink-0 " +
                                  (lesson.type === "project" ? "bg-amber" : visual.bar)
                                }
                                aria-hidden="true"
                              />
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-medium">
                                  {lesson.title}
                                </span>
                                <span className="mt-0.5 block text-xs text-text-secondary">
                                  {lesson.description}
                                </span>
                              </span>
                              <span className="shrink-0 text-xs tabular-nums text-text-secondary">
                                {lesson.estimatedMinutes}′
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {/* ── 收尾 ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[var(--see-shell)] px-[var(--see-gutter)] pt-[var(--see-section)]">
        <div className="bg-teal px-6 py-10 text-on-color sm:px-10 sm:py-12">
          <p className="see-kicker">从一件今天就要做的事开始</p>
          <h2 className="font-display mt-4 max-w-[28ch] text-[clamp(1.6rem,3vw,2.25rem)] leading-tight">
            学完一节就去用一次，比一口气看完十节有用得多
          </h2>
          <p className="mt-4 max-w-[52ch] text-sm leading-relaxed">
            作业、通知、简历、海报，随便哪一件。{" "}
            {tracks.length} 条轨道里有 {quizCount} 套测验和 {lessons.length}{" "}
            节课，但真正让问法变了的，是你自己写的那几条提示词。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/prompts"
              className="dn-focus dn-interactive inline-flex min-h-[48px] items-center gap-2 bg-[var(--dn-ink-primary)] px-6 text-sm font-semibold text-on-ink"
            >
              去翻提示词库
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/practice"
              className="dn-focus dn-interactive inline-flex min-h-[48px] items-center border-2 border-[var(--dn-ink-primary)] px-6 text-sm font-semibold"
            >
              写一条试试
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
