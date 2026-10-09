import { lessons, getLessonsByTrack, getLesson } from './lessons';
import { getTrack } from './tracks';
import { loadProgress, type UserProgress } from './progress';

export type RecommendationType =
  | 'next-lesson'
  | 'review-lesson'
  | 'retake-quiz'
  | 'continue-track'
  | 'try-playground'
  | 'try-practice'
  | 'browse-library'
  | 'start-project';

export interface AdaptiveRecommendation {
  type: RecommendationType;
  lessonId?: string;
  moduleName?: string;
  quizId?: string;
  /** 有些建议是去某个页面，不是去某一课 */
  href?: string;
  reason: string;
  priority: number;
  icon: string;
}

/**
 * 学习建议。
 * 优先级压得很低是有意的：一次只给三条，别让人挑花眼。
 *
 * progress 默认取本地进度；组件在水合首帧会显式传一份空进度进来，
 * 让客户端首帧与服务端渲染结果一致（服务端读不到 localStorage）。
 */
export function getRecommendations(
  lessonId?: string,
  progress: UserProgress = loadProgress(),
): AdaptiveRecommendation[] {
  const recs: AdaptiveRecommendation[] = [];

  const completedIds = Object.entries(progress.lessons)
    .filter(([, v]) => v.completed)
    .map(([k]) => k);
  const completedSet = new Set(completedIds);

  // 1. 测验没过的，先回去补
  for (const [id, data] of Object.entries(progress.lessons)) {
    if (data.quizCompleted && data.quizScore !== undefined && data.quizScore < 60 && !data.completed) {
      const lesson = getLesson(id);
      if (lesson) {
        recs.push({
          type: 'retake-quiz',
          lessonId: id,
          reason: '测验拿了 ' + data.quizScore + ' 分，回「' + lesson.title + '」再看一遍',
          priority: 1,
          icon: 'RotateCcw',
        });
      }
    }
  }

  const currentLesson = lessonId ? getLesson(lessonId) : undefined;

  // 2. 当前这课的前置还没学
  if (currentLesson) {
    for (const prereqId of currentLesson.prerequisites) {
      if (completedSet.has(prereqId)) continue;
      const prereq = getLesson(prereqId);
      if (prereq) {
        recs.push({
          type: 'review-lesson',
          lessonId: prereqId,
          reason: '「' + currentLesson.title + '」前面还有一节没看：' + prereq.title,
          priority: 2,
          icon: 'BookOpen',
        });
      }
    }
  }

  // 3. 当前轨道里的下一课
  if (currentLesson) {
    const inTrack = getLessonsByTrack(currentLesson.track);
    const idx = inTrack.findIndex((l) => l.id === currentLesson.id);
    const next = idx >= 0 ? inTrack[idx + 1] : undefined;
    if (next && !completedSet.has(next.id)) {
      const track = getTrack(currentLesson.track);
      recs.push({
        type: 'continue-track',
        lessonId: next.id,
        reason: '接着往下：「' + next.title + '」' + (track ? '（' + track.name + '）' : ''),
        priority: 3,
        icon: 'ArrowRight',
      });
    }
  }

  // 4. 全站第一课还没学的
  const nextLesson = lessons.find((l) => !completedSet.has(l.id));
  if (nextLesson) {
    recs.push({
      type: 'next-lesson',
      lessonId: nextLesson.id,
      reason: '下一课：「' + nextLesson.title + '」',
      priority: 4,
      icon: 'ArrowRight',
    });
  }

  // 5. 学了几节课还是只问不练，推练习场
  if (completedIds.length >= 3 && (progress.promptChecks ?? 0) === 0) {
    recs.push({
      type: 'try-practice',
      href: '/practice',
      reason: '去练习场写一条自己的提问，本地就能给你挑毛病',
      priority: 5,
      icon: 'Target',
    });
  }

  // 6. 刚开始学的人，先看看别人怎么写
  if (completedIds.length >= 1 && completedIds.length < 3) {
    recs.push({
      type: 'browse-library',
      href: '/prompts',
      reason: '提示词库里有 40 条现成的，照着改一条就能用',
      priority: 6,
      icon: 'Library',
    });
  }

  // 7. 有 Playground 的课，提醒动手
  if (currentLesson?.hasPlayground && !(progress.gamification?.pendingBadgeUnlocks?.length)) {
    recs.push({
      type: 'try-playground',
      lessonId: currentLesson.id,
      reason: '打开下面的 Playground，把想法直接做出来试试',
      priority: 7,
      icon: 'Wand',
    });
  }

  // 8. 全部学完
  if (completedIds.length >= lessons.length) {
    recs.push({
      type: 'start-project',
      reason: '整张课程表都走完了。挑一件你真想做的事，从头做一遍',
      priority: 8,
      icon: 'Trophy',
    });
  }

  return recs.sort((a, b) => a.priority - b.priority).slice(0, 3);
}
