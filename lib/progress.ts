import type { GamificationState } from './gamification';
import { emptyGamification } from './gamification';
import { getRepository } from './repository';

const STORAGE_KEY = 'vibe-coding-progress';
const CURRENT_SCHEMA = 3;

export interface LessonProgress {
  completed: boolean;
  quizCompleted: boolean;
  quizScore?: number;
  lastAccessedAt: string;
  completedAt?: string;
}

export interface UserProgress {
  schemaVersion: number;
  lessons: Record<string, LessonProgress>;
  gamification?: GamificationState;
  /** 完成过的动手练习 id */
  exercisesCompleted?: string[];
  /** 在练习场检查过多少次自己写的提示词 */
  promptChecks?: number;
  lastUpdatedAt: string;
}

function emptyProgress(): UserProgress {
  return {
    schemaVersion: CURRENT_SCHEMA,
    lessons: {},
    gamification: emptyGamification(),
    exercisesCompleted: [],
    promptChecks: 0,
    lastUpdatedAt: new Date().toISOString(),
  };
}

/**
 * 老版本数据往新 schema 上搬。
 * 这里只补字段，不动已有的学习记录——进度丢了比少个字段严重得多。
 */
function migrateProgress(data: Record<string, unknown>): UserProgress {
  const version = (data.schemaVersion as number) || 1;
  const base: UserProgress = {
    schemaVersion: CURRENT_SCHEMA,
    lessons: (data.lessons as Record<string, LessonProgress>) || {},
    gamification: (data.gamification as GamificationState) || emptyGamification(),
    exercisesCompleted: (data.exercisesCompleted as string[]) || [],
    promptChecks: (data.promptChecks as number) || 0,
    lastUpdatedAt: new Date().toISOString(),
  };
  if (version < 2) base.gamification = emptyGamification();
  return base;
}

export function loadProgress(): UserProgress {
  const repo = getRepository();
  try {
    const raw = repo.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const data = JSON.parse(raw);
    if (!data.schemaVersion || data.schemaVersion < CURRENT_SCHEMA) {
      const migrated = migrateProgress(data);
      repo.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
    return data as UserProgress;
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(p: UserProgress) {
  const repo = getRepository();
  p.lastUpdatedAt = new Date().toISOString();
  p.schemaVersion = CURRENT_SCHEMA;
  repo.setItem(STORAGE_KEY, JSON.stringify(p));
  notifyListeners();
}

const listeners = new Set<() => void>();

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function getLessonProgress(lessonId: string): LessonProgress {
  const p = loadProgress();
  return p.lessons[lessonId] || { completed: false, quizCompleted: false, lastAccessedAt: '' };
}

function updateProgress(lessonId: string, updater: (p: LessonProgress) => void) {
  const p = loadProgress();
  if (!p.lessons[lessonId]) {
    p.lessons[lessonId] = { completed: false, quizCompleted: false, lastAccessedAt: '' };
  }
  updater(p.lessons[lessonId]);
  saveProgress(p);
}

export function markLessonAccessed(lessonId: string) {
  updateProgress(lessonId, (lesson) => {
    lesson.lastAccessedAt = new Date().toISOString();
  });
}

export function markLessonCompleted(lessonId: string) {
  updateProgress(lessonId, (lesson) => {
    lesson.completed = true;
    lesson.completedAt = new Date().toISOString();
  });
  import('./events').then(({ emitGameEvent }) => {
    emitGameEvent({ type: 'lesson:completed', lessonId });
  });
}

export function saveQuizResult(lessonId: string, score: number) {
  updateProgress(lessonId, (lesson) => {
    lesson.quizCompleted = true;
    lesson.quizScore = score;
  });
  import('./events').then(({ emitGameEvent }) => {
    emitGameEvent({ type: 'quiz:completed', lessonId, score });
  });
}

/** 记录一次动手练习，徽章和统计都靠它 */
export function recordExerciseCompleted(exerciseId: string) {
  const p = loadProgress();
  const list = p.exercisesCompleted ?? [];
  if (!list.includes(exerciseId)) {
    p.exercisesCompleted = [...list, exerciseId];
    saveProgress(p);
  }
  import('./events').then(({ emitGameEvent }) => {
    emitGameEvent({ type: 'exercise:completed', exerciseId });
  });
}

/** 练习场里每检查一次提示词就记一笔 */
export function recordPromptCheck(score: number) {
  const p = loadProgress();
  p.promptChecks = (p.promptChecks ?? 0) + 1;
  saveProgress(p);
  import('./events').then(({ emitGameEvent }) => {
    emitGameEvent({ type: 'prompt:reviewed', score });
  });
}

export function getOverallProgress(total: number): { completed: number; percentage: number } {
  const p = loadProgress();
  const completed = Object.values(p.lessons).filter((l) => l.completed).length;
  return { completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
}

export function getModuleProgress(
  lessonIds: string[],
): { completed: number; total: number } {
  const p = loadProgress();
  const total = lessonIds.length;
  const completed = lessonIds.filter((id) => p.lessons[id]?.completed).length;
  return { completed, total };
}
