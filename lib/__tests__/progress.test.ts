import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRepository, setRepository } from "../repository";
import {
  loadProgress,
  saveProgress,
  markLessonAccessed,
  markLessonCompleted,
  saveQuizResult,
  recordExerciseCompleted,
  recordPromptCheck,
  getOverallProgress,
  getModuleProgress,
} from "../progress";

describe("progress", () => {
  beforeEach(() => {
    setRepository(new MemoryRepository());
  });

  it("loads empty progress when nothing stored", () => {
    const progress = loadProgress();
    expect(progress.schemaVersion).toBe(3);
    expect(progress.lessons).toEqual({});
    expect(progress.exercisesCompleted).toEqual([]);
    expect(progress.promptChecks).toBe(0);
  });

  it("saves and loads progress", () => {
    const progress = loadProgress();
    progress.lessons["1-1"] = { completed: true, quizCompleted: false, lastAccessedAt: "2026-01-01", completedAt: "2026-01-01" };
    saveProgress(progress);
    const loaded = loadProgress();
    expect(loaded.lessons["1-1"].completed).toBe(true);
  });

  it("marks lesson as accessed", () => {
    markLessonAccessed("1-1");
    const progress = loadProgress();
    expect(progress.lessons["1-1"]?.lastAccessedAt).toBeTruthy();
  });

  it("marks lesson as completed", () => {
    markLessonCompleted("1-1");
    const progress = loadProgress();
    expect(progress.lessons["1-1"]?.completed).toBe(true);
    expect(progress.lessons["1-1"]?.completedAt).toBeTruthy();
  });

  it("saves quiz result", () => {
    saveQuizResult("1-1", 85);
    const progress = loadProgress();
    expect(progress.lessons["1-1"]?.quizCompleted).toBe(true);
    expect(progress.lessons["1-1"]?.quizScore).toBe(85);
  });

  it("records an exercise only once", () => {
    recordExerciseCompleted("ex-3-1");
    recordExerciseCompleted("ex-3-1");
    recordExerciseCompleted("ex-6-1");
    expect(loadProgress().exercisesCompleted).toEqual(["ex-3-1", "ex-6-1"]);
  });

  it("counts prompt checks", () => {
    recordPromptCheck(70);
    recordPromptCheck(80);
    expect(loadProgress().promptChecks).toBe(2);
  });

  it("calculates overall progress", () => {
    markLessonCompleted("1-1");
    markLessonCompleted("1-2");
    const result = getOverallProgress(20);
    expect(result.completed).toBe(2);
    expect(result.percentage).toBe(10);
  });

  it("handles zero total in overall progress", () => {
    const result = getOverallProgress(0);
    expect(result.percentage).toBe(0);
  });

  it("calculates module progress", () => {
    markLessonCompleted("1-1");
    const result = getModuleProgress(["1-1", "1-2", "1-3"]);
    expect(result.completed).toBe(1);
    expect(result.total).toBe(3);
  });

  it("migrates schema v1 all the way to the latest", () => {
    const repo = new MemoryRepository();
    setRepository(repo);
    repo.setItem("vibe-coding-progress", JSON.stringify({
      schemaVersion: 1,
      lessons: { "1-1": { completed: true, quizCompleted: false, lastAccessedAt: "" } },
    }));
    const progress = loadProgress();
    expect(progress.schemaVersion).toBe(3);
    expect(progress.lessons["1-1"]?.completed).toBe(true);
    expect(progress.gamification).toBeDefined();
    expect(progress.exercisesCompleted).toEqual([]);
  });

  it("keeps lesson records when migrating from v2", () => {
    const repo = new MemoryRepository();
    setRepository(repo);
    repo.setItem("vibe-coding-progress", JSON.stringify({
      schemaVersion: 2,
      lessons: { "ai-1-1": { completed: true, quizCompleted: true, quizScore: 80, lastAccessedAt: "" } },
      gamification: { xp: 120, totalXpEarned: 120, currentStreak: 2, longestStreak: 2, lastActiveDate: "2026-01-01", badges: ["first-step"], activityLog: {}, pendingBadgeUnlocks: [] },
    }));
    const progress = loadProgress();
    expect(progress.schemaVersion).toBe(3);
    expect(progress.lessons["ai-1-1"]?.quizScore).toBe(80);
    expect(progress.gamification?.xp).toBe(120);
    expect(progress.gamification?.badges).toEqual(["first-step"]);
  });

  it("returns empty progress on corrupted data", () => {
    const repo = new MemoryRepository();
    setRepository(repo);
    repo.setItem("vibe-coding-progress", "not-valid-json{{{");
    const progress = loadProgress();
    expect(progress.schemaVersion).toBe(3);
    expect(progress.lessons).toEqual({});
  });
});
