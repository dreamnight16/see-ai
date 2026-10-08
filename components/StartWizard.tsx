"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { tracks, type TrackId } from "@/lib/tracks";
import { getTrackStart, getLessonsByTrack } from "@/lib/lessons";
import { trackVisual } from "@/components/track-visuals";

interface Option {
  label: string;
  hint?: string;
  weights: Partial<Record<TrackId, number>>;
}

interface Question {
  id: string;
  title: string;
  sub: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: "now",
    title: "你现在跟 AI 是什么关系？",
    sub: "没有标准答案，照实选就行。",
    options: [
      {
        label: "手机里有豆包，但基本就是闲聊",
        hint: "问点琐事、让它写两句祝福语，没了",
        weights: { basics: 3, campus: 2 },
      },
      {
        label: "偶尔用它写点东西，感觉一般",
        hint: "试过几次，出来的东西不像样就放弃了",
        weights: { campus: 3, skill: 1 },
      },
      {
        label: "用得挺多，就是结果总差点意思",
        hint: "会用了，但每次都要改好几轮",
        weights: { skill: 3, campus: 1 },
      },
    ],
  },
  {
    id: "goal",
    title: "眼下最想用它解决哪件事？",
    sub: "挑最急的那件，别的以后再说。",
    options: [
      {
        label: "作业、论文和考试",
        hint: "写不出来、不会查资料、复习没头绪",
        weights: { campus: 3 },
      },
      {
        label: "社团、汇报、简历和实习",
        hint: "策划活动、做汇报、投简历",
        weights: { campus: 3 },
      },
      {
        label: "做点能发出去的东西",
        hint: "海报、短视频、公众号、小红书",
        weights: { create: 3 },
      },
      {
        label: "自己动手做个小工具或网页",
        hint: "想做出一个真能用起来的东西",
        weights: { code: 3 },
      },
      {
        label: "就是想搞明白 AI 到底是什么",
        hint: "不想稀里糊涂地用",
        weights: { basics: 3 },
      },
    ],
  },
  {
    id: "worry",
    title: "有件事你更担心？",
    sub: "这条会影响我给你排的顺序。",
    options: [
      {
        label: "用它写作业会不会算抄袭",
        hint: "怕被查出来",
        weights: { trust: 3, campus: 1 },
      },
      {
        label: "怕它一本正经地胡说",
        hint: "把编的东西当真了",
        weights: { trust: 3 },
      },
      {
        label: "怕自己的信息被它拿走",
        hint: "照片、聊天记录、个人信息",
        weights: { trust: 3 },
      },
      {
        label: "还没想那么远，先学会用",
        hint: "先跑起来再说",
        weights: { skill: 1 },
      },
    ],
  },
  {
    id: "time",
    title: "每天大概能挤出多少时间？",
    sub: "影响的是节奏，不是内容。",
    options: [
      { label: "10 分钟以内", hint: "一次一节，慢慢来", weights: {} },
      { label: "半小时左右", hint: "一天一到两节", weights: {} },
      { label: "有空就多学点", hint: "想快一点走完一条轨道", weights: {} },
    ],
  },
];

export default function StartWizard() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Record<string, number>>({});

  const done = step >= QUESTIONS.length;

  const ranking = useMemo(() => {
    const score: Record<string, number> = {};
    for (const [qid, optIndex] of Object.entries(picked)) {
      const q = QUESTIONS.find((x) => x.id === qid);
      if (!q) continue;
      const weights = q.options[optIndex]?.weights ?? {};
      for (const [trackId, w] of Object.entries(weights)) {
        score[trackId] = (score[trackId] ?? 0) + (w ?? 0);
      }
    }
    return tracks
      .map((t) => ({ track: t, score: score[t.id] ?? 0 }))
      .sort((a, b) => b.score - a.score)
      .filter((x) => x.score > 0)
      .slice(0, 2);
  }, [picked]);

  function pick(optionIndex: number) {
    const q = QUESTIONS[step];
    setPicked((prev) => ({ ...prev, [q.id]: optionIndex }));
    setStep((s) => s + 1);
  }

  function reset() {
    setPicked({});
    setStep(0);
  }

  if (done) {
    return (
      <div className="space-y-6">
        <section className="card p-5 sm:p-8">
          <h2 className="font-display text-2xl leading-tight sm:text-3xl">
            建议你从这两条轨道开始
          </h2>

          {ranking.length === 0 ? (
            <p className="mt-5 max-w-[62ch] text-sm leading-relaxed text-text-secondary">
              没排出特别的顺序，那就从「认识 AI」开始，五节课就能把基本概念过一遍。
            </p>
          ) : (
            <ul className="mt-6 grid gap-[3px]">
              {ranking.map(({ track }, i) => {
                const start = getTrackStart(track.id);
                const count = getLessonsByTrack(track.id).length;
                const visual = trackVisual(track.color);
                const isFirst = i === 0;

                return (
                  <li
                    key={track.id}
                    className={
                      "flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between " +
                      (isFirst ? visual.field : "border border-edge bg-surface")
                    }
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={
                            "inline-flex min-h-[28px] items-center gap-1.5 px-2 text-xs font-semibold " +
                            (isFirst
                              ? "bg-[var(--dn-ink-primary)] text-on-ink"
                              : "bg-teal text-on-color")
                          }
                        >
                          {isFirst ? "先学这个" : "接着学这个"}
                        </span>
                        <h3 className="font-display text-2xl leading-tight">{track.name}</h3>
                      </div>
                      <p className="mt-3 max-w-[54ch] text-sm leading-relaxed">
                        {track.description}
                      </p>
                      <p className="mt-2.5 text-xs tabular-nums">
                        {count} 节课 · 写给：{track.audience}
                      </p>
                    </div>

                    {start && (
                      <Link
                        href={"/lesson/" + start}
                        className={
                          "dn-focus dn-interactive inline-flex min-h-[48px] shrink-0 items-center gap-2 px-5 text-sm font-semibold " +
                          (isFirst
                            ? "bg-[var(--dn-ink-primary)] text-on-ink"
                            : "bg-teal text-on-color")
                        }
                      >
                        开始第一节
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="card p-5 sm:p-6">
          <p className="max-w-[68ch] text-sm leading-relaxed text-text-secondary">
            不管你从哪儿开始，「认识 AI」那五节课都值得看一遍，四十分钟就够。
            它解决的是「这东西为什么会答错」这类问题，后面每条轨道都会用到。
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/lesson/ai-1-1"
              className="dn-focus inline-flex min-h-[44px] items-center border border-edge-strong px-4 text-xs font-semibold text-text-primary hover:bg-surface-alt"
            >
              先看「认识 AI」的第一节
            </Link>
            <button
              type="button"
              onClick={reset}
              className="dn-focus inline-flex min-h-[44px] items-center gap-1.5 border border-edge-strong px-4 text-xs font-semibold text-text-primary hover:bg-surface-alt"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              重新选一次
            </button>
          </div>
        </section>
      </div>
    );
  }

  const q = QUESTIONS[step];
  return (
    <section className="card p-5 sm:p-8">
      {/* 步骤用编号色块表示，当前步是实色，已完成是描边，未开始是浅底 */}
      <ol className="flex items-center gap-2" aria-label="答题进度">
        {QUESTIONS.map((item, i) => (
          <li key={item.id} className="flex flex-1 items-center gap-2">
            <span
              className={
                "flex h-8 flex-1 items-center justify-center text-xs font-semibold tabular-nums " +
                (i < step
                  ? "bg-teal text-on-color"
                  : i === step
                    ? "bg-teal text-on-color"
                    : "border border-edge-strong text-text-secondary")
              }
            >
              {i + 1}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs tabular-nums text-text-secondary" role="status">
        第 {step + 1} 题，共 {QUESTIONS.length} 题
      </p>

      <h2 className="font-display mt-6 text-2xl leading-tight sm:text-3xl">{q.title}</h2>
      <p className="mt-2 text-sm text-text-secondary">{q.sub}</p>

      <ul className="mt-6 space-y-2">
        {q.options.map((opt, i) => (
          <li key={opt.label}>
            <button
              type="button"
              onClick={() => pick(i)}
              className="dn-focus flex min-h-[64px] w-full items-center gap-4 border border-edge-strong bg-surface px-4 py-3 text-left transition-colors hover:bg-surface-alt"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center bg-surface-raised font-mono text-xs font-semibold text-text-primary"
                aria-hidden="true"
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{opt.label}</span>
                {opt.hint && (
                  <span className="mt-1 block text-xs text-text-secondary">{opt.hint}</span>
                )}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="dn-focus mt-5 inline-flex min-h-[44px] items-center text-xs font-semibold text-text-primary underline underline-offset-4"
        >
          上一题
        </button>
      )}
    </section>
  );
}
