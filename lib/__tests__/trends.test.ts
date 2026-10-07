import { describe, it, expect } from "vitest";
import {
  loadTrendReport,
  loadSeenTerms,
  getSourceNames,
  isStale,
} from "../trends";

describe("loadTrendReport", () => {
  it("reads the committed report and it matches the shape the page expects", () => {
    const report = loadTrendReport();
    expect(report, "data/trends/latest.json 应该在仓库里").not.toBeNull();
    if (!report) return;

    expect(report.schemaVersion).toBe(1);
    expect(report.week).toMatch(/^\d{4}-W\d{2}$/);
    expect(Number.isNaN(new Date(report.generatedAt).getTime())).toBe(false);
    expect(report.stats.totalItems).toBeGreaterThan(0);
    expect(report.stats.aiItems).toBeLessThanOrEqual(report.stats.totalItems);
    expect(Array.isArray(report.stats.failedSources)).toBe(true);
  });

  it("every candidate carries a term, a source list and a sample link", () => {
    const report = loadTrendReport();
    if (!report) return;

    for (const c of report.candidates) {
      expect(c.term.length, "候选词不能为空").toBeGreaterThan(0);
      expect(c.hits).toBeGreaterThan(0);
      expect(c.sources.length).toBeGreaterThan(0);
      expect(c.sampleUrl).toMatch(/^https?:\/\//);
      expect(c.firstSeen).toMatch(/^\d{4}-W\d{2}$/);
    }
  });

  it("candidates never claim to be documented", () => {
    // 这是整个功能的前提：候选词就是"还没写解释"的词。
    // 如果哪天它们被打上了 inGlossary，说明爬虫和名词表对不上了。
    const report = loadTrendReport();
    if (!report) return;
    for (const c of report.candidates) {
      expect(c.inGlossary, c.term + " 出现在候选里却标着已在名词表").toBe(false);
    }
  });

  it("every item has a title, an absolute url and a source", () => {
    const report = loadTrendReport();
    if (!report) return;

    for (const item of report.items) {
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.url).toMatch(/^https?:\/\//);
      expect(item.source.length).toBeGreaterThan(0);
      expect(Array.isArray(item.keywords)).toBe(true);
    }
  });

  it("carries no definitions — the crawler is not allowed to write explanations", () => {
    const report = loadTrendReport();
    if (!report) return;
    const serialized = JSON.stringify(report);
    // 只允许出现这些字段名，多出 plain/analogy/definition 之类就说明有人让机器写解释了
    for (const forbidden of ["plain", "analogy", "definition", "explanation", "summary"]) {
      expect(serialized.includes('"' + forbidden + '"')).toBe(false);
    }
  });
});

describe("loadSeenTerms", () => {
  it("returns a term-to-week map", () => {
    const seen = loadSeenTerms();
    for (const [term, week] of Object.entries(seen)) {
      expect(term.length).toBeGreaterThan(0);
      expect(week).toMatch(/^\d{4}-W\d{2}$/);
    }
  });
});

describe("getSourceNames", () => {
  it("sorts sources by item count, descending", () => {
    const report = loadTrendReport();
    if (!report) return;
    const names = getSourceNames(report);
    expect(names.length).toBe(Object.keys(report.stats.sourceCounts).length);
    const counts = names.map((n) => report.stats.sourceCounts[n]);
    for (let i = 1; i < counts.length; i++) {
      expect(counts[i]).toBeLessThanOrEqual(counts[i - 1]);
    }
  });
});

describe("isStale", () => {
  it("treats a fresh report as current", () => {
    const report = loadTrendReport();
    if (!report) return;
    expect(isStale(report, new Date(report.generatedAt))).toBe(false);
  });

  it("flags a report older than two weeks", () => {
    const report = loadTrendReport();
    if (!report) return;
    const later = new Date(new Date(report.generatedAt).getTime() + 20 * 86400000);
    expect(isStale(report, later)).toBe(true);
  });

  it("flags an unparseable timestamp rather than pretending it is fine", () => {
    const report = loadTrendReport();
    if (!report) return;
    expect(isStale({ ...report, generatedAt: "not-a-date" })).toBe(true);
  });
});
