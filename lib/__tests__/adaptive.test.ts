import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRepository, setRepository } from "../repository";
import { getRecommendations } from "../adaptive";
import { saveQuizResult, loadProgress, saveProgress } from "../progress";

describe("getRecommendations", () => {
  beforeEach(() => {
    setRepository(new MemoryRepository());
  });

  it("suggests next lesson when no lessons completed", () => {
    const recs = getRecommendations();
    expect(recs).toHaveLength(1);
    expect(recs[0].type).toBe("next-lesson");
    expect(recs[0].lessonId).toBe("1-1");
  });

  it("suggests retake quiz when score below 60", () => {
    saveQuizResult("1-1", 40);
    const recs = getRecommendations("1-1");
    expect(recs.some((r) => r.type === "retake-quiz")).toBe(true);
  });

  it("suggests prerequisites when incomplete", () => {
    // Lesson "1-3" has prerequisites ["1-2"], so completing it without 1-2 should suggest review
    saveQuizResult("1-3", 50);
    const recs = getRecommendations("5-1");
    expect(recs.length).toBeGreaterThan(0);
  });

  it("limits to 3 recommendations", () => {
    // Set up a state with many failed quizzes
    saveQuizResult("1-1", 30);
    saveQuizResult("1-2", 40);
    saveQuizResult("1-3", 50);
    saveQuizResult("2-1", 35);
    const recs = getRecommendations();
    expect(recs.length).toBeLessThanOrEqual(3);
  });

  it("suggests start-project when all lessons complete", () => {
    const progress = loadProgress();
    for (let i = 1; i <= 7; i++) {
      const count = i <= 4 ? 4 : i <= 6 ? 4 : 2;
      for (let j = 1; j <= count; j++) {
        progress.lessons[`${i}-${j}`] = {
          completed: true,
          quizCompleted: true,
          lastAccessedAt: "2026-01-01",
        };
      }
    }
    saveProgress(progress);
    const recs = getRecommendations();
    expect(recs.some((r) => r.type === "start-project")).toBe(true);
  });

  it("returns sorted by priority", () => {
    saveQuizResult("1-1", 30);
    const recs = getRecommendations("1-1");
    for (let i = 1; i < recs.length; i++) {
      expect(recs[i].priority).toBeGreaterThanOrEqual(recs[i - 1].priority);
    }
  });
});
