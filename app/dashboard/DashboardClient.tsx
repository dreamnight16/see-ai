'use client';

import Link from 'next/link';
import { Trophy } from 'lucide-react';
import StatsGrid from '@/components/dashboard/StatsGrid';
import Heatmap from '@/components/dashboard/Heatmap';
import SkillRadar from '@/components/dashboard/SkillRadar';
import GamificationStatus from '@/components/gamification/GamificationStatus';

export default function DashboardClient() {
  return (
    <div>
      <section aria-label="等级概览">
        <GamificationStatus />
      </section>

      <section aria-label="学习统计" className="mt-8">
        <h2 className="see-kicker text-text-secondary">统计</h2>
        <div className="mt-3">
          <StatsGrid />
        </div>
      </section>

      <section aria-label="学习图表" className="mt-10 grid gap-[3px] lg:grid-cols-2">
        <Heatmap />
        <SkillRadar />
      </section>

      <div className="mt-12 border-t border-edge pt-8">
        <Link
          href="/showcase"
          className="dn-focus dn-interactive inline-flex min-h-[48px] items-center gap-2 bg-teal px-6 text-sm font-semibold text-on-color"
        >
          <Trophy className="h-4 w-4" aria-hidden="true" />
          查看我的作品
        </Link>
      </div>
    </div>
  );
}
