import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import StartWizard from "@/components/StartWizard";

export const metadata: Metadata = {
  title: "我该从哪开始 | 梦夜的 AI 课",
  description: "四个问题，帮你排出适合自己的学习顺序。",
};

export default function Page() {
  return (
    <div className="max-w-[1000px] mx-auto px-6 pt-14 pb-section">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors mb-8"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        回到课程首页
      </Link>

      <header className="mb-10">
        <div className="decorative-line mb-4" />
        <h1 className="font-display text-4xl md:text-5xl font-black leading-tight mb-4">
          四道题，排个顺序
        </h1>
        <p className="text-lg text-muted max-w-2xl leading-relaxed">
          十条轨道不用按顺序全学。回答四个问题，我告诉你先走哪两条，剩下的什么时候想学再说。
        </p>
      </header>

      <StartWizard />

      <p className="mt-12 text-xs text-faint leading-relaxed">
        排出来的顺序只是个建议。随时可以从首页的课程表里跳到任何一节课，学过的进度都记在你自己浏览器里。
      </p>
    </div>
  );
}
