"use client";

import type { Lesson } from "@/lib/lessons";
import { Clock, Tag } from "lucide-react";

/**
 * 难度用「形状 + 文字 + 颜色」三重表达，色觉差异下同样能读。
 * 实色块上的文字统一用 --dn-text-on-color。
 */
const DIFFICULTY_CONFIG: Record<
  string,
  { label: string; className: string; mark: string }
> = {
  beginner: { label: "入门", className: "bg-emerald text-on-color", mark: "●" },
  intermediate: { label: "进阶", className: "bg-amber text-on-color", mark: "◆" },
  advanced: { label: "高级", className: "bg-violet text-on-color", mark: "▲" },
};

export default function LessonMeta({ lesson }: { lesson: Lesson }) {
  const diff = DIFFICULTY_CONFIG[lesson.difficulty] || DIFFICULTY_CONFIG.beginner;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span
        className={
          "inline-flex min-h-[32px] items-center gap-1.5 px-2.5 text-xs font-semibold " +
          diff.className
        }
      >
        <span aria-hidden="true">{diff.mark}</span>
        {diff.label}
      </span>

      <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary tabular-nums">
        <Clock className="h-4 w-4" aria-hidden="true" />
        约 {lesson.estimatedMinutes} 分钟
      </span>

      {lesson.type === "project" && (
        <span className="inline-flex min-h-[32px] items-center gap-1.5 bg-orange px-2.5 text-xs font-semibold text-on-color">
          <span aria-hidden="true">■</span>
          实战项目
        </span>
      )}

      {lesson.tags.length > 0 && (
        <span className="inline-flex flex-wrap items-center gap-1.5 text-xs text-text-secondary">
          <Tag className="h-3.5 w-3.5" aria-hidden="true" />
          {lesson.tags.map((tag) => (
            <span key={tag} className="bg-surface-raised px-2 py-0.5 text-text-primary">
              {tag}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}
