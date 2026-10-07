import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRepository, setRepository } from "../repository";
import {
  loadProgress,
  saveProgress,
  markLessonAccessed,
  markLessonCompleted,
  saveQuizResult,
  getOverallProgress,
  getModuleProgress,
} from "../progress";

describe("progress", () => {
  beforeEach(() => {
    setRepository(new MemoryRepository());
  });

  it("loads empty progress when nothing stored", () => {
    const progress = loadProgress();
    expect(progress.schemaVersion).toBe(2);
    expect(progress.lessons).toEqual({});
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

  it("calculates overall progress", () => {
    markLessonCompleted("1-1");
    markLessonCompleted("1-2");
    const result = getOverallProgress(22);
    expect(result.completed).toBe(2);
    expect(result.percentage).toBe(9);
  });

  it("handles zero total in overall progress", () => {
    const result = getOverallProgress(0);
    expect(result.percentage).toBe(0);
  });

  it("calculates module progress", () => {
    markLessonCompleted("1-1");
    const result = getModuleProgress("ch1", ["1-1", "1-2", "1-3"]);
    expect(result.completed).toBe(1);
    expect(result.total).toBe(3);
  });

  it("migrates schema v1 to v2", () => {
    const repo = new MemoryRepository();
    setRepository(repo);
    repo.setItem("vibe-coding-progress", JSON.stringify({
      schemaVersion: 1,
      lessons: { "1-1": { completed: true, quizCompleted: false, lastAccessedAt: "" } },
    }));
    const progress = loadProgress();
    expect(progress.schemaVersion).toBe(2);
    expect(progress.lessons["1-1"]?.completed).toBe(true);
    expect(progress.gamification).toBeDefined();
  });

  it("returns empty progress on corrupted data", () => {
    const repo = new MemoryRepository();
    setRepository(repo);
    repo.setItem("vibe-coding-progress", "not-valid-json{{{");
    const progress = loadProgress();
    expect(progress.schemaVersion).toBe(2);
    expect(progress.lessons).toEqual({});
  });
});
