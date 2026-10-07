"""判断一条热榜标题跟 AI 有没有关系。

热榜上大部分是娱乐和时事，直接全收进来会让报告变成垃圾场。
这里的做法分两档：

- 强词：出现一个就算 AI（llm、gpt、transformer、agent、rag、mcp……）
- 弱词：单独出现不算，得凑够两个（model、chip、robot、算法……）

弱词门槛低、误报多，所以宁可漏一点，也不要把「某明星代言」收进来。
"""

from __future__ import annotations

import re

# 出现即判定为 AI 相关
STRONG = [
    # 英文
    "llm", "gpt", "chatgpt", "claude", "gemini", "deepseek", "qwen", "llama", "mistral",
    "transformer", "diffusion", "agent", "agentic", "rag", "mcp", "embedding", "embeddings",
    "multimodal", "fine-tune", "finetune", "finetuning", "prompt", "hallucination",
    "neural", "machine learning", "deep learning", "neural network", "reinforcement learning",
    "rlhf", "grpo", "lora", "quantization", "tokenizer", "inference", "copilot",
    "text-to-image", "text-to-video", "speech synthesis", "open-weight", "open weights",
    # 中文
    "人工智能", "大模型", "大语言模型", "智能体", "多模态", "推理模型", "机器学习",
    "深度学习", "神经网络", "生成式", "文生图", "文生视频", "语音合成", "数字人",
    "具身智能", "自动驾驶", "算力", "提示词", "微调", "开源模型", "知识库", "向量",
    "世界模型", "端侧模型", "对齐", "智能驾驶", "大厂模型",
]

# 单独出现不算，需要凑够 WEAK_THRESHOLD 个
WEAK = [
    "ai", "ml", "model", "models", "chip", "chips", "gpu", "tpu", "cuda", "nvidia",
    "robot", "robotics", "algorithm", "dataset", "benchmark", "training", "inference",
    "ocr", "chatbot", "assistant", "automation", "api", "cloud",
    "算法", "模型", "芯片", "机器人", "数据集", "训练", "推理", "自动化", "语音识别",
    "图像识别", "推荐系统", "云计算", "自动驾驶",
]

WEAK_THRESHOLD = 2

# "ai" 这种两字母词必须按单词边界匹配，否则 "chair"、"said" 全会命中
_EN_WORD = re.compile(r"[a-z0-9][a-z0-9\-]*")


def _normalize(text: str) -> str:
    return text.lower()


def _hits(text: str, words: list[str]) -> list[str]:
    """英文按词边界匹配，中文按子串匹配。"""
    low = _normalize(text)
    tokens = set(_EN_WORD.findall(low))
    found: list[str] = []
    for word in words:
        if word.isascii():
            if " " in word or "-" in word:
                if word in low:
                    found.append(word)
            elif word in tokens:
                found.append(word)
        elif word in text:
            found.append(word)
    return found


def matched_keywords(title: str, summary: str = "") -> list[str]:
    """返回标题里命中的关键词，用来在报告里说明"为什么它算 AI"。"""
    text = f"{title} {summary}"
    return sorted(set(_hits(text, STRONG) + _hits(text, WEAK)))


def is_ai_related(title: str, summary: str = "") -> bool:
    """强词命中一个就通过；否则弱词要命中两个。"""
    text = f"{title} {summary}"
    if _hits(text, STRONG):
        return True
    return len(_hits(text, WEAK)) >= WEAK_THRESHOLD
