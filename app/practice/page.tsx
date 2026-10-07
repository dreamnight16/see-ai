import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PromptLab from "@/components/practice/PromptLab";

export const metadata: Metadata = {
  title: "提示词练习场 | 见 AI",
  description: "挑一个真实场景，自己写一遍提问，本地规则立刻给你打分并指出漏掉了什么。不用配 API Key。",
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
          写一句，立刻知道差在哪
        </h1>
        <p className="text-lg text-muted max-w-2xl leading-relaxed">
          这里不用注册、不用配置、不联网。挑一个场景，把你会发给 AI 的那段话写出来，下面会告诉你漏了哪几样，以及下一步该补哪一句。
        </p>
      </header>

      <PromptLab />

      <p className="mt-12 text-xs text-faint leading-relaxed">
        打分只看要素全不全，不管文笔好不好。目的就一个：让你伸手去写第二遍。写完三五个场景，你会发现自己的问法已经变了。
      </p>
    </div>
  );
}
