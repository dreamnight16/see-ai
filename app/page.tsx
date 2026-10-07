import Link from "next/link";
import {
  lessons,
  totalLessons,
  totalMinutes,
  getLessonsGroupedByTrack,
  getLessonsByTrack,
} from "@/lib/lessons";
import { tracks, getTrack } from "@/lib/tracks";
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Clock,
  Library,
  Target,
  BookMarked,
  FolderOpen,
  BarChart3,
  Eye,
  Compass,
  Code,
  Rss,
} from "lucide-react";
import TotalProgress from "@/components/TotalProgress";
import Recommendations from "@/components/learning/Recommendations";
import TrackCard from "@/components/TrackCard";
import DailyTask from "@/components/DailyTask";

const QUICK_LINKS = [
  { href: "/start", icon: Compass, label: "我该从哪开始" },
  { href: "/prompts", icon: Library, label: "提示词库" },
  { href: "/practice", icon: Target, label: "练习场" },
  { href: "/glossary", icon: BookMarked, label: "名词表" },
  { href: "/trends", icon: Rss, label: "本周热词" },
  { href: "/showcase", icon: FolderOpen, label: "我的作品" },
  { href: "/dashboard", icon: BarChart3, label: "学习数据" },
  { href: "/visualizations", icon: Eye, label: "可视化演示" },
];

export default function Home() {
  const grouped = getLessonsGroupedByTrack();
  const campusTrack = getTrack("campus");

  return (
    <div>
      {/* ── Hero ── */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-warm" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-accent-glow)_0%,_transparent_60%)]" />

        <div className="relative max-w-[1000px] mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-24">
          <div className="animate-slide-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/60 backdrop-blur border border-edge text-sm text-muted mb-8">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>{tracks.length} 条轨道 · {totalLessons} 节课 · 不配 API Key 也能学</span>
          </div>

          <h1 className="font-display text-hero font-black leading-none mb-6 animate-reveal">
            你手机里的豆包，
            <br />
            <span className="text-accent">不该只用来聊天</span>
          </h1>

          <p className="text-lg md:text-xl text-muted max-w-xl leading-relaxed mb-8 animate-slide-up stagger-2">
            这套课不讲模型原理，也不要求你会编程。它只解决一件事：让只会跟 AI 闲聊的人，
            第一次真正用它把一件正事干完——作业、论文、汇报、简历、社团、四六级。
            后面还会讲到智能体这些新东西，以及怎么分辨真技术和炒作。
          </p>

          <div className="flex flex-wrap items-center gap-4 animate-slide-up stagger-3">
            <Link
              href="/start"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-xl font-semibold text-lg shadow-glow hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <Compass className="w-5 h-5" />
              四道题，排个顺序
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={"/lesson/" + lessons[0].id}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-edge bg-surface/70 backdrop-blur font-medium text-muted hover:text-accent hover:border-accent/30 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              直接从第一课开始
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted mt-8 animate-slide-up stagger-4">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              全部学完约 {Math.round(totalMinutes / 60)} 小时
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              离线也能练
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Code className="w-4 h-4" />
              编程只是其中一条
            </span>
          </div>

          <div className="hidden md:block absolute right-10 top-1/2 -translate-y-1/2 opacity-15">
            <Sparkles className="w-48 h-48 text-accent" />
          </div>
        </div>
      </header>

      {/* ── 进度 ── */}
      <div className="max-w-[1000px] mx-auto px-6 -mt-6 relative z-10">
        <div className="card p-6 animate-slide-up stagger-4">
          <TotalProgress total={totalLessons} />
        </div>
      </div>

      {/* ── 今天就试这一件 ── */}
      <div className="max-w-[1000px] mx-auto px-6 mt-6 relative z-10">
        <div className="animate-slide-up stagger-5">
          <DailyTask />
        </div>
      </div>

      {/* ── 快捷入口 ── */}
      <div className="max-w-[1000px] mx-auto px-6 mt-4 relative z-10">
        <div className="flex flex-wrap items-center gap-3 animate-slide-up stagger-5">
          {QUICK_LINKS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-alt border border-edge text-sm text-muted hover:text-accent hover:border-accent/30 transition-all"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── 学习建议 ── */}
      <div className="max-w-[1000px] mx-auto px-6 mt-6 relative z-10">
        <div className="card p-6 animate-slide-up stagger-5">
          <Recommendations limit={3} />
        </div>
      </div>

      <main className="max-w-[1000px] mx-auto px-6 py-section">
        {/* ── 轨道 ── */}
        <section className="mb-16">
          <div className="mb-8 animate-fade-in">
            <div className="decorative-line mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              {tracks.length} 条轨道，按你的事挑
            </h2>
            <p className="text-muted mt-3 text-lg leading-relaxed max-w-2xl">
              不用从头学到尾。哪条轨道像你现在最头疼的事，就从那条开始。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </section>

        {/* ── 全部课程 ── */}
        <section>
          <div className="mb-8 animate-fade-in">
            <div className="decorative-line mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold">完整课程表</h2>
            <p className="text-muted mt-3 text-lg">
              共 {totalLessons} 节课。点开一条轨道，看里面每一节讲什么。
            </p>
          </div>

          <div className="space-y-4">
            {grouped.map(({ trackId, modules }, trackIndex) => {
              const track = getTrack(trackId);
              if (!track) return null;
              const trackLessons = getLessonsByTrack(trackId);
              const minutes = trackLessons.reduce((s, l) => s + l.estimatedMinutes, 0);
              const openByDefault = trackId === "campus" || trackId === "basics";

              return (
                <details
                  key={trackId}
                  open={openByDefault}
                  className="card overflow-hidden animate-reveal group"
                  style={{ animationDelay: trackIndex * 60 + "ms" }}
                >
                  <summary className="p-6 md:p-7 cursor-pointer list-none flex items-center gap-4 hover:bg-accent-soft/20 transition-colors">
                    <span className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center text-lg font-bold shadow-glow shrink-0">
                      {trackIndex + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-xl font-bold leading-tight">{track.name}</h3>
                      <p className="text-xs text-muted mt-1">
                        {trackLessons.length} 节课 · 约 {minutes} 分钟 · {track.tagline}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-faint shrink-0 transition-transform group-open:rotate-90" />
                  </summary>

                  <div className="px-6 md:px-7 pb-7 space-y-6">
                    {modules.map((group) => (
                      <div key={group.module}>
                        <h4 className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-3">
                          {group.module}
                        </h4>
                        <div className="grid gap-2 md:grid-cols-2">
                          {group.lessons.map((lesson) => (
                            <Link
                              key={lesson.id}
                              href={"/lesson/" + lesson.id}
                              className="flex items-start gap-3 p-3 -mx-1 rounded-xl hover:bg-accent-soft/50 transition-all group/item"
                            >
                              <span
                                className={
                                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 " +
                                  (lesson.type === "project"
                                    ? "bg-warning-soft text-warning"
                                    : "bg-accent-soft text-accent")
                                }
                              >
                                {lesson.type === "project" ? (
                                  <Code className="w-4 h-4" />
                                ) : (
                                  <BookOpen className="w-4 h-4" />
                                )}
                              </span>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm group-hover/item:text-accent transition-colors truncate">
                                    {lesson.title}
                                  </span>
                                  {lesson.type === "project" && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning-soft text-warning font-medium shrink-0">
                                      实战
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted mt-0.5 line-clamp-1">
                                  {lesson.description}
                                </p>
                              </div>

                              <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 mt-1 bg-surface-raised text-faint">
                                {lesson.estimatedMinutes} 分钟
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        {/* ── 结尾 ── */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="card p-10 md:p-16 gradient-warm border-accent/20">
            <Sparkles className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
              先挑一件今天就要做的事
            </h2>
            <p className="text-muted mb-6 max-w-lg mx-auto leading-relaxed">
              {campusTrack
                ? "作业、通知、简历、海报，随便哪一件。学完一节就去用一次，比一口气看完十节有用得多。"
                : "学完一节就去用一次，比一口气看完十节有用得多。"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/prompts"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-xl font-semibold text-lg shadow-glow hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                去翻提示词库
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/practice"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-edge font-medium text-muted hover:text-accent hover:border-accent/30 transition-all"
              >
                写一条试试
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-edge py-10 text-center">
        <p className="text-sm text-muted">
          <span className="font-display font-bold text-accent">见 AI</span>
          <span className="mx-2 text-faint">—</span>
          让每个人都能用起来
        </p>
        <p className="text-xs text-faint mt-2">
          不讲原理，只讲怎么用，以及什么时候别用
        </p>
      </footer>
    </div>
  );
}
