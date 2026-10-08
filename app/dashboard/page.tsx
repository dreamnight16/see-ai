import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';
import ToolHeader from '@/components/shell/ToolHeader';
import { lessons } from '@/lib/lessons';
import { BADGES } from '@/lib/achievements';
import { quizzes } from '@/lib/quiz-data';

export const metadata: Metadata = {
  title: '学习数据 - 见 AI',
};

export default function DashboardPage() {
  return (
    <div>
      <ToolHeader
        kicker="学习数据 · 全部来自本机浏览器"
        title="你的学习旅程，每一分努力都看得见"
        lead="等级、经验、连胜、热力图和能力雷达都由你自己的学习记录算出。这些数据从来没有离开过这台设备，也没有和其他人比较的排行榜。"
        field="bg-teal text-on-color"
        facts={[
          { value: String(lessons.length), label: '节可学的课' },
          { value: String(Object.keys(quizzes).length), label: '套章节测验' },
          { value: String(BADGES.length), label: '个可解锁徽章' },
        ]}
        footnote="上面三个数字来自课程数据；下面的统计来自你在本机的学习记录。没有记录时一律显示 0，不做演示数据填充。"
      />
      <div className="mx-auto max-w-[var(--see-shell)] px-[var(--see-gutter)] py-10">
        <DashboardClient />
      </div>
    </div>
  );
}
