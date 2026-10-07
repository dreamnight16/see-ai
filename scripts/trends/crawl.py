"""每周热词爬虫 —— 入口。

跑一轮：
    python scripts/trends/crawl.py

输出（都在 data/trends/ 下）：
    latest.json      网站读的那个文件，结构见 lib/trends.ts
    <YYYY-Www>.md    给人看的周报，用来决定这周该给名词表补哪几个词
    seen.json        已见过的词和首次出现的周次，只增不改

设计前提：这个脚本只负责"找信号"，不负责"写解释"。
名词表里的解释永远由人来写——机器写出来的解释没人核对过，放上去就是给读者添乱。
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import logging
import sys
from pathlib import Path

# 让 Python 能 import 同目录的模块（直接跑脚本时 sys.path[0] 就是脚本所在目录，
# 但从别处 -m 调用时不一定是，这里补一下）
sys.path.insert(0, str(Path(__file__).resolve().parent))

import keywords  # noqa: E402
import terms as terms_mod  # noqa: E402
from sources import collect  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_OUT = ROOT / "data" / "trends"
GLOSSARY = ROOT / "lib" / "glossary.ts"

MAX_ITEMS = 40
MAX_CANDIDATES = 30

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger("trends")


def iso_week(today: dt.date | None = None) -> str:
    """返回 ISO 周次，例如 2026-W07。"""
    today = today or dt.date.today()
    year, week, _ = today.isocalendar()
    return f"{year}-W{week:02d}"


def _write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=2)
        fh.write("\n")


def build_report(topics, counts: dict, failed: list[str], glossary: set[str], seen: dict, week: str) -> dict:
    """把抓到的原始话题整理成给网站用的报告。"""
    ai_entries: list[tuple[str, str, str, int, list[str]]] = []
    for topic in topics:
        if not keywords.is_ai_related(topic.title, topic.summary):
            continue
        hits = keywords.matched_keywords(topic.title, topic.summary)
        ai_entries.append((topic.title, topic.source, topic.url, topic.raw_score, hits))

    # 热门条目：先按来源质量（垂直源在前），再按热度
    source_rank = {name: i for i, name in enumerate(["Hugging Face 每日论文", "arXiv cs.AI", "Hacker News", "微博热搜", "知乎热榜"])}
    ai_entries.sort(key=lambda e: (source_rank.get(e[1], 99), -e[3]))

    items = [
        {
            "title": title,
            "url": url,
            "source": source,
            "score": score,
            "keywords": hits,
        }
        for title, source, url, score, hits in ai_entries[:MAX_ITEMS]
    ]

    triple = [(title, source, url) for title, source, url, _, _ in ai_entries]
    candidates = terms_mod.extract_terms(triple, glossary)
    seen = terms_mod.mark_first_seen(candidates, seen, week)

    # 名词表里已经有的词不用再提议补，但保留在列表里并标记，方便看热度
    new_candidates = [c for c in candidates if not c.inGlossary][:MAX_CANDIDATES]
    known_candidates = [c for c in candidates if c.inGlossary][:MAX_CANDIDATES]

    watchlist = terms_mod.match_watchlist(triple, glossary)
    # 关注清单里还没进名词表的排前面——那才是"该动手写解释了"的信号
    watchlist.sort(key=lambda w: (w["inGlossary"], -len(w["sources"]), -w["hits"], w["term"]))

    return {
        "schemaVersion": 1,
        "generatedAt": dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "week": week,
        "stats": {
            "totalItems": len(topics),
            "aiItems": len(ai_entries),
            "sourceCounts": counts,
            "failedSources": failed,
        },
        "candidates": [c.to_dict() for c in new_candidates],
        "knownCandidates": [c.to_dict() for c in known_candidates],
        "watchlist": watchlist,
        "items": items,
    }, seen


def write_markdown(path: Path, report: dict) -> None:
    """给人看的一周小结，重点是"这周该给名词表补哪几个词"。"""
    lines: list[str] = []
    lines.append(f"# 热词周报 {report['week']}")
    lines.append("")
    lines.append(f"生成时间：{report['generatedAt']}")
    lines.append("")

    stats = report["stats"]
    lines.append("## 这轮扫了多少")
    lines.append("")
    lines.append(f"- 抓到 {stats['totalItems']} 条，筛出 AI 相关 {stats['aiItems']} 条")
    for name, count in stats["sourceCounts"].items():
        lines.append(f"- {name}：{count} 条")
    if stats["failedSources"]:
        lines.append(f"- 失败的源：{'、'.join(stats['failedSources'])}")
    lines.append("")

    pending = [w for w in report["watchlist"] if not w["inGlossary"]]
    lines.append("## 关注清单里还没写进名词表的")
    lines.append("")
    if pending:
        for w in pending:
            lines.append(f"### {w['term']}（{w['hits']} 次，来源：{'、'.join(w['sources'])}）")
            lines.append("")
            for sample in w["samples"]:
                lines.append(f"- [{sample['title']}]({sample['url']})")
            lines.append("")
    else:
        lines.append("这周没有。")
        lines.append("")

    lines.append("## 机器抽出来的新词（不在名词表里）")
    lines.append("")
    if report["candidates"]:
        lines.append("| 词 | 次数 | 来源数 | 首次出现 |")
        lines.append("| --- | --- | --- | --- |")
        for c in report["candidates"]:
            lines.append(f"| {c['term']} | {c['hits']} | {len(c['sources'])} | {c['firstSeen']} |")
        lines.append("")
        lines.append("抽样出处：")
        lines.append("")
        for c in report["candidates"][:10]:
            lines.append(f"- **{c['term']}** — [{c['sampleTitle']}]({c['sampleUrl']})")
        lines.append("")
    else:
        lines.append("这周没有。")
        lines.append("")

    lines.append("## 名词表里已有、但这周很热的词")
    lines.append("")
    if report["knownCandidates"]:
        lines.append("| 词 | 次数 | 来源数 |")
        lines.append("| --- | --- | --- |")
        for c in report["knownCandidates"][:15]:
            lines.append(f"| {c['term']} | {c['hits']} | {len(c['sources'])} |")
    else:
        lines.append("没有。")
    lines.append("")

    lines.append("## 这周的 AI 条目")
    lines.append("")
    for item in report["items"][:25]:
        lines.append(f"- [{item['title']}]({item['url']}) — {item['source']}")
    lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("候选词只代表「这周有人在说」，不代表「它是个值得学的概念」。")
    lines.append("进不进名词表，由人看完出处再决定。")
    lines.append("")

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="每周爬一次 AI 新概念")
    parser.add_argument("--out", default=str(DEFAULT_OUT), help="输出目录")
    parser.add_argument("--glossary", default=str(GLOSSARY), help="lib/glossary.ts 的路径")
    args = parser.parse_args()

    out_dir = Path(args.out)
    week = iso_week()
    glossary = terms_mod.load_glossary_terms(args.glossary)
    logger.info("名词表里已有 %d 个词", len(glossary))

    topics, counts, failed = collect()
    if not topics:
        logger.error("所有源都没抓到东西。不覆盖已有报告，直接退出。")
        return 1

    seen_path = out_dir / "seen.json"
    seen = terms_mod.load_seen(str(seen_path))

    report, seen = build_report(topics, counts, failed, glossary, seen, week)

    _write_json(out_dir / "latest.json", report)
    _write_json(seen_path, seen)
    write_markdown(out_dir / f"{week}.md", report)

    logger.info(
        "AI 相关 %d 条；候选新词 %d 个；关注清单命中 %d 条（其中未进名词表 %d 条）",
        report["stats"]["aiItems"],
        len(report["candidates"]),
        len(report["watchlist"]),
        len([w for w in report["watchlist"] if not w["inGlossary"]]),
    )
    if failed:
        logger.warning("失败的源：%s", "、".join(failed))
    logger.info("已写入 %s", out_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
