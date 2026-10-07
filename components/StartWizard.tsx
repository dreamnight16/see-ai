"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { tracks, type TrackId } from "@/lib/tracks";
import { getTrackStart, getLessonsByTrack } from "@/lib/lessons";

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
      <div className="space-y-6 animate-slide-up">
        <div className="card p-6 md:p-8">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-9 h-9 rounded-xl bg-accent-soft flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-accent" />
            </span>
            <h2 className="font-display text-xl font-bold">建议你从这两条轨道开始</h2>
          </div>

          <div className="space-y-4">
            {ranking.map(({ track }, i) => {
              const start = getTrackStart(track.id);
              const count = getLessonsByTrack(track.id).length;
              return (
                <div
                  key={track.id}
                  className={
                    "p-5 rounded-xl border " +
                    (i === 0 ? "border-accent/30 bg-accent-soft/50" : "border-edge bg-surface-alt")
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        {i === 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-white font-medium">
                            先学这个
                          </span>
                        )}
                        <h3 className="font-display font-bold">{track.name}</h3>
                      </div>
                      <p className="text-sm text-muted leading-relaxed">{track.description}</p>
                      <p className="text-[11px] text-faint mt-2">
                        {count} 节课 · 写在给「{track.audience}」的
                      </p>
                    </div>
                    {start && (
                      <Link
                        href={"/lesson/" + start}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold shrink-0 hover:scale-[1.02] transition-all"
                      >
                        开始
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {ranking.length === 0 && (
            <p className="text-sm text-muted">
              没排出特别的顺序，那就从「认识 AI」开始，五节课就能把基本概念过一遍。
            </p>
          )}
        </div>

        <div className="card p-5">
          <p className="text-sm text-muted leading-relaxed">
            不管你从哪儿开始，「认识 AI」那五节课都值得看一遍，四十分钟就够。
            它解决的是「这东西为什么会答错」这类问题，后面每条轨道都会用到。
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              href="/lesson/ai-1-1"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-edge text-xs text-muted hover:text-accent hover:border-accent/30 transition-all"
            >
              先看「认识 AI」的第一节
            </Link>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-edge text-xs text-muted hover:text-accent hover:border-accent/30 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              重新选一次
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  return (
    <div className="card p-6 md:p-8 animate-slide-up">
      <div className="flex items-center gap-2 mb-6">
        {QUESTIONS.map((_, i) => (
          <span
            key={i}
            className={
              "h-1.5 rounded-full transition-all duration-300 " +
              (i <= step ? "bg-accent w-10" : "bg-surface-raised w-6")
            }
          />
        ))}
        <span className="text-[11px] text-faint ml-2 tabular-nums">
          {step + 1} / {QUESTIONS.length}
        </span>
      </div>

      <h2 className="font-display text-2xl font-bold mb-1.5">{q.title}</h2>
      <p className="text-sm text-muted mb-6">{q.sub}</p>

      <div className="space-y-3">
        {q.options.map((opt, i) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => pick(i)}
            className="w-full text-left p-4 rounded-xl border border-edge bg-surface-alt hover:border-accent/40 hover:bg-accent-soft/40 transition-all group"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium text-sm">{opt.label}</div>
                {opt.hint && <div className="text-xs text-muted mt-1">{opt.hint}</div>}
              </div>
              <ArrowRight className="w-4 h-4 text-faint group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="mt-5 text-xs text-muted hover:text-accent transition-colors"
        >
          上一题
        </button>
      )}
    </div>
  );
}
