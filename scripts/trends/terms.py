"""从标题里捞出"可能的新概念"。

两条线：

1. 机器抽词：标题里的大写缩写（MCP、GRPO、MoE）和驼峰专名（DeepSeek、PyTorch）。
   这类词在新论文和新模型名里出现得最密，是发现新概念最快的入口。
2. 关注清单：一份人工维护的词表，专门盯那些"该不该写进名词表"的说法。
   中文没有分词就抽不出干净的概念词，所以中文靠这份清单，而不是靠机器硬猜。

两条线都只产出「候选词 + 出处」，不产出任何解释。
解释一律由人来写，这是这个功能的设计前提。
"""

from __future__ import annotations

import json
import re
from dataclasses import asdict, dataclass, field

# ── 1. 机器抽词 ──────────────────────────────────────────────

# 先按"词"切，再用规则筛，比直接上正则准确得多。
_TOKEN = re.compile(r"\b[A-Za-z][A-Za-z0-9]{1,19}\b")

# 这些词是机器学习领域的通用词汇，每周都霸榜，不是"新概念"
GENERIC = {
    "model", "models", "agent", "agents", "language", "languages", "learning", "data",
    "network", "networks", "system", "systems", "training", "method", "methods",
    "approach", "approaches", "framework", "frameworks", "benchmark", "benchmarks",
    "dataset", "datasets", "evaluation", "analysis", "study", "survey", "review",
    "attention", "memory", "reasoning", "retrieval", "generation", "understanding",
    "efficient", "scalable", "robust", "unified", "towards", "beyond", "rethinking",
    "improving", "enhancing", "exploring", "learning", "large", "small", "deep",
}

# 这些全大写词是常见英文单词（论文标题爱把方法名写成全大写），当成概念收进来就是噪音
UPPERCASE_WORDS = {
    "TRACE", "UNREAL", "TALK", "POWER", "LEARN", "SCALE", "SPEED", "LIGHT", "SMART",
    "FIRST", "FAST", "GOOD", "BEST", "REAL", "TRUE", "OPEN", "FREE", "NEXT", "LAST",
    "MORE", "LESS", "MUCH", "MANY", "MOST", "SOME", "EACH", "BOTH", "SAME", "ONLY",
    "OVER", "INTO", "FROM", "WITH", "WITHOUT", "UNDER", "ABOUT", "AFTER", "BEFORE",
    "WHEN", "WHERE", "WHICH", "WHILE", "THAT", "THIS", "THESE", "THOSE", "THERE",
    "THEIR", "WHAT", "WILL", "WOULD", "COULD", "SHOULD", "CAN", "MAY", "MUST",
    "MAKE", "MAKES", "TAKE", "TAKES", "GIVE", "GIVES", "FIND", "FINDS", "KEEP",
    "YOUR", "OURS", "THEM", "THEY", "HAVE", "HAS", "HAD", "BEEN", "WERE", "WAS",
    "ARE", "NOT", "BUT", "ALSO", "EVEN", "JUST", "LIKE", "WELL", "ONLY", "VERY",
    "PLUS", "ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT",
    "NINE", "TEN", "NEW", "OLD", "BIG", "LOW", "HIGH", "LONG", "SHORT", "FULL",
    "HALF", "PART", "TIME", "YEAR", "WEEK", "DAY", "HOUR", "MIN", "SEC",
}

# 常见非 AI 的专有名词，别收
STOPWORDS = {
    "AI", "ML", "THE", "AND", "FOR", "YOU", "NEW", "ALL", "HOW", "WHY", "WHAT", "WHO",
    "USA", "US", "UK", "EU", "CEO", "CTO", "API", "URL", "HTTP", "HTML", "CSS", "JSON",
    "PDF", "PC", "TV", "APP", "OK", "IT", "IS", "IN", "ON", "OF", "TO", "AT", "BY", "OR",
    "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN", "JAN", "FEB", "MAR", "APR",
    "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "AM", "PM", "GMT", "UTC",
    "PDF", "SQL", "CPU", "RAM", "USB", "WIFI", "GPS", "FAQ", "DIY", "ASAP", "ETC",
    "HN", "GH", "PR", "OS", "UI", "UX", "DB", "CDN", "SDK", "IDE", "VPS", "SEO",
}


def is_candidate_token(token: str) -> bool:
    """判断一个词像不像"值得记一笔的 AI 名词"。

    规则故意保守——宁可这周一个词都不提，也别推一堆 Models、Language 这种词上去。
    通过的条件（满足其一）：
      - 全大写且长度不超过 6，像 LLM / MCP / GRPO / RLHF / FP4
      - 大小写混排且至少两个大写，像 MoE / LoRA / DeepSeek / ChatGPT / PyTorch
    两种情况都要先过掉通用词和常见英文单词。
    """
    if len(token) < 2 or len(token) > 20:
        return False
    if token.upper() in STOPWORDS:
        return False
    if token.lower() in GENERIC:
        return False

    upper_count = sum(1 for ch in token if ch.isupper())
    if upper_count < 2:
        return False

    is_all_caps = token.isupper()
    if is_all_caps:
        # TRACE / UNREAL 这类"全大写的普通英文词"是论文标题的写法，不是概念
        if token in UPPERCASE_WORDS:
            return False
        return len(token) <= 6

    # 大小写混排：要求首字母大写（专名或缩写），且至少一个大写不在首位
    if not token[0].isupper():
        return False
    return any(ch.isupper() for ch in token[1:])

# ── 2. 关注清单 ──────────────────────────────────────────────

# 想盯的新说法。每条出现就在报告里标一次，方便判断"是不是该写进名词表了"。
WATCHLIST = [
    "上下文工程", "context engineering",
    "世界模型", "world model",
    "多智能体", "multi-agent",
    "computer use", "computer-use",
    "具身智能", "embodied",
    "端侧模型", "on-device",
    "推理模型", "reasoning model",
    "混合专家", "mixture of experts", "MoE",
    "长上下文", "long context",
    "合成数据", "synthetic data",
    "智能体记忆", "agent memory",
    "提示词缓存", "prompt caching",
    "模型上下文协议", "model context protocol", "mcp",
    "工具调用", "tool use", "function calling",
    "强化学习环境", "rl environment",
    "蒸馏", "distillation",
    "量化", "quantization",
    "越狱", "jailbreak",
    "提示词注入", "prompt injection",
]


@dataclass
class Candidate:
    term: str
    hits: int = 0
    sources: list[str] = field(default_factory=list)
    sampleTitle: str = ""
    sampleUrl: str = ""
    inGlossary: bool = False
    firstSeen: str = ""

    def to_dict(self) -> dict:
        return asdict(self)


def load_glossary_terms(path: str) -> set[str]:
    """从 lib/glossary.ts 里把已有的词抠出来，用来标记"这个词名词表里有了"。

    直接读源文件而不是 import，是因为这里跑在 Python 里，
    而且名词表本来就该是唯一事实来源——读它反而最稳。
    """
    try:
        with open(path, encoding="utf-8") as fh:
            text = fh.read()
    except OSError:
        return set()

    terms: set[str] = set()
    for pattern in (r'term:\s*"([^"]+)"', r'en:\s*"([^"]+)"'):
        for match in re.findall(pattern, text):
            terms.add(match.strip())
    return terms


def _norm_key(word: str) -> str:
    """归一化用于去重。

    全大写的缩写要折掉复数，否则 LLMs 和 LLM、VLAs 和 VLA 会被当成两个词，
    报告里就会出现"同一件事占两行"。
    """
    # LLMs 的 isupper() 是 False（末尾有个小写 s），所以要先剥掉复数再判断
    core = word[:-1] if word.endswith(("s", "S")) else word
    if len(core) >= 2 and core.isupper():
        word = core
    return word.lower().replace(" ", "").replace("-", "")


def extract_terms(titles: list[tuple[str, str, str]], glossary: set[str]) -> list[Candidate]:
    """从 (标题, 来源, 链接) 列表里抽候选词。

    同一个词在多条标题里出现就累加，来源去重。
    """
    glossary_keys = {_norm_key(g) for g in glossary}
    buckets: dict[str, Candidate] = {}

    for title, source, url in titles:
        found = {word for word in _TOKEN.findall(title) if is_candidate_token(word)}
        for word in found:
            key = _norm_key(word)
            bucket = buckets.get(key)
            if bucket is None:
                bucket = Candidate(
                    term=word,
                    inGlossary=key in glossary_keys,
                    sampleTitle=title,
                    sampleUrl=url,
                )
                buckets[key] = bucket
            bucket.hits += 1
            if source not in bucket.sources:
                bucket.sources.append(source)

    # 命中多、来源广的排前面；来源数优先于次数，因为跨源出现更像真信号
    ranked = sorted(buckets.values(), key=lambda c: (-len(c.sources), -c.hits, c.term))
    return ranked


def match_watchlist(entries: list[tuple[str, str, str]], glossary: set[str]) -> list[dict]:
    """关注清单里这周出现过的说法，带上出现次数和出处。"""
    glossary_keys = {_norm_key(g) for g in glossary}
    results: list[dict] = []

    for phrase in WATCHLIST:
        needle = phrase.lower()
        hits = 0
        samples: list[dict] = []
        sources: list[str] = []
        for title, source, url in entries:
            if needle in title.lower():
                hits += 1
                if source not in sources:
                    sources.append(source)
                if len(samples) < 3:
                    samples.append({"title": title, "url": url, "source": source})
        if hits:
            results.append(
                {
                    "term": phrase,
                    "hits": hits,
                    "sources": sources,
                    "samples": samples,
                    "inGlossary": _norm_key(phrase) in glossary_keys,
                }
            )

    return sorted(results, key=lambda r: (-len(r["sources"]), -r["hits"], r["term"]))


def load_seen(path: str) -> dict:
    try:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
        return data if isinstance(data, dict) else {}
    except (OSError, json.JSONDecodeError):
        return {}


def save_seen(path: str, seen: dict) -> None:
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(seen, fh, ensure_ascii=False, indent=2, sort_keys=True)
        fh.write("\n")


def mark_first_seen(candidates: list[Candidate], seen: dict, week: str) -> dict:
    """标出每个候选词第一次出现的周次，并返回更新后的 seen。

    seen 里存的是 {归一化词: 首次出现的周次}，只增不改。
    """
    for candidate in candidates:
        key = _norm_key(candidate.term)
        if key in seen:
            candidate.firstSeen = seen[key]
        else:
            seen[key] = week
            candidate.firstSeen = week
    return seen
