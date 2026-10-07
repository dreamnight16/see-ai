import type { Metadata } from 'next';
import ProjectGallery from '@/components/showcase/ProjectGallery';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: '我的作品 - 梦夜的 AI 课',
};

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-[1000px] mx-auto px-6 py-12 md:py-16">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          返回首页
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="decorative-line mb-4" />
          <h1 className="font-display text-3xl md:text-4xl font-bold">我的作品</h1>
          <p className="text-muted mt-3 text-lg">
            你在 Playground 中创作的所有作品都在这里
          </p>
        </div>

        {/* Gallery */}
        <ProjectGallery />

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-edge text-center">
          <Link
            href="/lesson/3-1"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            继续创作
          </Link>
        </div>
      </div>
    </div>
  );
}
