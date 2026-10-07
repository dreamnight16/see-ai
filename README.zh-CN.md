**Language:** [English](README.md) | **简体中文** | [繁體中文](README.zh-Hant.md) | [日本語](README.ja.md)

# 梦夜的 AI 课

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![CI](https://github.com/dreamnight16/learn-to-code/actions/workflows/ci.yml/badge.svg)](https://github.com/dreamnight16/learn-to-code/actions/workflows/ci.yml)
[![Try Online](https://socialistic.ai/api/embed/dreamcode-vibe-curriculum-6a796a?lang=en)](https://socialistic.ai/en/skill/dreamcode-vibe-curriculum-6a796a)

一套面向非专业大学生的 AI 入门课。目标读者不是程序员，而是**手机里装着豆包、平时只会拿它闲聊**的那批人。

整套课不讲模型原理。它只解决一件事：让只会跟 AI 聊天的人，第一次真正用它把一件正事干完——作业、论文、汇报、简历、社团、四六级，然后知道什么时候不该用它。

后两条轨道专门用来跟上节奏：**AI 智能体**（从你问它答，到它自己动手干完）和**跟上浪潮**（推理模型、多模态、AI 搜索、视频生成、机器人，以及怎么分辨真技术和炒作）。

> 原来的「梦夜的编程课」没有消失，它变成了其中一条轨道（AI 编程，22 节课），和另外九条并列。

---

## 十条轨道，76 节课

| 轨道 | 课程数 | 解决什么 |
|------|--------|----------|
| 认识 AI | 5 | 它到底是什么，能做什么，为什么有人说它没用 |
| **大学里怎么用** | **8** | 作业、论文、期末、社团、汇报、简历、四六级 |
| 用得靠谱 | 6 | 幻觉、核实、隐私、AI 诈骗、版权、什么时候别用 |
| 进阶技巧 | 6 | 提示词四件套、给背景、先想再答、喂资料、工作流 |
| **AI 智能体** | **6** | 智能体是什么、手机里哪个能用、工具调用与 MCP、自动化、它翻车时怎么办 |
| **跟上浪潮** | **6** | 推理模型、多模态、AI 搜索与知识库、视频生成、机器人、怎么分辨炒作 |
| 内容创作 | 6 | 画图、海报、配音、短视频、公众号、做小工具 |
| 实习和办公 | 6 | 报告、表格公式、PPT、会议纪要、职场沟通 |
| 日常生活 | 5 | 通知、行程、翻译、陪家人看病前整理、出门前的准备 |
| AI 编程 | 22 | 从网页基础到发布上线，全程用自然语言推进 |

课程表定义在 `lib/lessons.ts`，轨道定义在 `lib/tracks.ts`，正文是 `content/lessons/<id>.md`。

---

## 三个不依赖 AI 的功能

这是这一版的重点：**没有 API Key、不联网，也能把课学完、把提示词练会。**

### 提示词练习场 `/practice`

十二个真实场景（停水通知、请假、出行安排、辅导作业、Excel 汇总、周报、海报、核实说法、客户信息，以及三个智能体场景：跑调研、做自动化、给会对外动手的任务立规矩）。你写一遍自己的提问，本地规则引擎立刻打分，并指出漏了哪几样。

打分逻辑在 `lib/prompt-coach.ts`，一共二十条探测器：受众、长度、语气、格式、背景、例子、多版本、让它先问你、要求它别乱编、隐私信息、含糊用词……纯规则，结果稳定，有测试盯着。

### 提示词库 `/prompts`

45 条可以直接复制去用的话术，九个分类（含「智能体」一类：让它先给计划、把丑话说在前面、让它自己验收、把重复的活写成说明书）。带方括号占位的地方换成你自己的情况。

### AI 名词表 `/glossary`

68 个术语，分成六组，其中一组是「新潮概念」——工具调用、computer use、多智能体、推理模型、世界模型、具身智能、上下文工程、端侧模型这些最近才冒出来的说法，每个都配大白话解释、一个生活里的比方，和一处容易被人忽悠的地方。

另外还有 `/start`：四道题帮你排出适合自己的学习顺序。

### 每周热词 `/trends`

每周一自动扫一遍 AI 圈的论文、模型和热榜，把反复出现的说法挑出来，提交回仓库。

**一条硬规矩：爬虫不许写解释。** 它只产出「候选词 + 出现次数 + 出处链接」，页面上明确标着这些都是机器抓的、还没写解释。名词表里的每一条解释仍然由人写完再上线——机器写的东西没人核对过，放上去就是给读者添乱。

爬虫复用了作者另外两个仓库：

| 仓库 | 复用什么 |
|------|----------|
| [chinese-scraper-utils](https://github.com/dreamnight16/chinese-scraper-utils) | 微博/知乎/Hacker News 热榜抓取、UA 池、限速、稳定 ID；本仓库用它的 `register_scraper` 把 Hugging Face 每日论文和 arXiv 注册成同一种数据源 |
| [weekly-hotspot](https://github.com/dreamnight16/weekly-hotspot) | 「多源抓取 → 去重 → 过滤 → 输出 JSON + Markdown 周报」这条流水线的骨架，以及每周定时提交的工作流写法 |

数据源五个：Hugging Face 每日论文、arXiv cs.AI、Hacker News、微博热搜、知乎热榜。任何一个源挂掉都只记录不中断，报告里会写清哪几个源这轮没抓到。

```bash
pip install -r scripts/trends/requirements.txt
python -m pytest scripts/trends -q   # 20 个纯函数测试，不联网
python scripts/trends/crawl.py       # 也可以 npm run trends
```

输出三个文件：

- `data/trends/latest.json` —— 网站读的那个
- `data/trends/<YYYY-Www>.md` —— 给人看的周报，重点是"这周该给名词表补哪几个词"
- `data/trends/seen.json` —— 每个词第一次出现的周次，只增不改

---

## 功能一览

- **76 节结构化课程**，10 条轨道，可跳着学，也可以按顺序走
- **22 个章节测验**，考「会不会用」，不考名词背诵
- **离线练习场**，纯规则反馈，不需要任何配置
- **提示词库 + 名词表**，可搜索、可复制
- **每周热词**（`/trends`）：每周自动抓一次 AI 圈的新说法，只放候选词和出处，不放机器写的解释
- **学习向导**，四道题推荐起点
- **游戏化**：XP、等级、连续天数、14 个徽章（现在真的会解锁了）
- **学习仪表盘**：进度、热力图、能力雷达
- **可选学习助手**：Claude、OpenAI、DeepSeek 等 OpenAI 兼容接口，支持备用模型
- **PWA**：可安装，课程与练习离线可用

---

## 快速开始

```bash
npm install
cp .env.example .env   # 不配也能跑，学习助手会显示为不可用
npm run dev
```

打开 http://localhost:3000。

> 完全不想碰命令行的同学，直接用在线版：https://learn.dreamnight.net.cn

### Docker

```bash
docker compose up -d
```

---

## 可选：接入学习助手

课程、练习、测验、提示词库、名词表都不需要 API Key。只有页面底部的「学习助手」需要：

```env
AI_PROVIDER=openai-compatible
AI_MODEL=deepseek-chat
AI_API_KEY=sk-...
AI_BASE_URL=https://api.deepseek.com/v1
```

备用模型、鉴权 token、限流等选项见 `.env.example`。

---

## 开发

```bash
npm run dev      # 开发服务器
npm test         # 单元测试
npm run lint     # ESLint
npm run build    # 生产构建
```

### 关键目录

```
app/
  page.tsx                  首页：轨道卡片 + 完整课程表
  lesson/[id]/page.tsx      课程页（正文 + 练习 + 测验 + 可选助手）
  prompts/                  提示词库
  practice/                 提示词练习场
  glossary/                 名词表
  start/                    四道题的选路向导
  trends/                   每周热词（读 data/trends/latest.json）
components/
  practice/PromptLab.tsx    练习场交互
  prompts/PromptLibrary.tsx 提示词库交互
  glossary/                 名词表交互
  StartWizard.tsx           选路向导
lib/
  tracks.ts                 十条轨道
  lessons.ts                76 节课的课程表
  prompt-coach.ts           离线提示词评分引擎
  prompt-library.ts         45 条提示词，9 个分类
  glossary.ts               68 个术语，6 个分组
  practice-scenarios.ts     练习场场景
  quiz-data.ts              老测验 + 新轨道测验汇总
  quiz-data-ai.ts           20 个新轨道测验
  achievements.ts           14 个徽章
  adaptive.ts               学习建议
  progress.ts               学习进度（schema v3）
  trends.ts                 每周热词报告的读取与校验
scripts/trends/             热词爬虫（Python）
  crawl.py                  入口
  sources.py                五个数据源，复用 chinese-scraper-utils
  keywords.py               判断一条标题跟 AI 有没有关系
  terms.py                  抽候选词、盯关注清单、跟名词表对账
content/lessons/            76 篇课程正文
data/trends/                每周热词的产出（由定时任务提交）
```

### 加一节课

1. 在 `content/lessons/` 下写 `<id>.md`（不要写 H1，页面会渲染标题）
2. 在 `lib/lessons.ts` 里加一行
3. 跑 `npm test` —— `lib/__tests__/curriculum.test.ts` 会检查每一课都有正文、前置课程存在、轨道有效

---

## 技术栈

**网站**：Next.js 16 + React 19 + TypeScript（strict）· Tailwind CSS v4 · AI SDK（多模型）· Vitest · lucide-react · react-markdown

**爬虫**：Python 3.11+ · chinese-scraper-utils · httpx · pytest。只在跑 `scripts/trends` 时需要 Python，网站本身不需要。

## 部署

推送到 GitHub 后在 Vercel 导入即可，环境变量可选。也可以 `docker compose up -d`。

## License

MIT

---

<div align="center">

**Language / 语言 / 言語**

[**English**](README.md) | [**简体中文**](README.zh-CN.md) | [**繁體中文**](README.zh-Hant.md) | [**日本語**](README.ja.md)

</div>
