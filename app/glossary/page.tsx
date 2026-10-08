import type { Metadata } from "next";
import Link from "next/link";
import GlossaryBrowser from "@/components/glossary/GlossaryBrowser";
import ToolHeader from "@/components/shell/ToolHeader";
import { glossaryTerms, GLOSSARY_GROUPS } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "AI 名词表 | 见 AI",
  description: "把听到过的 AI 术语用大白话讲一遍，每个词配一个生活里的比方和一处容易踩的坑。",
};

export default function Page() {
  const groupNames = GLOSSARY_GROUPS.map((g) => g.name);

  return (
    <div>
      <ToolHeader
        kicker="名词表 · 全部由人写，不联网"
        title="听不懂的词，都在这儿"
        lead="别人说起 token、幻觉、智能体，你不用装懂。这里每个词都配了一个生活里的比方，还有一句提醒你哪儿最容易被忽悠。"
        field="bg-cyan text-on-color"
        facts={[
          { value: String(glossaryTerms.length), label: "个术语" },
          { value: String(GLOSSARY_GROUPS.length), label: "个分组" },
        ]}
        footnote={`分组：${groupNames.join(" / ")}。解释由人写完再上线，机器写的东西没人核对过，不放上来。`}
      />

      <div className="mx-auto max-w-[var(--see-shell)] px-[var(--see-gutter)] py-10">
        <GlossaryBrowser />

        <div className="mt-10 flex max-w-[68ch] items-start gap-3 border-l-4 border-cyan bg-cyan-tint p-5">
          <p className="text-xs leading-relaxed text-text-primary">
            这里没收到的词，可以去{" "}
            <Link href="/trends" className="see-link">
              本周热词
            </Link>{" "}
            看看。那是每周自动抓的候选词，只有出处、没有解释——所以它只能当线索，不能当答案。
          </p>
        </div>

        <p className="mt-10 max-w-[68ch] text-sm leading-relaxed text-text-secondary">
          术语是别人发明的，听不懂不丢人。真正有用的一句话是：用大白话解释一下，举个例子。
          这句话对 AI 问，什么时候都好使。
        </p>
      </div>
    </div>
  );
}
