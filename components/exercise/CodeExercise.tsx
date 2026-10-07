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
    <div className="card p-5 space-y-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
            <Play className="w-4 h-4 text-accent" />
          </span>
          <div>
            <h4 className="font-display font-bold text-base">{exercise.title}</h4>
            <p className="text-xs text-muted">{exercise.description}</p>
          </div>
        </div>
        {completed && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success bg-success-soft px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            完成
          </span>
        )}
      </div>

      {/* Expected behavior */}
      <div className="text-sm text-muted bg-surface-alt rounded-xl p-3.5 border border-edge/50">
        <span className="font-semibold text-text-primary">目标：</span>
        {exercise.expectedBehavior}
      </div>

      {/* Code editor */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 font-mono text-sm p-4 rounded-xl border border-edge bg-surface-alt resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
          spellCheck={false}
        />
        {completed && (
          <div className="absolute inset-0 bg-success-soft/30 rounded-xl flex items-center justify-center animate-scale-in pointer-events-none">
            <div className="bg-success text-white px-4 py-2 rounded-xl font-bold shadow-lg">
              完成！
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handlePreview}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:shadow-lg active:scale-95 transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
          预览
        </button>
        <button
          onClick={checkCompletion}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-edge text-sm text-muted hover:text-accent hover:border-accent/30 transition-all"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          检查
        </button>
        <button
          onClick={showNextHint}
          disabled={hintsRevealed >= exercise.hints.length}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-edge text-sm text-muted hover:text-warning hover:border-warning/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          提示 {hintsRevealed > 0 && `(${hintsRevealed}/${exercise.hints.length})`}
        </button>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-edge text-sm text-faint hover:text-muted transition-all ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重置
        </button>
      </div>

      {/* Hints */}
      {hintsRevealed > 0 && (
        <div className="space-y-2 animate-slide-down">
          {exercise.hints.slice(0, hintsRevealed).map((hint, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-warning-soft border border-warning/10 text-sm text-warning animate-pop-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{hint}</span>
            </div>
          ))}
        </div>
      )}

      {/* Preview toggle */}
      {showPreview && (
        <div className="border border-edge rounded-xl overflow-hidden animate-scale-in">
          <div className="flex items-center justify-between px-4 py-2 bg-surface-alt border-b border-edge">
            <span className="text-xs text-muted font-medium">预览</span>
            <button
              onClick={() => setShowPreview(false)}
              className="text-xs text-muted hover:text-accent transition-colors"
            >
              收起
            </button>
          </div>
          <iframe
            srcDoc={code}
            className="w-full h-[400px] border-0"
            sandbox="allow-scripts"
            title="exercise-preview"
          />
        </div>
      )}
    </div>
  );
}
