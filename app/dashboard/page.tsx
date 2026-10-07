import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: '学习数据 - 梦夜的 AI 课',
};

export default function DashboardPage() {
  return <DashboardClient />;
}
