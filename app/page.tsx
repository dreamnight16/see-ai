import Link from "next/link";
import { lessons } from "@/lib/lessons";
import { BookOpen, Sparkles, ArrowRight, Clock, Users, Code2, Zap, FolderOpen, BarChart3, Eye } from "lucide-react";
import TotalProgress from "@/components/TotalProgress";
import Recommendations from "@/components/learning/Recommendations";

export default function Home() {
  const modules = lessons.reduce(
    (acc, lesson) => {
      if (!acc[lesson.module]) acc[lesson.module] = [];
      acc[lesson.module].push(lesson);
      return acc;
    },
    {} as Record<string, typeof lessons>
  );

  const moduleEntries = Object.entries(modules);
  const totalMinutes = lessons.reduce((sum, l) => sum + l.estimatedMinutes, 0);

  return (
    <div>
      {/* ── Hero ── */}
      <header className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-warm" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-accent-glow)_0%,_transparent_60%)]" />

        <div className="relative max-w-[1000px] mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          {/* Badge */}
          <div className="animate-slide-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/60 backdrop-blur border border-edge text-sm text-muted mb-8">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span>零基础 · 7 个章节 · 22 节课</span>
          </div>

          {/* Main headline */}
          <h1 className="font-display text-hero font-black leading-none mb-6 animate-reveal">
            从看懂网页开始，
            <br />
            <span className="text-accent">做出自己的作品</span>
          </h1>

          <p className="text-lg md:text-xl text-muted max-w-xl leading-relaxed mb-8 animate-slide-up stagger-2">
            从网页结构、样式和交互开始，边学边做出属于自己的网站、工具和小应用。需要时再用 AI 辅助，不依赖它才能完成课程。
          </p>

          {/* CTA + stats */}
          <div className="flex flex-wrap items-center gap-6 animate-slide-up stagger-3">
            <Link
              href={`/lesson/${lessons[0].id}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-xl font-semibold text-lg shadow-glow hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <BookOpen className="w-5 h-5" />
              从第一课开始
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-6 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                约 {totalMinutes} 分钟
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                适合零基础
              </span>
            </div>
          </div>

          {/* Decorative floating elements */}
          <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
            <Code2 className="w-48 h-48 text-accent" />
          </div>
          <div
            className="hidden md:block absolute right-32 top-1/4 w-24 h-24 rounded-3xl border-2 border-accent/20 animate-float"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="hidden md:block absolute right-16 bottom-1/4 w-16 h-16 rounded-2xl border border-accent/15 animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>
      </header>

      {/* ── Progress bar ── */}
      <div className="max-w-[1000px] mx-auto px-6 -mt-6 relative z-10">
        <div className="card p-6 animate-slide-up stagger-4">
          <TotalProgress total={lessons.length} />
        </div>
      </div>

      {/* ── Quick nav ── */}
      <div className="max-w-[1000px] mx-auto px-6 mt-4 relative z-10">
        <div className="flex items-center gap-3 animate-slide-up stagger-5">
          <Link
            href="/showcase"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-alt border border-edge text-sm text-muted hover:text-accent hover:border-accent/30 transition-all"
          >
            <FolderOpen className="w-4 h-4" />
            我的作品
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-alt border border-edge text-sm text-muted hover:text-accent hover:border-accent/30 transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            学习数据
          </Link>
          <Link
            href="/visualizations"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-alt border border-edge text-sm text-muted hover:text-accent hover:border-accent/30 transition-all"
          >
            <Eye className="w-4 h-4" />
            可视化演示
          </Link>
        </div>
      </div>

      {/* ── Recommendations ── */}
      <div className="max-w-[1000px] mx-auto px-6 mt-6 relative z-10">
        <div className="card p-6 animate-slide-up stagger-5">
          <Recommendations limit={3} />
        </div>
      </div>

      {/* ── Course Outline ── */}
      <main className="max-w-[1000px] mx-auto px-6 py-section">
        {/* Section header */}
        <div className="mb-12 animate-fade-in">
          <div className="decorative-line mb-4" />
          <h2 className="font-display text-3xl md:text-4xl font-bold">课程大纲</h2>
          <p className="text-muted mt-3 text-lg">
            七个章节，从网页基础到发布自己的作品
          </p>
        </div>

        {/* Bento grid — varying card layouts */}
        <div className="space-y-8">
          {moduleEntries.map(([moduleName, moduleLessons], idx) => {
            const isWide = idx === 0 || idx === 5; // First & projects chapter get emphasis
            return (
              <div
                key={moduleName}
                className={`card p-6 md:p-8 animate-reveal ${isWide ? "md:col-span-2 border-l-4 border-l-accent" : ""}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Module header */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center text-lg font-bold shadow-glow shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold">{moduleName}</h3>
                    <p className="text-xs text-muted mt-0.5">
                      {moduleLessons.length} 节课
                      {" · "}
                      约 {moduleLessons.reduce((s, l) => s + l.estimatedMinutes, 0)} 分钟
                    </p>
                  </div>
                </div>

                {/* Lesson list */}
                <div className={`grid gap-3 ${isWide ? "md:grid-cols-2" : ""}`}>
                  {moduleLessons.map((lesson, li) => (
                    <Link
                      key={lesson.id}
                      href={`/lesson/${lesson.id}`}
                      className="flex items-start gap-3 p-3 -mx-1 rounded-xl hover:bg-accent-soft/50 transition-all duration-200 group/item"
                      style={{ animationDelay: `${idx * 100 + li * 60}ms` }}
                    >
                      {/* Icon */}
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          lesson.type === "project"
                            ? "bg-warning-soft text-warning"
                            : "bg-accent-soft text-accent"
                        }`}
                      >
                        {lesson.type === "project" ? (
                          <Code2 className="w-4 h-4" />
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

                      {/* Difficulty badge */}
                      <span
                        className={`hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 mt-1 ${
                          lesson.difficulty === "beginner"
                            ? "bg-success-soft text-success"
                            : lesson.difficulty === "intermediate"
                            ? "bg-warning-soft text-warning"
                            : "bg-accent-soft text-accent"
                        }`}
                      >
                        {{ beginner: "入门", intermediate: "进阶", advanced: "高级" }[lesson.difficulty]}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA at bottom */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="card p-10 md:p-16 gradient-warm border-accent/20">
            <Sparkles className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
              准备好做第一个小作品了吗？
            </h2>
            <p className="text-muted mb-6 max-w-md mx-auto">
              不需要预装复杂工具。打开浏览器，跟着课程一步步完成第一个作品。
            </p>
            <Link
              href={`/lesson/${lessons[0].id}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-xl font-semibold text-lg shadow-glow hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              开始第一课
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-edge py-10 text-center">
        <p className="text-sm text-muted">
          <span className="font-display font-bold text-accent">梦夜的编程课</span>
          <span className="mx-2 text-faint">—</span>
          让每个人都能创造
        </p>
        <p className="text-xs text-faint mt-2">
          从一个小想法开始，把它做出来
        </p>
      </footer>
    </div>
  );
}
