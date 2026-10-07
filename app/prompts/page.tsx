import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PromptLibrary from "@/components/prompts/PromptLibrary";

export const metadata: Metadata = {
  title: "提示词库 | 梦夜的 AI 课",
  description: "40 条可以直接复制去用的话术，覆盖生活、办公、写作、表格、翻译、图片、音视频和学习辅导。",
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
          别再从空白框开始
        </h1>
        <p className="text-lg text-muted max-w-2xl leading-relaxed">
          对着对话框不知道说什么，是最常见的一道坎。这里按场景收了一批现成的话术，带【】的地方换成你自己的情况，复制走就行。
        </p>
      </header>

      <PromptLibrary />

      <p className="mt-12 text-xs text-faint leading-relaxed">
        这些是起点，不是标准答案。用完之后回头把你说的话改一改，效果通常还能再好一截——想练这个，去 /practice 写一条，那里会告诉你漏了什么。
      </p>
    </div>
  );
}
