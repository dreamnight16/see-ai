import type { Metadata } from 'next';
import VisualizationsClient from './VisualizationsClient';

export const metadata: Metadata = {
  title: '可视化演示 - 梦夜的 AI 课',
};

export default function VisualizationsPage() {
  return <VisualizationsClient />;
}
