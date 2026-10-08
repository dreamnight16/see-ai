'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Code2, Lightbulb, ListChecks, AlertTriangle } from 'lucide-react';

interface CodeReviewProps {
  code: string;
  onClose: () => void;
}

interface ReviewResult {
  strengths: string[];
  suggestions: string[];
  simpleExplanation: string;
}

/**
 * 审阅结果。
 *
 * 三块提示区都用「同色 14% 淡底 + text-text-primary 正文」，
 * 彩色只留给小标题的派生墨色（*-ink）和左侧 3px 实色条；
 * 每块的图标与标题文字保持不变，去掉颜色也认得出是哪一块。
 */
export default function CodeReview({ code, onClose }: CodeReviewProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState('');

  async function requestReview() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || '审阅请求失败');
      }
      if (!response.body) throw new Error('无响应');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let text = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
      }
      setResult(parseReview(text));
    } catch (e) {
      setError(e instanceof Error ? e.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card space-y-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-teal text-on-color">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-display text-lg">请助手看一眼（可选）</span>
        </div>
        <button
          onClick={onClose}
          className="dn-focus inline-flex min-h-[44px] items-center px-3 text-xs text-text-secondary transition-colors hover:bg-surface-alt hover:text-text-primary"
        >
          关闭
        </button>
      </div>

      {!result && !loading && !error && (
        <div className="space-y-3 py-8 text-center">
          <Code2 className="mx-auto h-12 w-12 text-text-secondary" aria-hidden="true" />
          <p className="text-sm text-text-secondary">它会先说清楚代码现在做了什么，再指出一两个值得动手改的地方。</p>
          <button
            onClick={requestReview}
            className="dn-focus dn-interactive inline-flex min-h-[44px] items-center gap-2 bg-teal px-5 text-sm font-semibold text-on-color"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            开始审阅
          </button>
        </div>
      )}

      {loading && (
        <div className="space-y-3 py-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-teal-ink" aria-hidden="true" />
          <p className="text-sm text-text-secondary">正在逐行看这段代码...</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2.5 border-l-[3px] border-amber bg-amber-tint p-4 text-sm text-text-primary">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-ink" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Simple explanation */}
          <div className="border-l-[3px] border-teal bg-teal-tint p-4">
            <div className="mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-teal-ink" aria-hidden="true" />
              <span className="text-sm font-semibold text-teal-ink">先说人话</span>
            </div>
            <p className="text-sm leading-relaxed text-text-primary">{result.simpleExplanation}</p>
          </div>

          {/* Strengths */}
          <div className="border-l-[3px] border-emerald bg-emerald-tint p-4">
            <div className="mb-2 flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-emerald-ink" aria-hidden="true" />
              <span className="text-sm font-semibold text-emerald-ink">做得好的地方</span>
            </div>
            <ul className="space-y-1.5">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                  <span aria-hidden="true" className="mt-1 shrink-0 text-xs text-emerald-ink">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div className="border-l-[3px] border-amber bg-amber-tint p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-ink" aria-hidden="true" />
              <span className="text-sm font-semibold text-amber-ink">可以改进的地方</span>
            </div>
            <ul className="space-y-1.5">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                  <span aria-hidden="true" className="mt-1 shrink-0 text-xs text-amber-ink">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function parseReview(text: string): ReviewResult {
  // Parse the AI response into structured sections
  const simpleExplanation = extractSection(text, '大白话解释', '这段代码') || text.slice(0, 200);
  const strengths = extractList(text, '好的', '改进');
  const suggestions = extractList(text, '改进', '');

  return {
    strengths: strengths.length > 0 ? strengths : ['代码结构清晰，可以正常运行'],
    suggestions: suggestions.length > 0 ? suggestions : ['可以继续完善和美化'],
    simpleExplanation: simpleExplanation,
  };
}

function extractSection(text: string, start: string, end: string): string {
  const startIdx = text.indexOf(start);
  if (startIdx === -1) return '';
  let content = text.slice(startIdx + start.length);
  if (end) {
    const endIdx = content.indexOf(end);
    if (endIdx !== -1) content = content.slice(0, endIdx);
  }
  return content.replace(/^[：:]/g, '').trim().slice(0, 500);
}

function extractList(text: string, start: string, end: string): string[] {
  const section = extractSection(text, start, end);
  if (!section) return [];
  return section
    .split('\n')
    .map((l) => l.replace(/^[-•*\d.]\s*/, '').trim())
    .filter((l) => l.length > 5);
}
