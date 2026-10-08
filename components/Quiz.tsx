"use client";

import { useState } from "react";
import { getQuizById } from "@/lib/quiz-data";
import { saveQuizResult } from "@/lib/progress";
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Trophy, BookOpen } from "lucide-react";

/**
 * 章节测验。
 *
 * 对错不只用颜色表示：正确项有 ✓ 图标 + 「正确答案」文字，选错项有 ✗ 图标 + 文字，
 * 并且每题都给出解释。键盘可以直接 Tab 到每个选项并用 Enter 选择。
 */
export default function Quiz({ quizId }: { quizId: string }) {
  const quiz = getQuizById(quizId);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [showResult, setShowResult] = useState(false);

  if (!quiz) {
    return (
      <div className="flex items-center gap-2.5 border border-crimson bg-crimson-tint p-4 text-sm text-text-primary">
        <AlertCircle className="h-4 w-4 shrink-0 text-crimson-ink" aria-hidden="true" />
        <span>测验数据未加载，请稍后重试。</span>
      </div>
    );
  }

  const total = quiz.questions.length;
  const question = quiz.questions[current];
  const selectedAnswer = answers[current];
  const isRevealed = revealed.has(current);
  const isCorrect = selectedAnswer === question.correctIndex;

  function handleSelect(idx: number) {
    if (isRevealed) return;
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
  }

  function handleConfirm() {
    if (selectedAnswer === undefined) return;
    setRevealed(new Set([...revealed, current]));
  }

  function handleNext() {
    if (current < total - 1) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
      const score = Math.round(
        (answers.filter((a, i) => a === quiz!.questions[i].correctIndex).length / total) * 100
      );
      saveQuizResult(quiz!.lessonId, score);
    }
  }

  function handleRetry() {
    setCurrent(0);
    setAnswers([]);
    setRevealed(new Set());
    setShowResult(false);
  }

  if (showResult) {
    const correct = answers.filter((a, i) => a === quiz.questions[i].correctIndex).length;
    const score = Math.round((correct / total) * 100);
    const passed = score >= quiz.passingScore;

    return (
      <div className={(passed ? "bg-emerald" : "bg-amber") + " p-6 text-on-color sm:p-8"}>
        <div className="flex items-center gap-3">
          {passed ? (
            <Trophy className="h-7 w-7" aria-hidden="true" />
          ) : (
            <BookOpen className="h-7 w-7" aria-hidden="true" />
          )}
          <h3 className="font-display text-2xl leading-none">
            {passed ? "通过了" : "还没到通过线"}
          </h3>
        </div>

        <p className="font-display mt-6 text-[3.5rem] leading-none tabular-nums">
          {score}
          <span className="ml-2 text-lg font-semibold">分</span>
        </p>

        <p className="mt-4 text-sm tabular-nums">
          答对 {correct} / {total} 题 · 通过线 {quiz.passingScore} 分
        </p>
        <p className="mt-2 max-w-[46ch] text-sm leading-relaxed">
          {passed
            ? "这一节的知识点你已经能用了。去把课上那件事真做一遍，比再刷一遍题有用。"
            : "回正文里对一下刚才答错的那几处，再试一次。分数只记在你自己的浏览器里。"}
        </p>

        <button
          type="button"
          onClick={handleRetry}
          className="dn-focus dn-interactive mt-6 inline-flex min-h-[48px] items-center gap-2 bg-[var(--dn-ink-primary)] px-5 text-sm font-semibold text-on-ink"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" /> 重新测验
        </button>
      </div>
    );
  }

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-semibold">{quiz.title}</span>
        <span className="text-sm tabular-nums text-text-secondary">
          第 {current + 1} / {total} 题
        </span>
      </div>

      {/* 进度用实色段，不用细圆点 */}
      <div className="mt-3 flex gap-1" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              "h-1.5 flex-1 " +
              (i === current ? "bg-teal" : revealed.has(i) ? "bg-steel" : "bg-surface-raised")
            }
          />
        ))}
      </div>

      <p className="mt-6 text-lg font-semibold leading-relaxed">{question.question}</p>

      <ul className="mt-4 space-y-2">
        {question.options.map((opt, idx) => {
          const isAnswerKey = idx === question.correctIndex;
          const isPicked = idx === selectedAnswer;

          let rowClass = "border-edge-strong bg-surface hover:bg-surface-alt";
          if (isRevealed) {
            if (isAnswerKey) rowClass = "border-emerald bg-emerald-tint";
            else if (isPicked) rowClass = "border-crimson bg-crimson-tint";
            else rowClass = "border-edge bg-surface opacity-60";
          } else if (isPicked) {
            rowClass = "border-teal bg-teal-tint";
          }

          return (
            <li key={idx}>
              <button
                type="button"
                onClick={() => handleSelect(idx)}
                disabled={isRevealed}
                aria-pressed={isPicked}
                className={
                  "dn-focus flex min-h-[56px] w-full items-center gap-3.5 border px-4 py-3 text-left text-sm transition-colors disabled:cursor-default " +
                  rowClass
                }
              >
                <span
                  className={
                    "flex h-7 w-7 shrink-0 items-center justify-center font-mono text-xs font-semibold " +
                    (isRevealed && isAnswerKey
                      ? "bg-emerald text-on-color"
                      : isRevealed && isPicked
                        ? "bg-crimson text-on-color"
                        : isPicked
                          ? "bg-teal text-on-color"
                          : "bg-surface-raised text-text-primary")
                  }
                  aria-hidden="true"
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{opt}</span>
                {isRevealed && isAnswerKey && (
                  <>
                    <span className="shrink-0 text-xs font-semibold text-emerald-ink">正确答案</span>
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-ink" aria-hidden="true" />
                  </>
                )}
                {isRevealed && isPicked && !isAnswerKey && (
                  <>
                    <span className="shrink-0 text-xs font-semibold text-crimson-ink">你的选择</span>
                    <XCircle className="h-5 w-5 shrink-0 text-crimson-ink" aria-hidden="true" />
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {isRevealed && (
        <div
          className={
            "mt-4 border-l-4 p-4 text-sm leading-relaxed " +
            (isCorrect ? "border-emerald bg-emerald-tint" : "border-crimson bg-crimson-tint")
          }
        >
          <p className="font-semibold">
            {isCorrect ? "✓ 回答正确" : "✗ 这题答错了"}
          </p>
          <p className="mt-1.5 text-text-primary">{question.explanation}</p>
        </div>
      )}

      <div className="mt-5 flex justify-end">
        {!isRevealed ? (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={selectedAnswer === undefined}
            className="dn-focus dn-interactive min-h-[48px] bg-teal px-6 text-sm font-semibold text-on-color disabled:cursor-not-allowed disabled:opacity-40"
          >
            确认答案
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="dn-focus dn-interactive min-h-[48px] bg-teal px-6 text-sm font-semibold text-on-color"
          >
            {current < total - 1 ? "下一题" : "查看结果"}
          </button>
        )}
      </div>
    </div>
  );
}
