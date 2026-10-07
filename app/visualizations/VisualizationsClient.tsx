'use client';

import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';
import VibeCodingFlow from '@/components/visualizations/VibeCodingFlow';
import TokenStream from '@/components/visualizations/TokenStream';
import DomTree from '@/components/visualizations/DomTree';
import BoxModelVisualizer from '@/components/visualizations/BoxModelVisualizer';

export default function VisualizationsClient() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-[1000px] mx-auto px-6 py-12 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          返回首页
        </Link>

        <div className="mb-10">
          <div className="decorative-line mb-4" />
          <h1 className="font-display text-3xl md:text-4xl font-bold">可视化演示</h1>
          <p className="text-muted mt-3 text-lg">
            用动画理解编程概念，比死记硬背直观 10 倍
          </p>
        </div>

        <div className="space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-accent" />
              <h2 className="font-display text-xl font-bold">Vibe Coding 完整流程</h2>
            </div>
            <VibeCodingFlow />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-accent" />
              <h2 className="font-display text-xl font-bold">代码是怎样一步步写出来的</h2>
            </div>
            <TokenStream />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-accent" />
              <h2 className="font-display text-xl font-bold">HTML → DOM 树</h2>
            </div>
            <DomTree />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-accent" />
              <h2 className="font-display text-xl font-bold">CSS 盒模型</h2>
            </div>
            <BoxModelVisualizer />
          </section>
        </div>
      </div>
    </div>
  );
}
