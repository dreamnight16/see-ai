'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { loadProgress, saveProgress } from '@/lib/progress';
import { loadProjects } from '@/lib/projects';
import type { GamificationState } from '@/lib/gamification';
import { calculateLevel, xpForNextLevel, emptyGamification, updateStreak, awardXp } from '@/lib/gamification';
import { checkNewBadges } from '@/lib/achievements';
import { Flame, Trophy, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface GamificationStatusProps {
  compact?: boolean;
  onBadgeUnlock?: (badgeId: string) => void;
}

/**
 * 每次经验值变化后重算一遍徽章。
 * 判定用的数据全部来自本地进度，不联网。
 */
function syncBadges(state: GamificationState): GamificationState {
  const progress = loadProgress();
  const entries = Object.entries(progress.lessons);

  let projectCount = 0;
  try {
    projectCount = loadProjects().length;
  } catch {
    projectCount = 0;
  }

  const fresh = checkNewBadges(
    {
      completedLessons: entries.filter(([, v]) => v.completed).map(([k]) => k),
      passedQuizIds: entries
        .filter(([, v]) => v.quizCompleted && (v.quizScore ?? 0) >= 60)
        .map(([k]) => k),
      perfectQuizIds: entries.filter(([, v]) => v.quizScore === 100).map(([k]) => k),
      projectCount,
      currentStreak: state.currentStreak,
      exercisesCompleted: progress.exercisesCompleted ?? [],
      promptChecks: progress.promptChecks ?? 0,
    },
    state.badges,
  );

  if (fresh.length === 0) return state;

  const reward = fresh.reduce((sum, b) => sum + b.xpReward, 0);
  return {
    ...state,
    badges: [...state.badges, ...fresh.map((b) => b.id)],
    pendingBadgeUnlocks: [...state.pendingBadgeUnlocks, ...fresh.map((b) => b.id)],
    xp: state.xp + reward,
    totalXpEarned: state.totalXpEarned + reward,
  };
}

export default function GamificationStatus({ compact = false, onBadgeUnlock }: GamificationStatusProps) {
  // 初始化时先补算一次徽章，处理"上次拿了但没来得及弹"的情况。
  // 放在惰性初始化里而不是 effect 里，是为了避免挂载后立刻又触发一轮渲染。
  const [gamification, setGamification] = useState<GamificationState>(() =>
    syncBadges(loadProgress().gamification || emptyGamification()),
  );
  const level = calculateLevel(gamification.xp);
  const xpProgress = xpForNextLevel(gamification.xp);
  const xpPct = xpProgress.next > 0 ? Math.round((xpProgress.current / xpProgress.next) * 100) : 100;

  const handleEvent = useCallback((xpAmount: number) => {
    setGamification((prev) => syncBadges(updateStreak(awardXp(prev, xpAmount))));
  }, []);

  // 订阅游戏事件
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    import('@/lib/events').then(({ onGameEvent }) => {
      cleanups.push(onGameEvent('lesson:completed', () => handleEvent(50)));
      cleanups.push(onGameEvent('quiz:completed', (evt) => {
        const score = (evt as { score: number }).score;
        handleEvent(score >= 60 ? 30 : 10);
      }));
      cleanups.push(onGameEvent('playground:generated', () => handleEvent(20)));
      cleanups.push(onGameEvent('exercise:completed', () => handleEvent(15)));
      cleanups.push(onGameEvent('prompt:reviewed', () => handleEvent(15)));
      cleanups.push(onGameEvent('daily:visit', () => {
        setGamification((prev) => syncBadges(updateStreak(prev)));
      }));
    });
    return () => { cleanups.forEach((fn) => fn()); };
  }, [handleEvent]);

  // 徽章解锁后通知外层弹窗。
  // 这里只调用外部的回调，不动自己的 state——弹窗队列由 AppShell 自己管，
  // 在 effect 里 setState 会引发级联渲染。
  const notified = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!onBadgeUnlock) return;
    for (const badgeId of gamification.badges) {
      if (notified.current.has(badgeId)) continue;
      notified.current.add(badgeId);
      onBadgeUnlock(badgeId);
    }
  }, [gamification.badges, onBadgeUnlock]);

  // 变化后写回进度
  useEffect(() => {
    if (gamification.xp === 0 && gamification.lastActiveDate === '') return;
    const progress = loadProgress();
    progress.gamification = gamification;
    saveProgress(progress);
  }, [gamification]);

  if (compact) {
    // 顶栏里的紧凑版：等级是实色块，进度是直角条，连胜带图标 + 数字
    return (
      <Link
        href="/dashboard"
        aria-label={`等级 ${level}，已获得 ${gamification.totalXpEarned} 点经验，去学习数据页`}
        className="dn-focus group hidden items-center gap-3 sm:flex"
      >
        <span className="flex h-11 min-w-[44px] items-center justify-center bg-teal px-2 font-display text-base text-on-color tabular-nums">
          {level}
        </span>
        <span className="hidden w-20 flex-col gap-1 md:flex">
          <span className="text-[10px] font-semibold uppercase tracking-[2.2px] text-text-secondary">
            EXP
          </span>
          <span className="h-1.5 w-full bg-surface-raised">
            <span className="block h-full bg-teal" style={{ width: xpPct + '%' }} />
          </span>
        </span>
        {gamification.currentStreak > 0 && (
          <span className="flex items-center gap-1 text-sm font-semibold tabular-nums text-text-primary">
            <Flame className="h-4 w-4 text-amber-ink" aria-hidden="true" />
            {gamification.currentStreak}
            <span className="sr-only">天连续学习</span>
          </span>
        )}
        <ChevronRight className="h-4 w-4 text-text-secondary" aria-hidden="true" />
      </Link>
    );
  }

  // 完整版：四块信息色块，数字本身是视觉主体
  return (
    <div className="grid gap-[3px] sm:grid-cols-3">
      <div className="flex min-h-[96px] flex-col justify-between bg-teal p-4 text-on-color">
        <span className="see-kicker">等级</span>
        <span className="font-display text-4xl leading-none tabular-nums">
          Lv.{level}
        </span>
        <span className="text-[11px] tabular-nums">
          累计 {gamification.totalXpEarned} XP
        </span>
      </div>

      <div className="card flex min-h-[96px] flex-col justify-between p-4">
        <span className="see-kicker text-text-secondary">距离下一级</span>
        <span className="font-display text-4xl leading-none tabular-nums">
          {Math.max(0, xpProgress.next - xpProgress.current)}
        </span>
        <span className="h-2 w-full bg-surface-raised" aria-hidden="true">
          <span className="block h-full bg-teal" style={{ width: xpPct + '%' }} />
        </span>
        <span className="text-[11px] tabular-nums text-text-secondary">
          本级已得 {xpProgress.current} / {xpProgress.next}
        </span>
      </div>

      <div className="grid grid-rows-2 gap-[3px]">
        <div className="flex items-center gap-3 bg-amber px-4 text-on-color">
          <Flame className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="font-display text-2xl leading-none tabular-nums">
            {gamification.currentStreak}
          </span>
          <span className="text-xs font-semibold">天连续学习</span>
        </div>
        <div className="flex items-center gap-3 bg-violet px-4 text-on-color">
          <Trophy className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="font-display text-2xl leading-none tabular-nums">
            {gamification.badges.length}
          </span>
          <span className="text-xs font-semibold">个徽章</span>
        </div>
      </div>
    </div>
  );
}
