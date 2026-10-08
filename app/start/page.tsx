import type { Metadata } from "next";
import StartWizard from "@/components/StartWizard";
import ToolHeader from "@/components/shell/ToolHeader";
import { tracks } from "@/lib/tracks";
import { lessons } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "我该从哪开始 | 见 AI",
  description: "四个问题，帮你排出适合自己的学习顺序。",
};

export default function Page() {
  return (
    <div>
      <ToolHeader
        kicker="学习向导 · 四道题"
        title="十条轨道不用按顺序全学"
        lead="回答四个问题，这里会告诉你先走哪两条。答案只用来排序，不记录、不上传，随时可以重来。"
        field="bg-steel text-on-color"
        facts={[
          { value: String(tracks.length), label: "条轨道，全部可选" },
          { value: "4", label: "道题，一分钟" },
          { value: String(lessons.length), label: "节课，可跳着学" },
        ]}
        footnote="排出来的顺序只是建议，随时可以从课程表跳到任何一节课。"
      />
      <div className="mx-auto max-w-[var(--see-shell)] px-[var(--see-gutter)] py-10">
        <StartWizard />
      </div>
    </div>
  );
}
