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
    return (
      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface transition-all group"
      >
        <span className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center text-xs font-bold text-accent">
          {level}
        </span>
        <div className="min-w-0 flex-1">
          <div className="h-1.5 rounded-full bg-surface-raised overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: (xpProgress.next > 0 ? (xpProgress.current / xpProgress.next) * 100 : 100) + '%' }}
            />
          </div>
        </div>
        {gamification.currentStreak > 0 && (
          <span className="text-xs text-warning flex items-center gap-0.5 tabular-nums">
            <Flame className="w-3 h-3" />
            {gamification.currentStreak}
          </span>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-faint group-hover:text-accent transition-colors" />
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-alt border border-edge animate-slide-up">
      <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center font-display font-bold text-lg shrink-0 shadow-glow">
        {level}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold">Lv.{level}</span>
          <span className="text-[10px] text-muted tabular-nums">
            {gamification.totalXpEarned} XP
          </span>
        </div>
        <div className="h-2 rounded-full bg-surface-raised overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-warning transition-all duration-700"
            style={{ width: (xpProgress.next > 0 ? (xpProgress.current / xpProgress.next) * 100 : 100) + '%' }}
          />
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {gamification.currentStreak > 0 && (
          <span className="text-sm font-semibold text-warning flex items-center gap-1 tabular-nums">
            <Flame className="w-4 h-4" />
            {gamification.currentStreak}
          </span>
        )}
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
        >
          {gamification.badges.length > 0 && (
            <span className="flex items-center gap-0.5">
              <Trophy className="w-3.5 h-3.5" />
              {gamification.badges.length}
            </span>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
