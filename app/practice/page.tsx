import type { Metadata } from "next";
import PromptLab from "@/components/practice/PromptLab";
import ToolHeader from "@/components/shell/ToolHeader";
import { practiceScenarios } from "@/lib/practice-scenarios";
import { CHECKLIST_LABELS } from "@/lib/prompt-coach";

export const metadata: Metadata = {
  title: "提示词练习场 | 见 AI",
  description: "挑一个真实场景，自己写一遍提问，本地规则立刻给你打分并指出漏掉了什么。不用配 API Key。",
};

export default function Page() {
  const detectorCount = Object.keys(CHECKLIST_LABELS).length;

  return (
    <div>
      <ToolHeader
        kicker="练习场 · 不联网、不花钱、不用注册"
        title="写一句，立刻知道差在哪"
        lead="挑一个场景，把你会发给 AI 的那段话原样写下来。下面的规则引擎会告诉你漏了哪几样，以及下一步该补哪一句——它只看要素全不全，不管文笔好不好。"
        field="bg-emerald text-on-color"
        facts={[
          { value: String(practiceScenarios.length), label: "个真实场景" },
          { value: String(detectorCount), label: "条本地检查规则" },
        ]}
        footnote="评分完全在你的浏览器里算，输入的内容不会离开这台设备。"
      />
      <div className="mx-auto max-w-[var(--see-shell)] px-[var(--see-gutter)] py-10">
        <PromptLab />
        <p className="mt-12 max-w-[68ch] text-sm leading-relaxed text-text-secondary">
          打分只看要素全不全，不管文笔好不好。目的就一个：让你伸手去写第二遍。
          写完三五个场景，你会发现自己的问法已经变了。
        </p>
      </div>
    </div>
  );
}
