import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: '学习数据 - 见 AI',
};

export default function DashboardPage() {
  return <DashboardClient />;
}
