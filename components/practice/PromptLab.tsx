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
  Bot,
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
import { trackVisual } from "@/components/track-visuals";
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
  Bot,
};

/**
 * 分数条：4 档用四块实色段表示长度，旁边永远跟着数字，
 * 状态不依赖颜色单独表达。
 */
function ScoreBar({ score }: { score: number }) {
  const tone = score >= 85 ? "bg-emerald" : score >= 70 ? "bg-teal" : score >= 50 ? "bg-amber" : "bg-steel";
  return (
    <div
      className="h-3 w-full bg-surface-raised"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={score}
    >
      <div
        className={"h-full transition-[width] duration-[380ms] ease-[var(--dn-ease-in)] " + tone}
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
  const visual = track ? trackVisual(track.color) : null;

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
  const canCheck = draft.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* 场景选择：直角分段按钮，选中是实色块 + 图标，不靠颜色单独区分 */}
      <div>
        <p className="see-kicker text-text-secondary">挑一个场景</p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="选择练习场景">
          {practiceScenarios.map((s) => {
            const Icon = ICONS[s.icon] ?? Sparkles;
            const active = s.id === scenario.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => pickScenario(s)}
                aria-pressed={active}
                className={
                  "dn-focus inline-flex min-h-[44px] items-center gap-1.5 border px-3.5 text-xs font-semibold transition-colors " +
                  (active
                    ? "border-teal bg-teal text-on-color"
                    : "border-edge-strong bg-surface text-text-primary hover:bg-surface-alt")
                }
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {s.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* 场景说明 */}
      <section className="card p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex min-h-[32px] items-center bg-orange px-2.5 text-xs font-semibold text-on-color">
            {scenario.tag}
          </span>
          {track && visual && (
            <span className={"text-xs font-semibold " + visual.ink}>
              来自「{track.name}」轨道
            </span>
          )}
        </div>

        <h2 className="font-display mt-4 text-2xl leading-tight sm:text-3xl">
          {scenario.title}
        </h2>
        <p className="mt-3 max-w-[68ch] text-sm leading-relaxed">{scenario.situation}</p>

        <div className="mt-5 border-l-4 border-teal bg-teal-tint p-4">
          <p className="text-xs font-semibold text-teal-ink">这次要它帮你做的事</p>
          <p className="mt-1.5 text-sm leading-relaxed text-text-primary">{scenario.goal}</p>
        </div>

        {scenario.warning && (
          <div className="mt-4 flex items-start gap-2.5 bg-amber-tint p-4">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-ink" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-text-primary">
              <span className="font-semibold text-amber-ink">注意：</span>
              {scenario.warning}
            </p>
          </div>
        )}
      </section>

      {/* 写 */}
      <section className="card p-5 sm:p-6">
        <label htmlFor="prompt-draft" className="font-display block text-lg">
          你的提问
        </label>
        <p className="mt-1.5 text-xs text-text-secondary">
          照着上面的场景，把你会发给 AI 的那段话写在这里。写多写少都行，写完点下面的按钮。
        </p>
        <textarea
          id="prompt-draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={7}
          placeholder={scenario.starter}
          className="mt-3 w-full resize-y border border-edge-strong bg-surface p-4 text-sm leading-relaxed text-text-primary outline-none placeholder:text-text-secondary focus:border-teal"
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={check}
            disabled={!canCheck}
            className={
              // 不可用状态一律用不透明的另一种配色表达，不用元素级 opacity：
              // opacity 会把前景和背景一起压向卡片底，5.58:1 会掉到 1.7:1 左右。
              // 虚线边框是形状线索，让「还不能点」不只靠颜色表达。
              "dn-focus dn-interactive inline-flex min-h-[48px] items-center gap-2 border-2 px-5 text-sm font-semibold transition-colors " +
              (canCheck
                ? "border-teal bg-teal text-on-color"
                : "cursor-not-allowed border-dashed border-edge-strong bg-surface text-text-secondary")
            }
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            检查这句话
          </button>
          <button
            type="button"
            onClick={() => setDraft(scenario.starter)}
            className="dn-focus inline-flex min-h-[48px] items-center border border-edge-strong px-4 text-xs font-semibold text-text-primary hover:bg-surface-alt"
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
            className="dn-focus inline-flex min-h-[48px] items-center gap-1.5 border border-edge-strong px-4 text-xs font-semibold text-text-primary hover:bg-surface-alt"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            清空重写
          </button>
          <span className="ml-auto text-xs tabular-nums text-text-secondary">
            {draft.trim().length} 字
          </span>
        </div>
      </section>

      {/* 反馈 */}
      {review && (
        <section className="card p-5 transition-opacity duration-[380ms] ease-[var(--dn-ease-in)] sm:p-7">
          <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
            <div>
              <p className="font-display text-[3.5rem] leading-none tabular-nums">
                {review.score}
                <span className="ml-2 text-base text-text-secondary">/ 100</span>
              </p>
              <p className="mt-2 text-sm font-semibold">{review.grade}</p>
            </div>
            <div className="min-w-[220px] flex-1">
              <ScoreBar score={review.score} />
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                这个分是本地规则算出来的，不联网、不花钱。它只看要素全不全，不管文笔。
              </p>
            </div>
          </div>

          <div className="mt-7">
            <h3 className="font-display text-lg">这个任务需要写到的几件事</h3>
            <ul className="mt-3 border-t border-edge">
              {scenario.mustHaves.map((id) => {
                const done = hitIds.includes(id);
                return (
                  <li
                    key={id}
                    className="flex min-h-[44px] items-center gap-3 border-b border-edge text-sm"
                  >
                    {done ? (
                      <CircleCheck className="h-4 w-4 shrink-0 text-emerald-ink" aria-hidden="true" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
                    )}
                    <span className={done ? "" : "text-text-secondary"}>
                      {getChecklistLabel(id)}
                    </span>
                    <span className="ml-auto text-xs font-semibold text-text-secondary">
                      {done ? "已写到" : "还没写"}
                    </span>
                  </li>
                );
              })}
            </ul>
            {missing.length === 0 && (
              <p className="mt-3 text-sm font-semibold text-emerald-ink">
                这几项都写到了，可以拿去用了。
              </p>
            )}
          </div>

          {review.strengths.length > 0 && (
            <div className="mt-7">
              <h3 className="font-display text-lg">写得好的地方</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {review.strengths.map((s) => (
                  <li
                    key={s.id}
                    className="inline-flex min-h-[36px] items-center gap-1.5 bg-emerald-tint px-3 text-xs font-semibold text-text-primary"
                  >
                    <CircleCheck className="h-3.5 w-3.5 text-emerald-ink" aria-hidden="true" />
                    {s.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {review.issues.length > 0 && (
            <div className="mt-7">
              <h3 className="font-display text-lg">还能改的地方</h3>
              <ul className="mt-3 space-y-3">
                {review.issues.map((issue) => (
                  <li key={issue.id} className="border-l-4 border-amber bg-amber-tint p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-amber-ink">
                      <TriangleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {issue.label}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-text-primary">
                      {issue.hint}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-7 border-t border-edge pt-5">
            <h3 className="font-display text-lg">下一步就改这一句</h3>
            <ol className="mt-3 space-y-2.5">
              {review.nextSteps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-teal text-[11px] font-semibold text-on-color tabular-nums">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-text-primary">{step}</span>
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
              className="dn-focus see-link mt-4 inline-flex min-h-[44px] items-center text-xs font-semibold"
            >
              回到上面按这几条改一遍
            </button>
          </div>
        </section>
      )}

      {/* 参考版本 */}
      <section className="card p-5 sm:p-6">
        <button
          type="button"
          onClick={() => setShowSample((v) => !v)}
          aria-expanded={showSample}
          className="dn-focus inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-teal-ink"
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
          {showSample ? "收起参考版本" : "看参考版本"}
        </button>
        <p className="mt-2 text-xs text-text-secondary">
          建议先自己写一遍再点开。看别人写的版本容易，自己想出来才是你的。
        </p>

        {showSample && (
          <div className="mt-5 space-y-4">
            <div className="border border-edge">
              <div className="flex items-center justify-between gap-3 border-b border-edge bg-surface-alt px-3 py-2">
                <span className="see-kicker text-text-secondary">参考版本</span>
                <CopyButton text={scenario.samplePrompt} compact />
              </div>
              <pre className="whitespace-pre-wrap bg-canvas p-4 font-sans text-[13px] leading-relaxed text-text-primary">
                {scenario.samplePrompt}
              </pre>
            </div>
            <div className="border-l-4 border-cyan bg-cyan-tint p-4">
              <p className="text-xs font-semibold text-cyan-ink">对照的时候看这几点</p>
              <p className="mt-1.5 text-xs leading-relaxed text-text-primary">
                {scenario.closeLook}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 去读相关课程 */}
      {track && (
        <p className="text-center text-xs text-text-secondary">
          想看讲这一块的课程？回{" "}
          <Link href="/" className="see-link">
            课程表
          </Link>{" "}
          找「{track.name}」轨道。
        </p>
      )}
    </div>
  );
}
