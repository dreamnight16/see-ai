import type { Metadata } from 'next';
import VisualizationsClient from './VisualizationsClient';

export const metadata: Metadata = {
  title: '可视化演示 - 见 AI',
};

export default function VisualizationsPage() {
  return <VisualizationsClient />;
}
