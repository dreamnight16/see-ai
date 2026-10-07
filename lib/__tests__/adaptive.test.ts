import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRepository, setRepository } from "../repository";
import { getRecommendations } from "../adaptive";
import { saveQuizResult, loadProgress, saveProgress, recordPromptCheck } from "../progress";
import { lessons } from "../lessons";

describe("getRecommendations", () => {
  beforeEach(() => {
    setRepository(new MemoryRepository());
  });

  it("suggests the very first lesson when nothing is done", () => {
    const recs = getRecommendations();
    expect(recs.length).toBeGreaterThan(0);
    const next = recs.find((r) => r.type === "next-lesson");
    expect(next?.lessonId).toBe("ai-1-1");
  });

  it("suggests retake quiz when score below 60", () => {
    saveQuizResult("ai-1-1", 40);
    const recs = getRecommendations("ai-1-1");
    expect(recs.some((r) => r.type === "retake-quiz")).toBe(true);
  });

  it("suggests the prerequisite when it is still missing", () => {
    const withPrereq = lessons.find((l) => l.prerequisites.length > 0);
    expect(withPrereq).toBeDefined();
    const recs = getRecommendations(withPrereq!.id);
    const review = recs.find((r) => r.type === "review-lesson");
    expect(review?.lessonId).toBe(withPrereq!.prerequisites[0]);
  });

  it("suggests continuing the same track", () => {
    const recs = getRecommendations("ai-1-1");
    const cont = recs.find((r) => r.type === "continue-track");
    expect(cont?.lessonId).toBe("ai-1-2");
  });

  it("pushes the practice lab once a few lessons are done without any prompt check", () => {
    const progress = loadProgress();
    for (const id of ["ai-1-1", "ai-1-2", "ai-1-3"]) {
      progress.lessons[id] = { completed: true, quizCompleted: false, lastAccessedAt: "2026-01-01" };
    }
    saveProgress(progress);
    const recs = getRecommendations();
    expect(recs.some((r) => r.type === "try-practice" && r.href === "/practice")).toBe(true);
  });

  it("stops pushing the practice lab after a prompt check", () => {
    const progress = loadProgress();
    for (const id of ["ai-1-1", "ai-1-2", "ai-1-3"]) {
      progress.lessons[id] = { completed: true, quizCompleted: false, lastAccessedAt: "2026-01-01" };
    }
    saveProgress(progress);
    recordPromptCheck(80);
    expect(getRecommendations().some((r) => r.type === "try-practice")).toBe(false);
  });

  it("limits to 3 recommendations", () => {
    saveQuizResult("ai-1-1", 30);
    saveQuizResult("ai-1-2", 40);
    saveQuizResult("ai-1-3", 50);
    saveQuizResult("ai-stu-1", 35);
    expect(getRecommendations().length).toBeLessThanOrEqual(3);
  });

  it("suggests start-project once the whole table is done", () => {
    const progress = loadProgress();
    for (const lesson of lessons) {
      progress.lessons[lesson.id] = {
        completed: true,
        quizCompleted: true,
        lastAccessedAt: "2026-01-01",
      };
    }
    saveProgress(progress);
    expect(getRecommendations().some((r) => r.type === "start-project")).toBe(true);
  });

  it("returns sorted by priority", () => {
    saveQuizResult("ai-1-1", 30);
    const recs = getRecommendations("ai-1-1");
    for (let i = 1; i < recs.length; i++) {
      expect(recs[i].priority).toBeGreaterThanOrEqual(recs[i - 1].priority);
    }
  });
});
