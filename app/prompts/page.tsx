import type { Metadata } from "next";
import PromptLibrary from "@/components/prompts/PromptLibrary";
import ToolHeader from "@/components/shell/ToolHeader";
import { promptTemplates, PROMPT_CATEGORIES } from "@/lib/prompt-library";

export const metadata: Metadata = {
  title: "提示词库 | 见 AI",
  description: "可以直接复制去用的话术，覆盖生活、办公、写作、表格、翻译、图片、音视频和学习辅导。",
};

export default function Page() {
  return (
    <div>
      <ToolHeader
        kicker="提示词库 · 不需要联网"
        title={`对着对话框不知道说什么，就到这里抄一条`}
        lead="这是最常卡住人的一道坎：打开对话框，脑子一片空白。这里按场景收了一批现成的话术，带【】的地方换成你自己的情况，复制走就行。"
        field="bg-violet text-on-color"
        facts={[
          { value: String(promptTemplates.length), label: "条现成话术" },
          { value: String(PROMPT_CATEGORIES.length), label: "个分类" },
        ]}
        footnote="每一条都写在源码里（lib/prompt-library.ts），页面不请求任何接口。"
      />
      <div className="mx-auto max-w-[var(--see-shell)] px-[var(--see-gutter)] py-10">
        <PromptLibrary />
      </div>
    </div>
  );
}
