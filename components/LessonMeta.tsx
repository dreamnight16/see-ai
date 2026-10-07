"use client";

import type { Lesson } from "@/lib/lessons";
import { Clock, Tag } from "lucide-react";

const DIFFICULTY_CONFIG: Record<string, { label: string; className: string; icon: string }> = {
  beginner: {
    label: "入门",
    className: "bg-success-soft text-success border-success/20",
    icon: "●"
  },
  intermediate: {
    label: "进阶",
    className: "bg-warning-soft text-warning border-warning/20",
    icon: "◆"
  },
  advanced: {
    label: "高级",
    className: "bg-accent-soft text-accent border-accent/20",
    icon: "▲"
  },
};

export default function LessonMeta({ lesson }: { lesson: Lesson }) {
  const diff = DIFFICULTY_CONFIG[lesson.difficulty] || DIFFICULTY_CONFIG.beginner;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Difficulty */}
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${diff.className}`}>
        <span className="text-[10px]">{diff.icon}</span>
        {diff.label}
      </span>

      {/* Duration */}
      <span className="inline-flex items-center gap-1.5 text-xs text-muted">
        <Clock className="w-3.5 h-3.5" />
        约 {lesson.estimatedMinutes} 分钟
      </span>

      {/* Type badge */}
      {lesson.type === "project" && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning-soft text-warning border border-warning/20">
          实战项目
        </span>
      )}

      {/* Tags */}
      {lesson.tags.length > 0 && (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <Tag className="w-3 h-3" />
          {lesson.tags.map((tag, i) => (
            <span key={tag}>
              {i > 0 && <span className="text-faint mx-0.5">·</span>}
              <span className="hover:text-accent transition-colors cursor-default">{tag}</span>
            </span>
          ))}
        </span>
      )}
    </div>
  );
}
