import { describe, it, expect } from "vitest";
import { reviewPrompt, CHECKLIST_LABELS, PROMPT_TEMPLATE } from "../prompt-coach";

describe("reviewPrompt", () => {
  it("returns a zero score for an empty prompt", () => {
    const review = reviewPrompt("   ");
    expect(review.score).toBe(0);
    expect(review.grade).toBe("还没有内容");
    expect(review.nextSteps).toHaveLength(1);
  });

  it("flags a prompt that is too short", () => {
    const review = reviewPrompt("帮我写个东西");
    expect(review.issues.map((i) => i.id)).toContain("too-short");
  });

  it("scores a fully specified prompt higher than a vague one", () => {
    const vague = reviewPrompt("帮我优化一下");
    const detailed = reviewPrompt(
      "你是一名做了十年招聘的 HR。帮我改写一段自我介绍，给我部门的领导看，控制在 200 字以内，语气正式一点，用分点的形式给我。如果不确定就先问我。",
    );
    expect(detailed.score).toBeGreaterThan(vague.score);
    expect(detailed.score).toBeGreaterThanOrEqual(85);
  });

  it("rewards audience, length, tone and format", () => {
    const review = reviewPrompt(
      "帮我写一条停水通知，发在业主群里给业主看。控制在 150 字以内，语气客气一点，分三小段。",
    );
    const ids = review.strengths.map((s) => s.id);
    expect(ids).toContain("audience");
    expect(ids).toContain("length");
    expect(ids).toContain("tone");
    expect(ids).toContain("format");
    expect(ids).toContain("task");
  });

  it("warns when sensitive information is pasted in", () => {
    const review = reviewPrompt("帮我看看这个身份证号 110101199003072316 是哪里的");
    const ids = review.issues.map((i) => i.id);
    expect(ids).toContain("privacy");
    expect(review.nextSteps[0]).toMatch(/代称|不要发|敏感/);
  });

  it("nudges away from search style questions", () => {
    const review = reviewPrompt("什么是量子纠缠");
    expect(review.issues.map((i) => i.id)).toContain("search-style");
  });

  it("notices when the prompt asks the model to admit uncertainty", () => {
    const review = reviewPrompt(
      "帮我核实这段说法，如果不确定就直接说不知道，不要编造，并告诉我该去哪儿查。",
    );
    expect(review.strengths.map((s) => s.id)).toContain("honesty");
  });

  it("notices the let-it-ask-first request", () => {
    const review = reviewPrompt("帮我写简历。信息不够的话你先问我几个问题，再动笔。");
    expect(review.strengths.map((s) => s.id)).toContain("ask-first");
  });

  it("flags a prompt that crams in too many tasks", () => {
    const review = reviewPrompt(
      "帮我写周报，另外再帮我做一份 PPT，顺便把会议记录也整理了，还有下个月的排班表。",
    );
    expect(review.issues.map((i) => i.id)).toContain("too-many-tasks");
  });

  it("keeps the score inside 0 to 100", () => {
    const messy = reviewPrompt("随便弄个东西，另外再顺便同时把它改好，以及还有别的，身份证号 110101199003072316");
    expect(messy.score).toBeGreaterThanOrEqual(5);
    expect(messy.score).toBeLessThanOrEqual(100);
  });

  it("always offers at most four next steps", () => {
    const review = reviewPrompt("帮我弄一下");
    expect(review.nextSteps.length).toBeLessThanOrEqual(4);
    expect(review.nextSteps.length).toBeGreaterThan(0);
  });

  it("counts characters without whitespace", () => {
    expect(reviewPrompt("帮我  写 一条 通知").length).toBe(7);
  });
});

describe("CHECKLIST_LABELS", () => {
  it("covers every id used by the practice scenarios", () => {
    for (const id of [
      "role", "audience", "task", "format", "length", "tone", "context",
      "example", "versions", "ask-first", "honesty", "stepwise", "deadline",
    ]) {
      expect(CHECKLIST_LABELS[id]).toBeTruthy();
    }
  });
});

describe("PROMPT_TEMPLATE", () => {
  it("covers the four pieces", () => {
    expect(PROMPT_TEMPLATE).toMatch(/角色/);
    expect(PROMPT_TEMPLATE).toMatch(/任务/);
    expect(PROMPT_TEMPLATE).toMatch(/要求/);
    expect(PROMPT_TEMPLATE).toMatch(/例子/);
  });
});
