'use client';

import { useMemo } from 'react';
import type { AdaptiveRecommendation } from '@/lib/adaptive';
import { getRecommendations } from '@/lib/adaptive';
import { emptyProgress } from '@/lib/progress';
import { useHydrated } from '@/hooks/useHydrated';
import Link from 'next/link';
import { ChevronRight, Lightbulb, BookOpen, ArrowRight, RotateCcw, Wand, Trophy, Target, Library } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  ArrowRight,
  RotateCcw,
  Wand,
  Trophy,
  Target,
  Library,
  Lightbulb,
  ChevronRight,
};

interface RecommendationsProps {
  lessonId?: string;
  limit?: number;
}

/**
 * 学习建议完全由本地进度推导（lib/adaptive.ts），没有进度就退回「先看认识 AI」。
 *
 * 进度在 localStorage 里，服务端读不到：水合首帧必须拿"空进度"算一遍，
 * 才能和服务端渲染出来的那三条对上；否则 React 报 hydration 失败（#418），
 * 整个首页被丢回客户端重新渲染。水合完成后才用真实进度重算。
 */
export default function Recommendations({ lessonId, limit = 3 }: RecommendationsProps) {
  const hydrated = useHydrated();
  const recs: AdaptiveRecommendation[] = useMemo(
    () => getRecommendations(lessonId, hydrated ? undefined : emptyProgress()).slice(0, limit),
    [lessonId, limit, hydrated],
  );

  if (recs.length === 0) return null;

  return (
    <div>
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <Lightbulb className="h-4 w-4 text-amber-ink" aria-hidden="true" />
        接下来可以看
      </h2>
      <ul className="mt-3 border-t border-edge">
        {recs.map((rec) => {
          const IconComponent = ICON_MAP[rec.icon] || ChevronRight;
          // 建议可能指向某一课，也可能指向提示词库、练习场这类页面
          const target = rec.lessonId ? `/lesson/${rec.lessonId}` : rec.href;

          const inner = (
            <>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-teal-tint text-teal-ink">
                <IconComponent className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 text-sm">{rec.reason}</span>
              {target && (
                <ChevronRight className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
              )}
            </>
          );

          return (
            <li key={`${rec.type}-${rec.lessonId || rec.reason}`} className="border-b border-edge last:border-b-0">
              {target ? (
                <Link
                  href={target}
                  className="dn-focus flex min-h-[52px] items-center gap-3 py-2 hover:bg-surface-alt"
                >
                  {inner}
                </Link>
              ) : (
                <div className="flex min-h-[52px] items-center gap-3 py-2">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
