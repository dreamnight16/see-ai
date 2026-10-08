'use client';

import { useState } from 'react';
import { loadProgress } from '@/lib/progress';
import { calculateLevel } from '@/lib/gamification';
import { lessons } from '@/lib/lessons';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

interface StatCard {
  label: string;
  value: number;
  suffix: string;
  /** 实色块配色，字面量类名 */
  field: string;
}

/**
 * 八个统计项 = 八块品牌实色色块，数字用 DNDL 的 Display 字重打头。
 * 全部来自本机进度；没有记录时就是 0，不补演示数据。
 */
const FIELDS = [
  'bg-teal text-on-color',
  'bg-amber text-on-color',
  'bg-emerald text-on-color',
  'bg-violet text-on-color',
  'bg-orange text-on-color',
  'bg-steel text-on-color',
  'bg-cyan text-on-color',
  'bg-crimson text-on-color',
] as const;

export default function StatsGrid() {
  const [stats] = useState<StatCard[]>(() => {
    const progress = loadProgress();
    const gs = progress.gamification;
    const lessonVals = Object.values(progress.lessons);
    const completed = lessonVals.filter((l) => l.completed).length;
    const quizPassed = lessonVals.filter((l) => l.quizCompleted && (l.quizScore || 0) >= 60).length;
    const totalMinutes = lessons
      .filter((l) => progress.lessons[l.id]?.completed)
      .reduce((s, l) => s + l.estimatedMinutes, 0);

    const daysActive = gs?.activityLog ? Object.keys(gs.activityLog).length : 0;

    return [
      { label: '完成课程', value: completed, suffix: ` / ${lessons.length}`, field: FIELDS[0] },
      { label: '学习等级', value: gs ? calculateLevel(gs.xp) : 1, suffix: '', field: FIELDS[1] },
      { label: '测验通过', value: quizPassed, suffix: '', field: FIELDS[2] },
      { label: '累计 XP', value: gs?.totalXpEarned || 0, suffix: '', field: FIELDS[3] },
      { label: '学习连胜', value: gs?.currentStreak || 0, suffix: ' 天', field: FIELDS[4] },
      { label: '活跃天数', value: daysActive, suffix: ' 天', field: FIELDS[5] },
      { label: '学习时长', value: totalMinutes, suffix: ' 分钟', field: FIELDS[6] },
      { label: '徽章', value: gs?.badges?.length || 0, suffix: '', field: FIELDS[7] },
    ];
  });

  return (
    <dl className="grid grid-cols-2 gap-[3px] md:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={'dn-rise flex min-h-[128px] flex-col justify-between p-4 ' + stat.field}
          style={{ ["--dn-enter-index" as string]: i }}
        >
          <dd className="font-display text-[2.75rem] leading-none tabular-nums">
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
          </dd>
          <dt className="text-xs font-semibold">{stat.label}</dt>
        </div>
      ))}
    </dl>
  );
}
