"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { totalLessons, getLessonsGroupedByTrack } from "@/lib/lessons";
import { getTrack } from "@/lib/tracks";
import {
  Sparkles,
  Circle,
  Menu,
  X,
  ChevronRight,
  FolderOpen,
  BarChart3,
  Library,
  Target,
  BookMarked,
  Compass,
} from "lucide-react";
import { loadProgress, subscribe } from "@/lib/progress";

function buildProgressMap(): Record<string, boolean> {
  const p = loadProgress();
  const map: Record<string, boolean> = {};
  for (const [id, data] of Object.entries(p.lessons)) {
    map[id] = data.completed;
  }
  return map;
}

const SIDE_LINKS = [
  { href: "/start", icon: Compass, label: "我该从哪开始" },
  { href: "/prompts", icon: Library, label: "提示词库" },
  { href: "/practice", icon: Target, label: "练习场" },
  { href: "/glossary", icon: BookMarked, label: "名词表" },
  { href: "/dashboard", icon: BarChart3, label: "学习数据" },
  { href: "/showcase", icon: FolderOpen, label: "我的作品" },
];

export default function LessonNavigator() {
  const pathname = usePathname();
  const currentId = pathname.split("/").pop();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState<Record<string, boolean>>(buildProgressMap);

  useEffect(() => {
    const unsubscribe = subscribe(() => setProgress(buildProgressMap()));
    return () => {
      unsubscribe();
    };
  }, []);

  const grouped = getLessonsGroupedByTrack();
  const completedCount = Object.values(progress).filter(Boolean).length;

  const nav = (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-edge shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <div className="font-display font-bold text-base leading-tight group-hover:text-accent transition-colors">
              梦夜的 AI 课
            </div>
            <div className="text-[10px] text-muted">
              {completedCount} / {totalLessons} 课完成
            </div>
          </div>
        </Link>
      </div>

      {/* 课程：按轨道 → 章节 → 课程 */}
      <div className="p-3 space-y-4 overflow-y-auto flex-1">
        {grouped.map(({ trackId, modules }) => {
          const track = getTrack(trackId);
          if (!track) return null;
          const trackLessons = modules.flatMap((m) => m.lessons);
          const trackDone = trackLessons.filter((l) => progress[l.id]).length;
          const allDone = trackDone === trackLessons.length;

          return (
            <div key={trackId}>
              <div className="px-3 mb-2 flex items-center gap-2">
                <span
                  className={
                    "w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 " +
                    (allDone ? "bg-success text-white" : "bg-surface-raised text-muted")
                  }
                >
                  {allDone ? "✓" : trackDone}
                </span>
                <h3 className="text-[11px] font-semibold text-muted uppercase tracking-wider leading-tight line-clamp-1">
                  {track.name}
                </h3>
              </div>

              <div className="space-y-2">
                {modules.map((group) => (
                  <div key={group.module}>
                    <div className="px-3 mb-1 text-[10px] text-faint leading-tight line-clamp-1">
                      {group.module}
                    </div>
                    <ul className="space-y-0.5">
                      {group.lessons.map((lesson) => {
                        const isActive = lesson.id === currentId;
                        const isCompleted = progress[lesson.id];
                        return (
                          <li key={lesson.id}>
                            <Link
                              href={"/lesson/" + lesson.id}
                              onClick={() => setOpen(false)}
                              className={
                                "flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 " +
                                (isActive
                                  ? "bg-accent-soft text-accent font-semibold shadow-sm"
                                  : "text-muted hover:text-accent hover:bg-surface")
                              }
                            >
                              <span className="mt-[3px] shrink-0">
                                {isCompleted ? (
                                  <span className="w-4 h-4 rounded-full bg-success flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                                      <path
                                        d="M2.5 6L5 8.5L9.5 3.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </span>
                                ) : isActive ? (
                                  <ChevronRight className="w-4 h-4 text-accent" />
                                ) : (
                                  <Circle className="w-4 h-4 text-faint/40" />
                                )}
                              </span>

                              <div className="min-w-0 flex-1">
                                <div className="truncate">{lesson.title}</div>
                                {lesson.type === "project" && (
                                  <span className="text-[9px] text-warning font-medium">实战项目</span>
                                )}
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部入口 */}
      <div className="p-3 border-t border-edge shrink-0 space-y-0.5">
        {SIDE_LINKS.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted hover:text-accent hover:bg-surface transition-colors"
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* 移动端开关 */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="打开课程目录"
        className="lg:hidden fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-accent text-white shadow-glow flex items-center justify-center"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* 桌面端固定侧栏 */}
      <aside className="hidden lg:flex flex-col w-[280px] shrink-0 border-r border-edge bg-surface-alt h-screen sticky top-0">
        {nav}
      </aside>

      {/* 移动端抽屉 */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="relative w-[85%] max-w-[320px] bg-surface-alt h-full flex flex-col animate-slide-in-left">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="关闭课程目录"
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-muted"
            >
              <X className="w-4 h-4" />
            </button>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
