'use client';

import { useMemo } from 'react';
import type { AdaptiveRecommendation } from '@/lib/adaptive';
import { getRecommendations } from '@/lib/adaptive';
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

export default function Recommendations({ lessonId, limit = 3 }: RecommendationsProps) {
  const recs: AdaptiveRecommendation[] = useMemo(
    () => getRecommendations(lessonId).slice(0, limit),
    [lessonId, limit],
  );

  if (recs.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-warning" />
        学习建议
      </p>
      {recs.map((rec) => {
        const IconComponent = ICON_MAP[rec.icon] || ChevronRight;
        // 建议可能指向某一课，也可能指向提示词库、练习场这类页面
        const target = rec.lessonId ? `/lesson/${rec.lessonId}` : rec.href;

        return (
          <div key={`${rec.type}-${rec.lessonId || rec.reason}`}>
            {target ? (
              <Link
                href={target}
                className="flex items-center gap-3 p-3 rounded-xl card hover:border-accent/20 transition-all group cursor-pointer"
              >
                <span className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center shrink-0">
                  <IconComponent className="w-4 h-4 text-accent" />
                </span>
                <span className="text-sm flex-1 min-w-0">{rec.reason}</span>
                <ChevronRight className="w-4 h-4 text-faint group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl card transition-all">
                <span className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center shrink-0">
                  <IconComponent className="w-4 h-4 text-accent" />
                </span>
                <span className="text-sm flex-1 min-w-0">{rec.reason}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
