"""热词数据源。

三个通用热榜（微博 / 知乎 / Hacker News）直接复用 chinese-scraper-utils；
AI 垂直的两个源（Hugging Face 每日论文、arXiv）用库里的 register_scraper 注册进来，
这样调用方式和通用源完全一致，都返回 HotTopic。

和 weekly-hotspot 的 scraper/sources.py 是同一个套路，只是换了源的组合。
"""

from __future__ import annotations

import logging
import xml.etree.ElementTree as ET

import httpx

from chinese_scraper_utils import (
    HotTopic,
    random_ua,
    register_scraper,
    scrape_hackernews_top,
    scrape_weibo_hot,
    scrape_zhihu_hot,
)

logger = logging.getLogger(__name__)

TIMEOUT = 25
ATOM = "{http://www.w3.org/2005/Atom}"


def _headers() -> dict[str, str]:
    return {"User-Agent": random_ua(), "Accept": "*/*"}


# ═══════════════════════════════════════════════════════════════
# AI 垂直源 1：Hugging Face 每日论文
# ═══════════════════════════════════════════════════════════════


@register_scraper("hf_papers")
def scrape_hf_daily_papers() -> list[HotTopic]:
    """抓 Hugging Face 每日论文榜。

    返回标题里通常直接带着新方法名（GRPO、LoRA 这类），是发现新概念最灵的源。
    失败时抛异常，由调用方记录并跳过，不影响其它源。
    """
    with httpx.Client(timeout=TIMEOUT, follow_redirects=True) as client:
        resp = client.get("https://huggingface.co/api/daily_papers", headers=_headers())
        resp.raise_for_status()
        payload = resp.json()

    topics: list[HotTopic] = []
    for entry in payload if isinstance(payload, list) else []:
        paper = entry.get("paper") or {}
        title = (paper.get("title") or "").strip()
        if not title:
            continue
        paper_id = paper.get("id") or ""
        url = f"https://huggingface.co/papers/{paper_id}" if paper_id else "https://huggingface.co/papers"
        topics.append(
            HotTopic(
                title=title,
                summary=(paper.get("summary") or "")[:280],
                url=url,
                source="Hugging Face 每日论文",
                raw_score=int(paper.get("upvotes") or 0),
            )
        )
    return topics


# ═══════════════════════════════════════════════════════════════
# AI 垂直源 2：arXiv 最新投稿
# ═══════════════════════════════════════════════════════════════

_ARXIV_QUERY = (
    "http://export.arxiv.org/api/query"
    "?search_query=cat:cs.AI+OR+cat:cs.CL+OR+cat:cs.LG"
    "&sortBy=submittedDate&sortOrder=descending&max_results=40"
)


@register_scraper("arxiv_ai")
def scrape_arxiv_ai() -> list[HotTopic]:
    """抓 arXiv 上 cs.AI / cs.CL / cs.LG 的最新投稿标题。"""
    with httpx.Client(timeout=TIMEOUT, follow_redirects=True) as client:
        resp = client.get(_ARXIV_QUERY, headers=_headers())
        resp.raise_for_status()
        xml_text = resp.text

    root = ET.fromstring(xml_text)
    topics: list[HotTopic] = []
    for entry in root.findall(f"{ATOM}entry"):
        title = " ".join((entry.findtext(f"{ATOM}title") or "").split())
        if not title:
            continue
        link = entry.findtext(f"{ATOM}id") or "https://arxiv.org/list/cs.AI/recent"
        summary = " ".join((entry.findtext(f"{ATOM}summary") or "").split())[:280]
        topics.append(
            HotTopic(
                title=title,
                summary=summary,
                url=link,
                source="arXiv cs.AI",
                raw_score=0,
            )
        )
    return topics


# ═══════════════════════════════════════════════════════════════
# 汇总
# ═══════════════════════════════════════════════════════════════

# 顺序按"信号质量"排：垂直源排在前面，通用热榜垫后。
SOURCE_SCRAPERS = [
    ("Hugging Face 每日论文", scrape_hf_daily_papers),
    ("arXiv cs.AI", scrape_arxiv_ai),
    ("Hacker News", scrape_hackernews_top),
    ("微博热搜", scrape_weibo_hot),
    ("知乎热榜", scrape_zhihu_hot),
]


def _dedupe(topics: list[HotTopic]) -> list[HotTopic]:
    """按标题去重，保留第一次出现的那个（也就是信号质量更高的源）。"""
    seen: set[str] = set()
    out: list[HotTopic] = []
    for topic in topics:
        key = topic.title.lower().replace(" ", "")
        if key and key not in seen:
            seen.add(key)
            out.append(topic)
    return out


def collect() -> tuple[list[HotTopic], dict[str, int], list[str]]:
    """逐个源抓取，任何一个源挂掉都只记录不中断。

    Returns:
        (去重后的话题列表, {源名: 条数}, 失败的源名列表)
    """
    collected: list[HotTopic] = []
    counts: dict[str, int] = {}
    failed: list[str] = []

    for name, scraper in SOURCE_SCRAPERS:
        try:
            got = scraper()
        except Exception as exc:  # noqa: BLE001 — 单个源失败不该拖垮整轮
            logger.warning("[%s] 抓取失败：%s: %s", name, type(exc).__name__, exc)
            failed.append(name)
            continue
        counts[name] = len(got)
        collected.extend(got)

    # 库自带的 scrape_weibo_hot 等失败时是把异常吞掉、返回空列表，
    # 所以"没抛异常但一条也没有"同样要记进失败名单，不然报告里会显示成"正常的 0 条"。
    empty = [name for name, _ in SOURCE_SCRAPERS if counts.get(name, 0) == 0]
    failed = sorted(set(failed) | set(empty))

    deduped = _dedupe(collected)
    logger.info("抓取到 %d 条，去重后 %d 条", len(collected), len(deduped))
    return deduped, counts, sorted(set(failed))
