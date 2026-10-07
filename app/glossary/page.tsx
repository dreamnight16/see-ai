import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Rss } from "lucide-react";
import GlossaryBrowser from "@/components/glossary/GlossaryBrowser";

export const metadata: Metadata = {
  title: "AI 名词表 | 见 AI",
  description: "把听到过的 AI 术语用大白话讲一遍，每个词配一个生活里的比方和一处容易踩的坑。",
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
          听不懂的词，都在这儿
        </h1>
        <p className="text-lg text-muted max-w-2xl leading-relaxed">
          别人说起 token、幻觉、智能体，你不用装懂。这里每个词都配了一个生活里的比方，还有一句提醒你哪儿最容易被忽悠。
        </p>
      </header>

      <GlossaryBrowser />

      <div className="mt-10 flex items-start gap-3 p-5 rounded-xl bg-accent-soft/60 border border-accent/20">
        <Rss className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <p className="text-xs text-muted leading-relaxed">
          这里没收到的词，可以去{" "}
          <Link href="/trends" className="text-accent hover:underline">
            本周热词
          </Link>{" "}
          看看。那是每周自动抓的候选词，只有出处、没有解释——所以它只能当线索，不能当答案。
        </p>
      </div>

      <p className="mt-12 text-xs text-faint leading-relaxed">
        术语是别人发明的，听不懂不丢人。真正有用的一句话是：用大白话解释一下，举个例子。这句话对 AI 问，什么时候都好使。
      </p>
    </div>
  );
}
