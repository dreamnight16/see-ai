'use client';

import VibeCodingFlow from '@/components/visualizations/VibeCodingFlow';
import TokenStream from '@/components/visualizations/TokenStream';
import DomTree from '@/components/visualizations/DomTree';
import BoxModelVisualizer from '@/components/visualizations/BoxModelVisualizer';
import { Eye } from 'lucide-react';

// Map lesson IDs to their relevant visualizations
const VIZ_MAP: Record<string, { title: string; description: string; component: React.ReactNode }> = {
  '1-3': {
    title: 'Vibe Coding 是怎么工作的',
    description: '点击播放，看懂整个流程',
    component: <VibeCodingFlow />,
  },
  '2-1': {
    title: 'AI 如何理解你的需求',
    description: '看 AI 怎么把你的一句话变成完整代码',
    component: <TokenStream />,
  },
  '3-1': {
    title: '浏览器如何理解 HTML',
    description: '代码怎么变成网页结构',
    component: <DomTree />,
  },
  '6-1': {
    title: '每个元素都是一个盒子',
    description: '理解 CSS 盒模型，布局不再难',
    component: <BoxModelVisualizer />,
  },
};

interface LessonVisualizationsProps {
  lessonId: string;
}

/**
 * 挂在特定课上的概念演示。
 * 演示可以暂停；不播放时静态结构同样可读，动画不是理解的前提。
 */
export default function LessonVisualizations({ lessonId }: LessonVisualizationsProps) {
  const viz = VIZ_MAP[lessonId];
  if (!viz) return null;

  return (
    <section className="mt-12" aria-label="概念演示">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-cyan text-on-color">
          <Eye className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-xl leading-tight">{viz.title}</h2>
          <p className="mt-1 text-xs text-text-secondary">{viz.description}</p>
        </div>
      </div>
      <div className="mt-5">{viz.component}</div>
    </section>
  );
}
