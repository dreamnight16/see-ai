import { lessons } from './lessons';
import { loadProgress } from './progress';

export interface AdaptiveRecommendation {
  type: 'next-lesson' | 'review-lesson' | 'retake-quiz' | 'try-playground' | 'start-project';
  lessonId?: string;
  moduleName?: string;
  quizId?: string;
  reason: string;
  priority: number;
  icon: string;
}

export function getRecommendations(lessonId?: string): AdaptiveRecommendation[] {
  const progress = loadProgress();
  const recs: AdaptiveRecommendation[] = [];

  // 1. Check for failed quizzes that need retaking
  for (const [id, data] of Object.entries(progress.lessons)) {
    if (data.quizCompleted && data.quizScore !== undefined && data.quizScore < 60 && !data.completed) {
      const lesson = lessons.find((l) => l.id === id);
      if (lesson) {
        recs.push({
          type: 'retake-quiz',
          lessonId: id,
          reason: `测验得分 ${data.quizScore} 分，建议复习「${lesson.title}」`,
          priority: 1,
          icon: 'RotateCcw',
        });
      }
    }
  }

  // 2. Check for incomplete prerequisites of current lesson
  if (lessonId) {
    const currentLesson = lessons.find((l) => l.id === lessonId);
    if (currentLesson) {
      for (const prereqId of currentLesson.prerequisites) {
        if (!progress.lessons[prereqId]?.completed) {
          const prereq = lessons.find((l) => l.id === prereqId);
          if (prereq) {
            recs.push({
              type: 'review-lesson',
              lessonId: prereqId,
              reason: `当前课程需要先完成「${prereq.title}」`,
              priority: 2,
              icon: 'BookOpen',
            });
          }
        }
      }
    }
  }

  // 3. Suggest next lesson
  const completedIds = Object.entries(progress.lessons)
    .filter(([, v]) => v.completed)
    .map(([k]) => k);

  const nextLesson = lessons.find((l) => !completedIds.includes(l.id));
  if (nextLesson) {
    recs.push({
      type: 'next-lesson',
      lessonId: nextLesson.id,
      reason: `下一课：「${nextLesson.title}」`,
      priority: 3,
      icon: 'ArrowRight',
    });
  }

  // 4. Suggest playground for practice lessons
  const currentLesson = lessonId ? lessons.find((l) => l.id === lessonId) : undefined;
  if (
    currentLesson?.hasPlayground &&
    !progress.gamification?.pendingBadgeUnlocks?.length
  ) {
    recs.push({
      type: 'try-playground',
      lessonId: currentLesson.id,
      reason: '打开 Playground，试着把一个想法做成网页；需要时再用 AI 辅助',
      priority: 4,
      icon: 'Wand2',
    });
  }

  // 5. If all lessons done, suggest building a final project
  if (completedIds.length >= lessons.length) {
    recs.push({
      type: 'start-project',
      reason: '你已经学完所有课程！做一个属于你自己的项目吧',
      priority: 5,
      icon: 'Trophy',
    });
  }

  return recs.sort((a, b) => a.priority - b.priority).slice(0, 3);
}
