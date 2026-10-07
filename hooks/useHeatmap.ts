'use client';

import { useState } from 'react';
import { loadProgress } from '@/lib/progress';

export interface DayActivity {
  date: string;
  xp: number;
  level: number; // 0-4 intensity level
}

export function useHeatmap(): { data: DayActivity[]; maxXp: number } {
  const [{ data, maxXp }] = useState(() => {
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
  });

  return { data, maxXp };
}
