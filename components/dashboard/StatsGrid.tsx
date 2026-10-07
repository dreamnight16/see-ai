'use client';

import { useState } from 'react';
import { loadProgress } from '@/lib/progress';
import { calculateLevel } from '@/lib/gamification';
import { lessons } from '@/lib/lessons';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { BookOpen, Trophy, Flame, Star, Calendar, Clock, Zap } from 'lucide-react';

interface StatCard {
  label: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  color: string;
}

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
      {
        label: '完成课程',
        value: completed,
        suffix: ` / ${lessons.length}`,
        icon: <BookOpen className="w-5 h-5" />,
        color: 'text-accent',
      },
      {
        label: '学习等级',
        value: gs ? calculateLevel(gs.xp) : 1,
        suffix: '',
        icon: <Star className="w-5 h-5" />,
        color: 'text-warning',
      },
      {
        label: '测验通过',
        value: quizPassed,
        suffix: '',
        icon: <Trophy className="w-5 h-5" />,
        color: 'text-success',
      },
      {
        label: '累计 XP',
        value: gs?.totalXpEarned || 0,
        suffix: '',
        icon: <Zap className="w-5 h-5" />,
        color: 'text-accent',
      },
      {
        label: '学习连胜',
        value: gs?.currentStreak || 0,
        suffix: ' 天',
        icon: <Flame className="w-5 h-5" />,
        color: 'text-warning',
      },
      {
        label: '活跃天数',
        value: daysActive,
        suffix: ' 天',
        icon: <Calendar className="w-5 h-5" />,
        color: 'text-info',
      },
      {
        label: '学习时长',
        value: totalMinutes,
        suffix: ' 分钟',
        icon: <Clock className="w-5 h-5" />,
        color: 'text-success',
      },
      {
        label: '徽章',
        value: gs?.badges?.length || 0,
        suffix: '',
        icon: <Trophy className="w-5 h-5" />,
        color: 'text-warning',
      },
    ];
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-slide-up">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="card p-4 flex flex-col gap-1.5 hover:scale-[1.02] transition-transform"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <span className={`${stat.color} shrink-0`}>{stat.icon}</span>
          <div className="text-2xl font-bold font-display tabular-nums">
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
          </div>
          <span className="text-[11px] text-muted">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
