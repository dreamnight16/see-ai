import { describe, it, expect } from "vitest";
import {
  BADGES,
  getBadgeById,
  checkNewBadges,
  type BadgeContext,
} from "../achievements";
import { lessons, getLessonsByTrack, totalLessons } from "../lessons";

const emptyCtx: BadgeContext = {
  completedLessons: [],
  passedQuizIds: [],
  perfectQuizIds: [],
  projectCount: 0,
  currentStreak: 0,
  exercisesCompleted: [],
  promptChecks: 0,
};

describe("BADGES", () => {
  it("has 14 badges defined", () => {
    expect(BADGES).toHaveLength(14);
  });

  it("each badge has required fields", () => {
    for (const badge of BADGES) {
      expect(badge.id).toBeTruthy();
      expect(badge.name).toBeTruthy();
      expect(badge.description).toBeTruthy();
      expect(badge.icon).toBeTruthy();
      expect(badge.xpReward).toBeGreaterThan(0);
    }
  });

  it("no duplicate badge IDs", () => {
    const ids = BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getBadgeById", () => {
  it("returns badge for valid id", () => {
    const badge = getBadgeById("first-step");
    expect(badge?.name).toBe("第一步");
  });

  it("returns undefined for unknown id", () => {
    expect(getBadgeById("nonexistent")).toBeUndefined();
  });
});

describe("checkNewBadges", () => {
  it("returns first-step badge after completing first lesson", () => {
    const ctx = { ...emptyCtx, completedLessons: ["ai-1-1"] };
    const result = checkNewBadges(ctx, []);
    expect(result.map((b) => b.id)).toContain("first-step");
  });

  it("returns quick-learner after 5 lessons", () => {
    const ctx = { ...emptyCtx, completedLessons: ["1-1", "1-2", "1-3", "2-1", "2-2"] };
    const ids = checkNewBadges(ctx, []).map((b) => b.id);
    expect(ids).toContain("first-step");
    expect(ids).toContain("quick-learner");
  });

  it("returns halfway at 20 lessons and graduate only when the whole table is done", () => {
    const twenty = Array.from({ length: 20 }, (_, i) => "lesson-" + i);
    const ids20 = checkNewBadges({ ...emptyCtx, completedLessons: twenty }, []).map((b) => b.id);
    expect(ids20).toContain("halfway");
    expect(ids20).not.toContain("graduate");

    const all = lessons.map((l) => l.id);
    expect(all).toHaveLength(totalLessons);
    const idsAll = checkNewBadges({ ...emptyCtx, completedLessons: all }, []).map((b) => b.id);
    expect(idsAll).toContain("graduate");
  });

  it("returns campus-three after 3 campus lessons", () => {
    const campusIds = getLessonsByTrack("campus").map((l) => l.id);
    const ctx = { ...emptyCtx, completedLessons: campusIds.slice(0, 3) };
    expect(checkNewBadges(ctx, []).map((b) => b.id)).toContain("campus-three");
  });

  it("returns safety-first only after the whole trust track", () => {
    const trustIds = getLessonsByTrack("trust").map((l) => l.id);
    const partial = checkNewBadges({ ...emptyCtx, completedLessons: trustIds.slice(0, 3) }, []);
    expect(partial.map((b) => b.id)).not.toContain("safety-first");

    const full = checkNewBadges({ ...emptyCtx, completedLessons: trustIds }, []);
    expect(full.map((b) => b.id)).toContain("safety-first");
    expect(full.map((b) => b.id)).toContain("track-finisher");
  });

  it("returns prompt-lab after the first prompt check", () => {
    const ctx = { ...emptyCtx, promptChecks: 1 };
    expect(checkNewBadges(ctx, []).map((b) => b.id)).toContain("prompt-lab");
  });

  it("returns perfect-score when any quiz scores 100", () => {
    const ctx = { ...emptyCtx, perfectQuizIds: ["quiz-ai-basics-1"] };
    expect(checkNewBadges(ctx, []).some((b) => b.id === "perfect-score")).toBe(true);
  });

  it("returns creator when project exists", () => {
    const ctx = { ...emptyCtx, projectCount: 1 };
    expect(checkNewBadges(ctx, []).some((b) => b.id === "creator")).toBe(true);
  });

  it("returns streak badges at correct thresholds", () => {
    expect(checkNewBadges({ ...emptyCtx, currentStreak: 3 }, []).some((b) => b.id === "streak-3")).toBe(true);
    expect(checkNewBadges({ ...emptyCtx, currentStreak: 7 }, []).some((b) => b.id === "streak-7")).toBe(true);
  });

  it("does not return already-earned badges", () => {
    const ctx = { ...emptyCtx, completedLessons: ["ai-1-1"] };
    expect(checkNewBadges(ctx, ["first-step"])).toHaveLength(0);
  });

  it("returns explorer when multiple features used", () => {
    const ctx = {
      ...emptyCtx,
      completedLessons: ["ai-1-1"],
      projectCount: 1,
      passedQuizIds: ["quiz-1"],
    };
    expect(checkNewBadges(ctx, []).some((b) => b.id === "explorer")).toBe(true);
  });

  it("returns hands-on when exercises completed", () => {
    const ctx = { ...emptyCtx, exercisesCompleted: ["ex-3-1"] };
    expect(checkNewBadges(ctx, []).some((b) => b.id === "hands-on")).toBe(true);
  });
});
