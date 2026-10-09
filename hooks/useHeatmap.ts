'use client';

import { useMemo } from 'react';
import { loadProgress } from '@/lib/progress';

export interface DayActivity {
  date: string;
  xp: number;
  level: number; // 0-4 intensity level
}

/**
 * 最近 52 周的活动数据。
 *
 * 它有两个「只有浏览器里才对得上」的输入：本地进度，和「今天」是哪一天
 * （生产构建是静态预生成的，构建那天和访问那天经常不是同一天）。
 * 所以这里不自己判断，由调用方在水合完成后才传 true 进来：
 * 水合首帧返回空数组，让客户端首帧与服务端渲染结果一致，
 * 否则 React 报 hydration 失败（#418）并把整棵树丢回客户端重渲染。
 */
export function useHeatmap(hydrated: boolean): { data: DayActivity[]; maxXp: number } {
  return useMemo(() => {
    if (!hydrated) return { data: [] as DayActivity[], maxXp: 1 };

    const progress = loadProgress();
    const activityLog = progress.gamification?.activityLog || {};

    // Generate last 52 weeks of data
    const days: DayActivity[] = [];
    const today = new Date();
    const maxDayXp = Math.max(1, ...Object.values(activityLog));

    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const xp = activityLog[key] || 0;
      const level = xp === 0 ? 0 : Math.min(4, Math.ceil((xp / maxDayXp) * 4));
      days.push({ date: key, xp, level });
    }

    return { data: days, maxXp: maxDayXp };
  }, [hydrated]);
}
