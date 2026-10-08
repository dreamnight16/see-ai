"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { totalLessons, getLessonsGroupedByTrack } from "@/lib/lessons";
import { getTrack } from "@/lib/tracks";
import { trackVisual } from "@/components/track-visuals";
import { Menu, X, ChevronRight, FolderOpen, BarChart3, Library, Target, BookMarked, Compass } from "lucide-react";
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

/**
 * 课程页的目录。
 *
 * 桌面端是常驻侧栏，移动端是抽屉：先打开、再关闭，关闭时焦点回到触发按钮，
 * 底层课程页面始终保持挂载（不清空正文，也不重置滚动位置）。
 */
export default function LessonNavigator() {
  const pathname = usePathname();
  const currentId = pathname.split("/").pop();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState<Record<string, boolean>>(buildProgressMap);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribe(() => setProgress(buildProgressMap()));
    return () => {
      unsubscribe();
    };
  }, []);

  // Escape 关闭；打开时锁住底层滚动但不卸载底层内容
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const grouped = getLessonsGroupedByTrack();
  const completedCount = Object.values(progress).filter(Boolean).length;
  const overallPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const nav = (
    <>
      <div className="shrink-0 border-b border-edge px-4 py-4">
        <p className="see-kicker text-text-secondary">课程目录</p>
        <p className="mt-2 text-sm tabular-nums">
          <span className="font-semibold">{completedCount}</span>
          <span className="text-text-secondary"> / {totalLessons} 课完成</span>
        </p>
        <span className="mt-2 block h-1.5 w-full bg-surface-raised" aria-hidden="true">
          <span className="block h-full bg-teal" style={{ width: overallPct + "%" }} />
        </span>
      </div>

      <nav aria-label="课程目录" className="flex-1 overflow-y-auto py-2">
        {grouped.map(({ trackId, modules }) => {
          const track = getTrack(trackId);
          if (!track) return null;
          const visual = trackVisual(track.color);
          const trackLessons = modules.flatMap((m) => m.lessons);
          const trackDone = trackLessons.filter((l) => progress[l.id]).length;
          const allDone = trackDone === trackLessons.length && trackLessons.length > 0;

          return (
            <section key={trackId} className="mb-4">
              <h3 className="flex items-center gap-2.5 px-4 py-2">
                <span
                  className={
                    "flex h-7 min-w-[28px] items-center justify-center px-1 text-[11px] font-semibold tabular-nums " +
                    (allDone ? "bg-emerald text-on-color" : visual.field)
                  }
                >
                  {allDone ? "✓" : trackDone + "/" + trackLessons.length}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs font-semibold uppercase tracking-[2.2px] text-text-secondary">
                  {track.name}
                </span>
              </h3>

              {modules.map((group) => (
                <div key={group.module} className="mb-2">
                  <p className="px-4 py-1 text-[11px] text-text-secondary">{group.module}</p>
                  <ul>
                    {group.lessons.map((lesson) => {
                      const isActive = lesson.id === currentId;
                      const isCompleted = progress[lesson.id];
                      return (
                        <li key={lesson.id}>
                          <Link
                            href={"/lesson/" + lesson.id}
                            aria-current={isActive ? "page" : undefined}
                            onClick={() => setOpen(false)}
                            className={
                              "dn-focus flex min-h-[44px] items-center gap-2.5 px-4 py-2 text-sm " +
                              (isActive
                                ? "bg-teal font-semibold text-on-color"
                                : "text-text-primary hover:bg-surface-alt")
                            }
                          >
                            <span className="shrink-0" aria-hidden="true">
                              {isCompleted ? (
                                <span className="flex h-4 w-4 items-center justify-center bg-emerald">
                                  <svg className="h-2.5 w-2.5 text-on-color" viewBox="0 0 12 12" fill="none">
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
                                <ChevronRight className="h-4 w-4" />
                              ) : (
                                <span className="block h-4 w-4 border border-edge-strong" />
                              )}
                            </span>

                            <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                            {lesson.type === "project" && (
                              <span
                                className={
                                  "shrink-0 px-1.5 py-0.5 text-[10px] font-semibold " +
                                  (isActive ? "bg-[var(--dn-ink-primary)] text-on-ink" : "bg-orange text-on-color")
                                }
                              >
                                实战
                              </span>
                            )}
                            <span className="sr-only">
                              {isCompleted ? "已完成" : "未完成"}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </section>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-edge py-2">
        {SIDE_LINKS.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className="dn-focus flex min-h-[44px] items-center gap-2.5 px-4 text-xs text-text-secondary hover:bg-surface-alt hover:text-text-primary"
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="打开课程目录"
        aria-expanded={open}
        className="dn-focus dn-interactive fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center bg-teal text-on-color lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <aside className="dn-elevation-0 sticky top-[var(--see-header-h)] hidden h-[calc(100vh_-_var(--see-header-h))] w-[300px] shrink-0 flex-col border-r border-edge bg-surface lg:flex">
        {nav}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="关闭课程目录"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            className="absolute inset-0 h-full w-full cursor-default bg-[var(--dn-overlay)]"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="课程目录"
            tabIndex={-1}
            className="dn-elevation-4 absolute inset-y-0 left-0 flex w-[88%] max-w-[340px] flex-col bg-surface outline-none"
          >
            <div className="flex items-center justify-end border-b border-edge px-2 py-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                aria-label="关闭课程目录"
                className="dn-focus flex h-11 w-11 items-center justify-center border border-edge-strong"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col">{nav}</div>
          </div>
        </div>
      )}
    </>
  );
}
