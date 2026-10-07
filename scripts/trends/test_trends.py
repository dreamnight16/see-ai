"""爬虫里纯函数的测试。不联网，任何一轮都能跑。

跑法：python -m pytest scripts/trends -q
（npm test 只跑 TypeScript；这边单独一条命令，CI 里挂在热词工作流上。）
"""

from __future__ import annotations

import keywords
import sources
import terms
from chinese_scraper_utils import HotTopic


def _topic(title: str, source: str = "fake") -> HotTopic:
    return HotTopic(title=title, summary="", url="https://example.com/x", source=source, raw_score=1)


class TestCollectResilience:
    """抓取最容易在 CI 上出问题的就是"某个源挂了"。

    这里的契约是：任何一个源出问题都不能让整轮跑挂掉，
    而且必须在 failed 里说出来，否则报告会假装一切正常。
    """

    def test_one_source_exploding_does_not_kill_the_run(self, monkeypatch):
        def boom():
            raise RuntimeError("network is down")

        def fine():
            return [_topic("A new LLM benchmark")]

        monkeypatch.setattr(sources, "SOURCE_SCRAPERS", [("boom", boom), ("fine", fine)])
        topics, counts, failed = sources.collect()

        assert [t.title for t in topics] == ["A new LLM benchmark"]
        assert counts == {"fine": 1}
        assert failed == ["boom"]

    def test_source_returning_nothing_counts_as_failed(self, monkeypatch):
        # 库自带的抓取函数失败时是吞掉异常返回空列表，
        # 如果不把"空"记成失败，报告里就看不出来这个源其实没抓到。
        monkeypatch.setattr(
            sources,
            "SOURCE_SCRAPERS",
            [("empty", lambda: []), ("fine", lambda: [_topic("LLM news")])],
        )
        _, counts, failed = sources.collect()

        assert counts["empty"] == 0
        assert "empty" in failed

    def test_every_source_failing_returns_nothing_instead_of_raising(self, monkeypatch):
        def boom():
            raise RuntimeError("nope")

        monkeypatch.setattr(sources, "SOURCE_SCRAPERS", [("a", boom), ("b", boom)])
        topics, counts, failed = sources.collect()

        assert topics == []
        assert counts == {}
        assert failed == ["a", "b"]

    def test_duplicate_titles_are_merged_keeping_the_first_source(self, monkeypatch):
        # 垂直源排在通用热榜前面，去重后应该保留信号质量更高的那个
        monkeypatch.setattr(
            sources,
            "SOURCE_SCRAPERS",
            [
                ("vertical", lambda: [_topic("Same Headline", "vertical")]),
                ("general", lambda: [_topic("same headline", "general")]),
            ],
        )
        topics, _, _ = sources.collect()

        assert len(topics) == 1
        assert topics[0].source == "vertical"


class TestIsCandidateToken:
    def test_keeps_real_acronyms(self):
        for token in ["LLM", "MCP", "RAG", "GRPO", "RLHF", "FP4", "LoRA", "MoE", "DeepSeek", "PyTorch", "HuatuoGPT"]:
            assert terms.is_candidate_token(token), token

    def test_rejects_plain_capitalised_words(self):
        # 论文标题里到处都是这种词，收进来就是噪音
        for token in ["Models", "Language", "Learning", "Model", "Agents", "Training"]:
            assert not terms.is_candidate_token(token), token

    def test_rejects_all_caps_english_words(self):
        for token in ["TRACE", "UNREAL", "POWER", "SMART"]:
            assert not terms.is_candidate_token(token), token

    def test_rejects_known_stopwords(self):
        for token in ["AI", "ML", "HN", "USA", "CPU"]:
            assert not terms.is_candidate_token(token), token

    def test_rejects_too_long_all_caps(self):
        assert not terms.is_candidate_token("VERYLONGACRONYM")


class TestNormaliseKey:
    def test_folds_plural_of_all_caps(self):
        assert terms._norm_key("LLMs") == terms._norm_key("LLM")
        assert terms._norm_key("VLAs") == terms._norm_key("VLA")

    def test_keeps_lowercase_words_apart(self):
        assert terms._norm_key("Model") != terms._norm_key("Models")

    def test_ignores_spaces_and_dashes(self):
        assert terms._norm_key("context engineering") == terms._norm_key("context-engineering")


class TestExtractTerms:
    def test_counts_hits_and_sources(self):
        entries = [
            ("Training MoE Models at Scale", "Hugging Face 每日论文", "https://a"),
            ("A Study of MoE Routing", "arXiv cs.AI", "https://b"),
            ("Unrelated headline", "微博热搜", "https://c"),
        ]
        result = terms.extract_terms(entries, set())
        moe = next(c for c in result if c.term == "MoE")
        assert moe.hits == 2
        assert len(moe.sources) == 2

    def test_marks_terms_already_in_glossary(self):
        result = terms.extract_terms([("Using MCP Servers", "Hacker News", "https://a")], {"MCP"})
        mcp = next(c for c in result if c.term == "MCP")
        assert mcp.inGlossary is True

    def test_cross_source_ranks_above_single_source(self):
        entries = [
            ("GRPO works", "arXiv cs.AI", "https://a"),
            ("GRPO again", "Hugging Face 每日论文", "https://b"),
            ("XYZZY appears", "arXiv cs.AI", "https://c"),
        ]
        result = terms.extract_terms(entries, set())
        assert result[0].term == "GRPO"


class TestMarkFirstSeen:
    def test_records_new_terms_only_once(self):
        candidates = [terms.Candidate(term="GRPO"), terms.Candidate(term="MoE")]
        seen: dict = {}
        terms.mark_first_seen(candidates, seen, "2026-W41")
        assert seen == {"grpo": "2026-W41", "moe": "2026-W41"}

        # 下一周再看到 GRPO，firstSeen 应该还是第一周
        again = [terms.Candidate(term="GRPO")]
        terms.mark_first_seen(again, seen, "2026-W42")
        assert again[0].firstSeen == "2026-W41"
        assert seen["grpo"] == "2026-W41"


class TestMatchWatchlist:
    def test_finds_phrases_ignoring_case(self):
        entries = [("Scaling World Models", "arXiv cs.AI", "https://a")]
        hits = terms.match_watchlist(entries, set())
        assert any(h["term"] == "world model" for h in hits)

    def test_flags_terms_already_documented(self):
        entries = [("Prompt Injection Attacks", "Hacker News", "https://a")]
        hits = terms.match_watchlist(entries, set())
        assert any(h["term"] == "prompt injection" and h["inGlossary"] is False for h in hits)


class TestKeywordFilter:
    def test_strong_keyword_alone_is_enough(self):
        assert keywords.is_ai_related("OpenAI releases a new LLM")
        assert keywords.is_ai_related("智能体产品发布")

    def test_single_weak_keyword_is_not_enough(self):
        assert not keywords.is_ai_related("Apple announces a new chip")

    def test_two_weak_keywords_pass(self):
        assert keywords.is_ai_related("New chip and GPU announced")

    def test_entertainment_headlines_are_filtered_out(self):
        assert not keywords.is_ai_related("某明星官宣结婚")
        assert not keywords.is_ai_related("今天下雨，出行注意安全")

    def test_word_boundary_avoids_false_positives(self):
        # "ai" 不能命中 chair / said / main
        assert not keywords.is_ai_related("He said the chair is mine")

    def test_matched_keywords_explains_why(self):
        assert "llm" in keywords.matched_keywords("A new LLM benchmark")
