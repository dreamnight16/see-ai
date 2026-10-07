import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getLesson,
  getNextLessonId,
  getPrevLessonId,
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
import ReactMarkdown from "react-markdown";
import { ChevronLeft, ChevronRight, MessageCircle, Wand2, Sparkles, Flame } from "lucide-react";
import LessonExercises from "./LessonExercises";
import LessonVisualizations from "./LessonVisualizations";
import GamificationStatus from "@/components/gamification/GamificationStatus";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ id: lesson.id }));
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
  const quiz = lesson.quizId ? getQuizById(lesson.quizId) : getQuizByLessonId(id);
  const content = getLessonContent(id);
  const exercises = getExercisesByLesson(id);

  return (
    <div className="flex min-h-screen">
      <LessonNavigator />
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 max-w-[800px] mx-auto w-full px-6 py-12 md:py-16">
          {/* Gamification status (compact) */}
          <div className="mb-6 animate-slide-up">
            <GamificationStatus compact />
          </div>

          {/* Module breadcrumb */}
          <div className="text-sm text-muted mb-3 animate-slide-up">
            <Link href="/" className="hover:text-accent transition-colors">课程</Link>
            <span className="mx-2 text-faint">/</span>
            <span>{lesson.module}</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl font-black leading-tight mb-4 animate-reveal">
            {lesson.title}
          </h1>

          {/* Meta */}
          <div className="mb-10 animate-slide-up stagger-2">
            <LessonMeta lesson={lesson} />
          </div>

          {/* Lesson content */}
          <div className="prose dark:prose-invert max-w-none mb-12 animate-slide-up stagger-3">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>

          {/* Visualizations */}
          <LessonVisualizations lessonId={id} />

          {/* Code exercises */}
          {exercises.length > 0 && (
            <div className="mb-12 animate-slide-up space-y-6">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
                  <Flame className="w-4 h-4 text-accent" />
                </span>
                <div>
                  <span className="font-display font-bold text-lg text-accent">动手练习</span>
                  <p className="text-xs text-muted">修改代码，完成练习目标</p>
                </div>
              </div>
              <LessonExercises exercises={exercises} />
            </div>
          )}

          {/* Quiz section */}
          {quiz && (
            <div className="mb-12 animate-slide-up space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-accent" />
                </span>
                <div>
                  <span className="font-display font-bold text-lg text-accent">课后测验</span>
                  <p className="text-xs text-muted">检验一下你的学习成果</p>
                </div>
              </div>
              <Quiz quizId={quiz.id} />
            </div>
          )}

          {/* Optional assistant */}
          {lesson.hasChat && (
            <div className="mb-12 animate-slide-up space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-accent" />
                </span>
                <div>
                  <span className="font-display font-bold text-lg text-accent">学习助手（可选）</span>
                  <p className="text-xs text-muted">需要时可以提问；未配置 AI 也不影响课程和练习</p>
                </div>
              </div>
              <div className="h-[min(520px,70vh)] min-h-[360px]">
                <ChatInterface />
              </div>
            </div>
          )}

          {/* Prompt Playground */}
          {lesson.hasPlayground && (
            <div className="mb-12 animate-slide-up space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-accent" />
                </span>
                <div>
                  <span className="font-display font-bold text-lg text-accent">动手实践</span>
                  <p className="text-xs text-muted">描述想法后，可选用模型生成代码；也可以直接编辑和预览</p>
                </div>
              </div>
              <div className="h-[min(640px,75vh)] min-h-[420px]">
                <PromptPlayground />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-edge animate-fade-in">
            {prevId ? (
              <Link
                href={`/lesson/${prevId}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-muted hover:text-accent hover:bg-accent-soft transition-all group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <div className="text-right">
                  <div className="text-[10px] text-faint">上一课</div>
                  <div className="font-medium">{getLesson(prevId)?.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextId ? (
              <Link
                href={`/lesson/${nextId}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-accent hover:bg-accent-soft transition-all group"
              >
                <div>
                  <div className="text-[10px] text-faint">下一课</div>
                  <div>{getLesson(nextId)?.title}</div>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-accent hover:bg-accent-soft transition-all group"
              >
                回到首页
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
