import { lessons, getLessonsByTrack, totalLessons } from "./lessons";
import type { TrackId } from "./tracks";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  condition: (ctx: BadgeContext) => boolean;
}

export interface BadgeContext {
  completedLessons: string[];
  passedQuizIds: string[];
  perfectQuizIds: string[];
  projectCount: number;
  currentStreak: number;
  exercisesCompleted: string[];
  /** 在练习场里检查过多少次自己写的提示词 */
  promptChecks: number;
}

function completedInTrack(ctx: BadgeContext, trackId: TrackId): number {
  const ids = new Set(getLessonsByTrack(trackId).map((l) => l.id));
  return ctx.completedLessons.filter((id) => ids.has(id)).length;
}

function finishedAnyTrack(ctx: BadgeContext, minLessons = 5): boolean {
  const done = new Set(ctx.completedLessons);
  const trackIds = Array.from(new Set(lessons.map((l) => l.track)));
  return trackIds.some((trackId) => {
    const inTrack = getLessonsByTrack(trackId);
    if (inTrack.length < minLessons) return false;
    return inTrack.every((l) => done.has(l.id));
  });
}

export const BADGES: Badge[] = [
  {
    id: "first-step", name: "第一步", description: "完成第一节课",
    icon: "Footprints", xpReward: 25,
    condition: (ctx) => ctx.completedLessons.length >= 1,
  },
  {
    id: "quick-learner", name: "学习达人", description: "完成 5 节课",
    icon: "Zap", xpReward: 50,
    condition: (ctx) => ctx.completedLessons.length >= 5,
  },
  {
    id: "halfway", name: "半程选手", description: "完成 20 节课",
    icon: "Flag", xpReward: 75,
    condition: (ctx) => ctx.completedLessons.length >= 20,
  },
  {
    id: "graduate", name: "毕业了", description: "完成全部课程",
    icon: "GraduationCap", xpReward: 200,
    condition: (ctx) => ctx.completedLessons.length >= totalLessons,
  },
  {
    id: "campus-three", name: "迈出第一步", description: "完成「大学里怎么用」的 3 节课",
    icon: "GraduationCap", xpReward: 40,
    condition: (ctx) => completedInTrack(ctx, "campus") >= 3,
  },
  {
    id: "safety-first", name: "先学会自保", description: "学完「用得靠谱」整条轨道",
    icon: "ShieldCheck", xpReward: 60,
    condition: (ctx) => completedInTrack(ctx, "trust") >= getLessonsByTrack("trust").length,
  },
  {
    id: "track-finisher", name: "通关一条轨道", description: "把任意一条轨道从头学到尾",
    icon: "Trophy", xpReward: 100,
    condition: (ctx) => finishedAnyTrack(ctx),
  },
  {
    id: "perfect-score", name: "满分王", description: "任意测验拿到 100 分",
    icon: "Trophy", xpReward: 50,
    condition: (ctx) => ctx.perfectQuizIds.length >= 1,
  },
  {
    id: "prompt-lab", name: "练过手", description: "在练习场检查过一次自己写的提示词",
    icon: "Target", xpReward: 30,
    condition: (ctx) => ctx.promptChecks >= 1,
  },
  {
    id: "creator", name: "创造者", description: "在 Playground 里做出第一个作品",
    icon: "Wand", xpReward: 25,
    condition: (ctx) => ctx.projectCount >= 1,
  },
  {
    id: "streak-3", name: "连续 3 天", description: "连续 3 天来学习",
    icon: "Flame", xpReward: 30,
    condition: (ctx) => ctx.currentStreak >= 3,
  },
  {
    id: "streak-7", name: "连续 7 天", description: "连续一周没断过",
    icon: "Flame", xpReward: 75,
    condition: (ctx) => ctx.currentStreak >= 7,
  },
  {
    id: "explorer", name: "探索者", description: "课程、测验、作品都碰过一次",
    icon: "Compass", xpReward: 40,
    condition: (ctx) =>
      ctx.completedLessons.length >= 1 && ctx.projectCount >= 1 && ctx.passedQuizIds.length >= 1,
  },
  {
    id: "hands-on", name: "动手实践", description: "完成第一个动手练习",
    icon: "Code", xpReward: 20,
    condition: (ctx) => ctx.exercisesCompleted.length >= 1,
  },
];

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}

export function checkNewBadges(ctx: BadgeContext, earnedBadgeIds: string[]): Badge[] {
  const earned = new Set(earnedBadgeIds);
  return BADGES.filter((b) => !earned.has(b.id) && b.condition(ctx));
}
