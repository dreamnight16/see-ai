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
    <div className="card p-5 space-y-4 animate-scale-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent" />
          </span>
          <span className="font-display font-bold text-base">请助手看一眼（可选）</span>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-muted hover:text-accent transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-alt"
        >
          关闭
        </button>
      </div>

      {!result && !loading && !error && (
        <div className="text-center py-8 space-y-3">
          <Code2 className="w-12 h-12 text-faint/40 mx-auto" />
          <p className="text-sm text-muted">它会先说清楚代码现在做了什么，再指出一两个值得动手改的地方。</p>
          <button
            onClick={requestReview}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:shadow-lg active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            开始审阅
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-8 space-y-3">
          <Loader2 className="w-8 h-8 text-accent mx-auto animate-spin" />
          <p className="text-sm text-muted">正在逐行看这段代码...</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl bg-warning-soft text-warning text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Simple explanation */}
          <div className="p-4 rounded-xl bg-accent-soft border border-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">先说人话</span>
            </div>
            <p className="text-sm leading-relaxed">{result.simpleExplanation}</p>
          </div>

          {/* Strengths */}
          <div className="p-4 rounded-xl bg-success-soft border border-success/10">
            <div className="flex items-center gap-2 mb-2">
              <ListChecks className="w-4 h-4 text-success" />
              <span className="text-sm font-semibold text-success">做得好的地方</span>
            </div>
            <ul className="space-y-1.5">
              {result.strengths.map((s, i) => (
                <li key={i} className="text-sm text-success flex items-start gap-2">
                  <span className="text-xs mt-1 shrink-0">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div className="p-4 rounded-xl bg-warning-soft border border-warning/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-warning" />
              <span className="text-sm font-semibold text-warning">可以改进的地方</span>
            </div>
            <ul className="space-y-1.5">
              {result.suggestions.map((s, i) => (
                <li key={i} className="text-sm text-warning flex items-start gap-2">
                  <span className="text-xs mt-1 shrink-0">→</span>
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
