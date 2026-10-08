'use client';

import { useState, useCallback } from 'react';
import type { Exercise } from '@/lib/exercises';
import { Play, Eye, Lightbulb, CheckCircle2, RotateCcw } from 'lucide-react';

interface CodeExerciseProps {
  exercise: Exercise;
  onComplete?: (exerciseId: string) => void;
}

export default function CodeExercise({ exercise, onComplete }: CodeExerciseProps) {
  const [code, setCode] = useState(exercise.templateCode);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const checkCompletion = useCallback(() => {
    const allFound = exercise.checkPatterns.every((pattern) =>
      code.toLowerCase().includes(pattern.toLowerCase()),
    );
    if (allFound && !completed) {
      setCompleted(true);
      onComplete?.(exercise.id);
    }
    return allFound;
  }, [code, exercise.checkPatterns, completed, onComplete, exercise.id]);

  function handlePreview() {
    setShowPreview(true);
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(code);
      w.document.close();
    }
  }

  function showNextHint() {
    if (hintsRevealed < exercise.hints.length) {
      setHintsRevealed((h) => h + 1);
    }
  }

  function reset() {
    setCode(exercise.templateCode);
    setHintsRevealed(0);
    setCompleted(false);
  }

  return (
    <div className="card space-y-4 p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-teal text-on-color">
            <Play className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h4 className="font-display text-lg">{exercise.title}</h4>
            <p className="text-xs text-text-secondary">{exercise.description}</p>
          </div>
        </div>
        {completed && (
          <span className="inline-flex shrink-0 items-center gap-1.5 bg-emerald px-3 py-1.5 text-xs font-semibold text-on-color">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            完成
          </span>
        )}
      </div>

      {/* Expected behavior */}
      <div className="border border-edge bg-surface-alt p-3.5 text-sm text-text-secondary">
        <span className="font-semibold text-text-primary">目标：</span>
        {exercise.expectedBehavior}
      </div>

      {/* Code editor */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          aria-label={exercise.title + ' 代码编辑区'}
          className="dn-focus h-64 w-full resize-y border border-edge-strong bg-surface-alt p-4 font-mono text-sm"
          spellCheck={false}
        />
        {/* 完成遮罩常驻挂载，只切 opacity：这样它是一个真正的 transition，
            而不是挂载时的一次性入场动画。未完成时对读屏隐藏且不拦鼠标。 */}
        <div
          aria-hidden={!completed}
          className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-emerald-tint/70 transition-opacity duration-[380ms] ease-[var(--dn-ease-in)] ${
            completed ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="dn-elevation-2 inline-flex items-center gap-2 bg-emerald px-4 py-3 font-semibold text-on-color">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            完成！
            <span className="text-xs font-normal">所有检查点都通过了</span>
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handlePreview}
          className="dn-focus dn-interactive inline-flex min-h-[44px] items-center gap-1.5 bg-teal px-3.5 text-sm font-semibold text-on-color"
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
          预览
        </button>
        <button
          onClick={checkCompletion}
          className="dn-focus inline-flex min-h-[44px] items-center gap-1.5 border border-edge-strong px-3.5 text-sm text-text-primary transition-colors hover:bg-surface-alt"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          检查
        </button>
        <button
          onClick={showNextHint}
          disabled={hintsRevealed >= exercise.hints.length}
          className="dn-focus inline-flex min-h-[44px] items-center gap-1.5 border border-edge-strong px-3.5 text-sm text-text-primary transition-colors hover:border-amber hover:bg-amber-tint hover:text-amber-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Lightbulb className="h-4 w-4" aria-hidden="true" />
          提示 {hintsRevealed > 0 && `(${hintsRevealed}/${exercise.hints.length})`}
        </button>
        <button
          onClick={reset}
          className="dn-focus ml-auto inline-flex min-h-[44px] items-center gap-1.5 border border-edge-strong px-3.5 text-sm text-text-secondary transition-colors hover:bg-surface-alt hover:text-text-primary"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          重置
        </button>
      </div>

      {/* Hints */}
      {hintsRevealed > 0 && (
        <div className="space-y-2">
          {exercise.hints.slice(0, hintsRevealed).map((hint, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 border-l-[3px] border-amber bg-amber-tint p-3 text-sm text-text-primary"
            >
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-ink" aria-hidden="true" />
              <span>{hint}</span>
            </div>
          ))}
        </div>
      )}

      {/* Preview toggle */}
      {showPreview && (
        <div className="overflow-hidden border border-edge">
          <div className="flex items-center justify-between gap-3 border-b border-edge bg-surface-alt px-3 py-0.5">
            <span className="text-xs font-medium text-text-secondary">预览</span>
            <button
              onClick={() => setShowPreview(false)}
              className="dn-focus inline-flex min-h-[44px] items-center px-3 text-xs text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
            >
              收起
            </button>
          </div>
          <iframe
            srcDoc={code}
            className="h-[400px] w-full border-0"
            sandbox="allow-scripts"
            title="exercise-preview"
          />
        </div>
      )}
    </div>
  );
}
