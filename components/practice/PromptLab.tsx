"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Coffee,
  Briefcase,
  Palette,
  ShieldCheck,
  GraduationCap,
  Table,
  Lock,
  CircleCheck,
  Circle,
  TriangleAlert,
  Sparkles,
  RotateCcw,
  Eye,
} from "lucide-react";
import { practiceScenarios, missingMustHaves, type PracticeScenario } from "@/lib/practice-scenarios";
import { recordPromptCheck } from "@/lib/progress";
import { reviewPrompt, getChecklistLabel, type PromptReview } from "@/lib/prompt-coach";
import { getTrack } from "@/lib/tracks";
import CopyButton from "@/components/CopyButton";
import type { ComponentType } from "react";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Coffee,
  Briefcase,
  Palette,
  ShieldCheck,
  GraduationCap,
  Table,
  Lock,
};

function ScoreBar({ score }: { score: number }) {
  const tone =
    score >= 85 ? "bg-success" : score >= 70 ? "bg-accent" : score >= 50 ? "bg-warning" : "bg-faint";
  return (
    <div className="h-2 rounded-full bg-surface-raised overflow-hidden">
      <div
        className={"h-full rounded-full transition-all duration-700 " + tone}
        style={{ width: score + "%" }}
      />
    </div>
  );
}

export default function PromptLab({ initialScenarioId }: { initialScenarioId?: string }) {
  const [scenarioId, setScenarioId] = useState<string>(
    initialScenarioId ?? practiceScenarios[0].id,
  );
  const [draft, setDraft] = useState("");
  const [review, setReview] = useState<PromptReview | null>(null);
  const [draftForReview, setDraftForReview] = useState("");
  const [showSample, setShowSample] = useState(false);

  const scenario = useMemo(
    () => practiceScenarios.find((s) => s.id === scenarioId) ?? practiceScenarios[0],
    [scenarioId],
  );
  const track = getTrack(scenario.track);

  function pickScenario(next: PracticeScenario) {
    setScenarioId(next.id);
    setReview(null);
    setShowSample(false);
  }

  function check() {
    const result = reviewPrompt(draft);
    setDraftForReview(draft);
    setReview(result);
    setShowSample(false);
    // 记一笔：攒够次数会解锁「练过手」徽章
    recordPromptCheck(result.score);
  }

  const hitIds = review ? review.strengths.map((s) => s.id) : [];
  const missing = review ? missingMustHaves(scenario, hitIds) : [];

  return (
    <div className="space-y-6">
      {/* 任务选择 */}
      <div className="flex flex-wrap gap-2">
        {practiceScenarios.map((s) => {
          const Icon = ICONS[s.icon] ?? Sparkles;
          const active = s.id === scenario.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => pickScenario(s)}
              className={
                "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs transition-all " +
                (active
                  ? "border-accent/40 bg-accent-soft text-accent font-semibold"
                  : "border-edge bg-surface-alt text-muted hover:text-accent hover:border-accent/30")
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {s.title}
            </button>
          );
        })}
      </div>

      {/* 场景说明 */}
      <div className="card p-6 md:p-7">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning-soft text-warning font-medium">
            {scenario.tag}
          </span>
          {track && <span className="text-[11px] text-faint">来自「{track.name}」轨道</span>}
        </div>

        <h2 className="font-display text-2xl font-bold mb-3">{scenario.title}</h2>
        <p className="text-sm text-muted leading-relaxed">{scenario.situation}</p>

        <div className="mt-5 p-4 rounded-xl bg-accent-soft/70 border border-accent/20">
          <div className="text-[11px] font-semibold text-accent mb-1.5">这次要它帮你做的事</div>
          <p className="text-sm leading-relaxed">{scenario.goal}</p>
        </div>

        {scenario.warning && (
          <div className="mt-4 flex items-start gap-2 text-xs text-warning">
            <TriangleAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span className="leading-relaxed">{scenario.warning}</span>
          </div>
        )}
      </div>

      {/* 写 */}
      <div className="card p-6">
        <label htmlFor="prompt-draft" className="block font-display font-bold mb-2">
          你的提问
        </label>
        <p className="text-xs text-muted mb-3">
          照着上面的场景，把你会发给 AI 的那段话写在这里。写多写少都行，写完点下面的按钮。
        </p>
        <textarea
          id="prompt-draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={7}
          placeholder={scenario.starter}
          className="w-full rounded-xl border border-edge bg-surface-alt p-4 text-sm leading-relaxed outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all resize-y"
        />

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <button
            type="button"
            onClick={check}
            disabled={!draft.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:hover:scale-100"
          >
            <Sparkles className="w-4 h-4" />
            检查这句话
          </button>
          <button
            type="button"
            onClick={() => setDraft(scenario.starter)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-edge text-xs text-muted hover:text-accent hover:border-accent/30 transition-all"
          >
            用它给的开头
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft("");
              setReview(null);
              setShowSample(false);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-edge text-xs text-muted hover:text-accent hover:border-accent/30 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            清空重写
          </button>
          <span className="text-xs text-faint ml-auto tabular-nums">{draft.trim().length} 字</span>
        </div>
      </div>

      {/* 反馈 */}
      {review && (
        <div className="card p-6 md:p-7 space-y-6 animate-slide-up">
          <div>
            <div className="flex items-end justify-between mb-3">
              <div>
                <span className="font-display text-4xl font-black tabular-nums">{review.score}</span>
                <span className="text-sm text-faint ml-2">/ 100</span>
                <p className="text-sm text-muted mt-1">{review.grade}</p>
              </div>
            </div>
            <ScoreBar score={review.score} />
            <p className="text-[11px] text-faint mt-2.5">
              这个分是本地规则算出来的，不联网、不花钱。它只看要素全不全，不管文笔。
            </p>
          </div>

          {/* 清单 */}
          <div>
            <h3 className="font-display font-bold mb-3">这个任务需要写到的几件事</h3>
            <ul className="space-y-2">
              {scenario.mustHaves.map((id) => {
                const done = hitIds.includes(id);
                return (
                  <li key={id} className="flex items-center gap-2.5 text-sm">
                    {done ? (
                      <CircleCheck className="w-4 h-4 text-success shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-faint/50 shrink-0" />
                    )}
                    <span className={done ? "" : "text-muted"}>{getChecklistLabel(id)}</span>
                  </li>
                );
              })}
            </ul>
            {missing.length === 0 && (
              <p className="text-sm text-success mt-3">这几项都写到了，可以拿去用了。</p>
            )}
          </div>

          {/* 做得好 */}
          {review.strengths.length > 0 && (
            <div>
              <h3 className="font-display font-bold mb-3">写得好的地方</h3>
              <div className="flex flex-wrap gap-2">
                {review.strengths.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success-soft text-success text-xs"
                  >
                    <CircleCheck className="w-3.5 h-3.5" />
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 还能改 */}
          {review.issues.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display font-bold">还能改的地方</h3>
              {review.issues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 rounded-xl bg-warning-soft/60 border border-warning/20"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-warning mb-1.5">
                    <TriangleAlert className="w-3.5 h-3.5 shrink-0" />
                    {issue.label}
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{issue.hint}</p>
                </div>
              ))}
            </div>
          )}

          {/* 下一步 */}
          <div className="pt-5 border-t border-edge">
            <h3 className="font-display font-bold mb-3">下一步就改这一句</h3>
            <ol className="space-y-2.5">
              {review.nextSteps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-5 h-5 rounded-md bg-accent-soft text-accent text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-muted leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => {
                setDraft(draftForReview);
                setReview(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="mt-4 text-xs text-accent hover:underline"
            >
              回到上面按这几条改一遍
            </button>
          </div>
        </div>
      )}

      {/* 参考版本 */}
      <div className="card p-6">
        <button
          type="button"
          onClick={() => setShowSample((v) => !v)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent"
        >
          <Eye className="w-4 h-4" />
          {showSample ? "收起参考版本" : "看参考版本"}
        </button>
        <p className="text-xs text-faint mt-2">
          建议先自己写一遍再点开。看别人写的版本容易，自己想出来才是你的。
        </p>

        {showSample && (
          <div className="mt-5 space-y-4 animate-slide-up">
            <div className="relative rounded-xl border border-edge bg-surface-alt p-4">
              <div className="absolute top-3 right-3">
                <CopyButton text={scenario.samplePrompt} compact />
              </div>
              <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans pr-20 text-muted">
                {scenario.samplePrompt}
              </pre>
            </div>
            <div className="p-4 rounded-xl bg-info-soft/70 border border-info/20">
              <div className="text-[11px] font-semibold text-info mb-1.5">对照的时候看这几点</div>
              <p className="text-xs leading-relaxed">{scenario.closeLook}</p>
            </div>
          </div>
        )}
      </div>

      {/* 去读相关课程 */}
      {track && (
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-muted hover:text-accent transition-colors"
          >
            想看讲这一块的课程？回首页找「{track.name}」轨道
          </Link>
        </div>
      )}
    </div>
  );
}
