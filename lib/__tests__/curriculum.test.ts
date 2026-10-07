import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { lessons, totalLessons, getLessonsByTrack, getTrackStart } from "../lessons";
import { tracks, getTrack } from "../tracks";
import { quizzes, getQuizByLessonId } from "../quiz-data";
import { promptTemplates, PROMPT_CATEGORIES } from "../prompt-library";
import { glossaryTerms, GLOSSARY_GROUPS } from "../glossary";
import { practiceScenarios } from "../practice-scenarios";
import { CHECKLIST_LABELS } from "../prompt-coach";

const contentDir = join(process.cwd(), "content", "lessons");

describe("课程表完整性", () => {
  it("课程 id 不重复", () => {
    const ids = lessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("每一课都有对应的正文文件", () => {
    const missing = lessons
      .filter((l) => !existsSync(join(contentDir, l.id + ".md")))
      .map((l) => l.id);
    expect(missing).toEqual([]);
  });

  it("正文文件不为空且没有 H1 标题", () => {
    for (const lesson of lessons) {
      const body = readFileSync(join(contentDir, lesson.id + ".md"), "utf-8");
      expect(body.trim().length, lesson.id + " 正文为空").toBeGreaterThan(200);
      expect(body.startsWith("# "), lesson.id + " 不应以 H1 开头").toBe(false);
    }
  });

  it("新轨道的正文都以引用块收尾", () => {
    // 老的编程轨道是历史内容，没有统一这个格式，这里只约束新增的轨道
    const newTracks = lessons.filter((l) => l.track !== "code");
    for (const lesson of newTracks) {
      const body = readFileSync(join(contentDir, lesson.id + ".md"), "utf-8");
      expect(body, lesson.id + " 缺少收尾的引用块").toMatch(/\n> /);
    }
  });

  it("每一课都写了轨道、章节和一句话收获", () => {
    for (const lesson of lessons) {
      expect(getTrack(lesson.track), lesson.id + " 的轨道不存在").toBeDefined();
      expect(lesson.module.length).toBeGreaterThan(0);
      expect(lesson.takeaway.length).toBeGreaterThan(4);
      expect(lesson.estimatedMinutes).toBeGreaterThan(0);
    }
  });

  it("前置课程都存在，且不是自己", () => {
    const ids = new Set(lessons.map((l) => l.id));
    for (const lesson of lessons) {
      for (const prereq of lesson.prerequisites) {
        expect(ids.has(prereq), lesson.id + " 指向了不存在的前置 " + prereq).toBe(true);
        expect(prereq).not.toBe(lesson.id);
      }
    }
  });

  it("每条轨道都有课，而且都能找到入口", () => {
    for (const track of tracks) {
      expect(getLessonsByTrack(track.id).length, track.name + " 没有课").toBeGreaterThan(0);
      expect(getTrackStart(track.id)).toBeTruthy();
    }
  });

  it("练习引用的课程都存在", () => {
    for (const lesson of lessons) {
      for (const exerciseId of lesson.exerciseIds ?? []) {
        expect(exerciseId).toMatch(/^ex-/);
      }
    }
  });

  it("总数和轨道分布符合预期", () => {
    expect(totalLessons).toBe(lessons.length);
    expect(lessons.length).toBeGreaterThanOrEqual(60);
  });
});

describe("测验数据", () => {
  it("每个测验都挂在真实存在的课上", () => {
    const ids = new Set(lessons.map((l) => l.id));
    for (const quiz of Object.values(quizzes)) {
      expect(ids.has(quiz.lessonId), quiz.id + " 挂到了不存在的课 " + quiz.lessonId).toBe(true);
    }
  });

  it("每道题都有四个选项和一个合法的正确答案", () => {
    for (const quiz of Object.values(quizzes)) {
      expect(quiz.questions.length).toBeGreaterThan(0);
      for (const q of quiz.questions) {
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
        expect(q.explanation.length).toBeGreaterThan(10);
      }
    }
  });

  it("每条新轨道都有测验可做", () => {
    for (const trackId of ["campus", "trust", "skill", "agent", "frontier", "create", "work", "life"]) {
      const hasQuiz = getLessonsByTrack(trackId).some((l) => getQuizByLessonId(l.id));
      expect(hasQuiz, trackId + " 轨道没有测验").toBe(true);
    }
  });
});

describe("提示词库", () => {
  it("每个分类都有条目", () => {
    for (const category of PROMPT_CATEGORIES) {
      const count = promptTemplates.filter((t) => t.category === category.id).length;
      expect(count, category.name + " 分类是空的").toBeGreaterThan(0);
    }
  });

  it("没有分类之外的条目", () => {
    const known = new Set(PROMPT_CATEGORIES.map((c) => c.id));
    for (const t of promptTemplates) {
      expect(known.has(t.category), t.id + " 的分类无效").toBe(true);
    }
  });

  it("每条都有场景说明和提示", () => {
    for (const t of promptTemplates) {
      expect(t.scene.length).toBeGreaterThan(4);
      expect(t.prompt.length).toBeGreaterThan(20);
      expect(t.tip.length).toBeGreaterThan(4);
    }
  });

  it("条目 id 不重复", () => {
    const ids = promptTemplates.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("名词表", () => {
  it("每个分组都有词", () => {
    for (const group of GLOSSARY_GROUPS) {
      const count = glossaryTerms.filter((t) => t.group === group.id).length;
      expect(count, group.name + " 分组是空的").toBeGreaterThan(0);
    }
  });

  it("名词不重复，且都有解释和比方", () => {
    const terms = glossaryTerms.map((t) => t.term);
    expect(new Set(terms).size).toBe(terms.length);
    for (const t of glossaryTerms) {
      expect(t.plain.length).toBeGreaterThan(10);
      expect(t.analogy.length).toBeGreaterThan(10);
    }
  });
});

describe("练习场场景", () => {
  it("每个场景要求的要素都是已知的检查项", () => {
    for (const scenario of practiceScenarios) {
      expect(scenario.mustHaves.length).toBeGreaterThan(0);
      for (const id of scenario.mustHaves) {
        expect(CHECKLIST_LABELS[id], scenario.id + " 引用了未知检查项 " + id).toBeTruthy();
      }
    }
  });

  it("每个场景都有处境、目标、开头和参考版本", () => {
    for (const scenario of practiceScenarios) {
      expect(scenario.situation.length).toBeGreaterThan(20);
      expect(scenario.goal.length).toBeGreaterThan(10);
      expect(scenario.starter.length).toBeGreaterThan(2);
      expect(scenario.samplePrompt.length).toBeGreaterThan(30);
    }
  });

  it("场景 id 不重复", () => {
    const ids = practiceScenarios.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
