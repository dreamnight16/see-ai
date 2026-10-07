import { readFileSync } from "fs";
import { join } from "path";

/**
 * 每周热词报告。
 *
 * 这个文件由 scripts/trends/crawl.py 每周跑一次生成，
 * 页面只读它，不联网、不调用模型。
 *
 * 一个前提写在类型里：候选词没有解释。
 * 爬虫只负责"这周有人在说这个词"，解释一律由人写进 lib/glossary.ts。
 * 所以这里没有任何 definition 之类的字段，是故意的。
 */

export interface TrendCandidate {
  term: string;
  /** 这周在多少条标题里出现过 */
  hits: number;
  /** 出现在哪些源，跨源出现比单一源出现更像真信号 */
  sources: string[];
  sampleTitle: string;
  sampleUrl: string;
  /** 第一次被爬到的周次，例如 2026-W41 */
  firstSeen: string;
  /** 名词表里是不是已经有这个词了 */
  inGlossary: boolean;
}

export interface TrendWatchSample {
  title: string;
  url: string;
  source: string;
}

export interface TrendWatchEntry {
  term: string;
  hits: number;
  sources: string[];
  samples: TrendWatchSample[];
  inGlossary: boolean;
}

export interface TrendItem {
  title: string;
  url: string;
  source: string;
  score: number;
  /** 命中了哪些 AI 关键词，用来解释"为什么它算 AI" */
  keywords: string[];
}

export interface TrendStats {
  totalItems: number;
  aiItems: number;
  sourceCounts: Record<string, number>;
  failedSources: string[];
}

export interface TrendReport {
  schemaVersion: number;
  generatedAt: string;
  week: string;
  stats: TrendStats;
  candidates: TrendCandidate[];
  knownCandidates: TrendCandidate[];
  watchlist: TrendWatchEntry[];
  items: TrendItem[];
}

const REPORT_PATH = join(process.cwd(), "data", "trends", "latest.json");
const SEEN_PATH = join(process.cwd(), "data", "trends", "seen.json");

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

/**
 * 宽松校验：结构对不上就当没有报告，让页面走"还没跑过"的分支。
 * 这里刻意不抛异常——爬虫挂了不该把整个构建带崩。
 */
function looksLikeReport(data: unknown): data is TrendReport {
  if (typeof data !== "object" || data === null) return false;
  const r = data as Partial<TrendReport>;
  return (
    typeof r.schemaVersion === "number" &&
    typeof r.week === "string" &&
    typeof r.generatedAt === "string" &&
    Array.isArray(r.candidates) &&
    Array.isArray(r.items) &&
    typeof r.stats === "object" &&
    r.stats !== null &&
    typeof r.stats.totalItems === "number"
  );
}

export function loadTrendReport(): TrendReport | null {
  try {
    const raw = readFileSync(REPORT_PATH, "utf-8");
    const data: unknown = JSON.parse(raw);
    if (!looksLikeReport(data)) return null;
    return data;
  } catch {
    return null;
  }
}

/** seen.json：{归一化词: 首次出现的周次}，用来在页面上标"这周新出现" */
export function loadSeenTerms(): Record<string, string> {
  try {
    const raw = readFileSync(SEEN_PATH, "utf-8");
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null || Array.isArray(data)) return {};
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (typeof value === "string") out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

/** 报告里所有源的名字，按条数从多到少 */
export function getSourceNames(report: TrendReport): string[] {
  return Object.entries(report.stats.sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
}

/** 报告是否太旧了（超过两周），页面上会提示一句 */
export function isStale(report: TrendReport, now: Date = new Date()): boolean {
  const generated = new Date(report.generatedAt);
  if (Number.isNaN(generated.getTime())) return true;
  const days = (now.getTime() - generated.getTime()) / 86400000;
  return days > 14;
}

export { isStringArray };
