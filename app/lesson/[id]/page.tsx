import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getLesson,
  getNextLessonId,
  getPrevLessonId,
  getNextLessonInTrack,
  getTrackOfLesson,
  lessons,
} from "@/lib/lessons";
import { getLessonContent } from "@/lib/lessons-content";
import { getExercisesByLesson } from "@/lib/exercises";
import LessonNavigator from "@/components/LessonNavigator";
import ChatInterface from "@/components/ChatInterface";
import PromptPlayground from "@/components/PromptPlayground";
import LessonMeta from "@/components/LessonMeta";
import Quiz from "@/components/Quiz";
import { getQuizByLessonId, getQuizById } from "@/lib/quiz-data";
import { trackVisual } from "@/components/track-visuals";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronLeft, ChevronRight, MessageCircle, Wand2, Sparkles, Flame, Eye } from "lucide-react";
import LessonExercises from "./LessonExercises";
import LessonVisualizations from "./LessonVisualizations";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ id: lesson.id }));
}

/** 课内各大块统一的标题样式：一块实色方块 + 标题 + 一句说明 */
function SectionLabel({
  icon,
  title,
  note,
  field,
}: {
  icon: React.ReactNode;
  title: string;
  note: string;
  field: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={"flex h-10 w-10 shrink-0 items-center justify-center " + field}>
        {icon}
      </span>
      <div className="min-w-0">
        <h2 className="font-display text-xl leading-tight">{title}</h2>
        <p className="mt-1 text-xs text-text-secondary">{note}</p>
      </div>
    </div>
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) return notFound();

  const nextId = getNextLessonId(id);
  const prevId = getPrevLessonId(id);
  const nextInTrackId = getNextLessonInTrack(id);
  const track = getTrackOfLesson(id);
  const quiz = lesson.quizId ? getQuizById(lesson.quizId) : getQuizByLessonId(id);
  const content = getLessonContent(id);
  const exercises = getExercisesByLesson(id);
  const visual = track ? trackVisual(track.color) : trackVisual("steel");
  const index = lessons.findIndex((l) => l.id === id) + 1;

  return (
    <div className="flex min-h-[calc(100vh_-_var(--see-header-h))]">
      <LessonNavigator />

      <main id="main" className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto w-full max-w-[860px] flex-1 px-[var(--see-gutter)] py-8 sm:py-12">
          {/* 面包屑：当前位置与返回路径 */}
          <nav aria-label="面包屑" className="text-xs text-text-secondary">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="dn-focus see-link">课程表</Link>
              </li>
              {track && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>{track.name}</li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li>{lesson.module}</li>
              <li aria-hidden="true">/</li>
              <li className="tabular-nums text-text-primary">
                第 {index} / {lessons.length} 课
              </li>
            </ol>
          </nav>

          {/* 标题区：轨道品牌实色块 */}
          <header className={"dn-rise mt-5 p-6 sm:p-8 " + visual.field}>
            <p className="see-kicker">
              {track ? track.name + " · " : ""}
              {lesson.module}
            </p>
            <h1 className="font-display mt-4 text-[clamp(1.85rem,4vw,2.75rem)] leading-[1.14]">
              {lesson.title}
            </h1>
            <p className="mt-4 max-w-[52ch] text-base leading-relaxed">
              {lesson.takeaway}
            </p>
          </header>

          <div className="mt-4">
            <LessonMeta lesson={lesson} />
          </div>

          {/* 正文 */}
          <div className="prose mt-10">
            {/* remark-gfm 是必须的：课程里有 20 篇用 Markdown 表格做对比，
                没有它表格会原样显示成一堆竖线 */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>

          {/* 可视化 */}
          <LessonVisualizations lessonId={id} />

          {/* 动手练习 */}
          {exercises.length > 0 && (
            <section className="mt-14" aria-label="动手练习">
              <SectionLabel
                icon={<Flame className="h-4 w-4" aria-hidden="true" />}
                title="动手练习"
                note="改代码，完成练习目标。检查在你本机完成，不联网。"
                field="bg-orange text-on-color"
              />
              <div className="mt-5">
                <LessonExercises exercises={exercises} />
              </div>
            </section>
          )}

          {/* 课后测验 */}
          {quiz && (
            <section className="mt-14" aria-label="课后测验">
              <SectionLabel
                icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
                title="课后测验"
                note={`${quiz.questions.length} 道题，通过线 ${quiz.passingScore} 分。`}
                field="bg-violet text-on-color"
              />
              <div className="mt-5">
                <Quiz quizId={quiz.id} />
              </div>
            </section>
          )}

          {/* 可选学习助手 */}
          {lesson.hasChat && (
            <section className="mt-14" aria-label="学习助手">
              <SectionLabel
                icon={<MessageCircle className="h-4 w-4" aria-hidden="true" />}
                title="学习助手（可选）"
                note="需要时可以提问；没配 AI 也不影响课程、练习和测验。"
                field="bg-cyan text-on-color"
              />
              <div className="mt-5 h-[min(520px,70vh)] min-h-[360px]">
                <ChatInterface />
              </div>
            </section>
          )}

          {/* 网页小工坊 */}
          {lesson.hasPlayground && (
            <section className="mt-14" aria-label="网页小工坊">
              <SectionLabel
                icon={<Wand2 className="h-4 w-4" aria-hidden="true" />}
                title="网页小工坊"
                note="描述想法后可以选用模型生成代码；也可以直接编辑和预览。"
                field="bg-teal text-on-color"
              />
              <div className="mt-5 h-[min(640px,75vh)] min-h-[420px]">
                <PromptPlayground />
              </div>
            </section>
          )}

          {/*
            可视化演示挂在别的课时上提示一下——
            课程内容没变，只是把入口说明白
          */}
          {!lesson.hasPlayground && !quiz && exercises.length === 0 && (
            <p className="mt-14 border-l-4 border-steel bg-surface-alt p-4 text-sm leading-relaxed text-text-secondary">
              <Eye className="mr-1.5 inline h-4 w-4 align-[-3px]" aria-hidden="true" />
              这一课以阅读为主。想看概念演示可以去{" "}
              <Link href="/visualizations" className="see-link">可视化演示</Link>。
            </p>
          )}

          {/* 同轨道的下一课 */}
          {nextInTrackId && (
            <Link
              href={"/lesson/" + nextInTrackId}
              className="dn-focus dn-interactive mt-14 flex min-h-[76px] items-center gap-4 border border-edge bg-surface p-4 hover:bg-surface-alt"
            >
              <span className={"flex h-10 w-10 shrink-0 items-center justify-center " + visual.field}>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="see-kicker block text-text-secondary">
                  {track ? track.name + " · " : ""}同轨道下一节
                </span>
                <span className="mt-1 block truncate text-sm font-medium">
                  {getLesson(nextInTrackId)?.title}
                </span>
              </span>
            </Link>
          )}

          {/* 上一课 / 下一课 */}
          <nav
            aria-label="课程导航"
            className="mt-10 flex items-stretch justify-between gap-3 border-t border-edge pt-8"
          >
            {prevId ? (
              <Link
                href={"/lesson/" + prevId}
                className="dn-focus flex min-h-[64px] items-center gap-3 border border-edge-strong px-4 hover:bg-surface-alt"
              >
                <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="see-kicker block text-text-secondary">上一课</span>
                  <span className="mt-1 block truncate text-sm font-medium">
                    {getLesson(prevId)?.title}
                  </span>
                </span>
              </Link>
            ) : (
              <span />
            )}

            {nextId ? (
              <Link
                href={"/lesson/" + nextId}
                className="dn-focus flex min-h-[64px] items-center gap-3 border border-edge-strong px-4 text-right hover:bg-surface-alt"
              >
                <span className="min-w-0">
                  <span className="see-kicker block text-text-secondary">下一课</span>
                  <span className="mt-1 block truncate text-sm font-medium">
                    {getLesson(nextId)?.title}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            ) : (
              <Link
                href="/"
                className="dn-focus flex min-h-[64px] items-center gap-2 border border-edge-strong px-4 text-sm font-semibold hover:bg-surface-alt"
              >
                回到课程表
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </nav>
        </div>
      </main>
    </div>
  );
}
