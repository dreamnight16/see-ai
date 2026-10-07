# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 新增「AI 智能体」轨道（6 节）：智能体与聊天机器人的区别、手机里的智能体入口、会操作浏览器的智能体、工具调用与 MCP、把重复的事串成自动化、以及它翻车时的风险边界
- 新增「跟上浪潮」轨道（6 节）：推理模型、多模态、AI 搜索与知识库、AI 视频/音乐/数字人、机器人与 AI 硬件、怎么分辨真东西和炒作并持续跟进
- 名词表新增「新潮概念」分组，术语从 50 个扩到 68 个（工具调用、computer use、多智能体、推理模型、世界模型、具身智能、上下文工程、端侧模型、合成数据等）
- 提示词库新增「智能体」分类，共 45 条
- 练习场新增 3 个智能体场景（跑调研、做自动化、给会对外动手的任务立规矩），共 12 个场景
- 新增 4 个测验（智能体与新概念），新轨道测验总数达 20 个
- 新增每周热词爬虫 `scripts/trends/`，复用 dreamnight16 的 chinese-scraper-utils（热榜抓取、UA 池、限速）和 weekly-hotspot（多源流水线与定时提交），五个数据源：Hugging Face 每日论文、arXiv cs.AI、Hacker News、微博热搜、知乎热榜
- 新增 `/trends` 本周热词页：只展示候选词与出处，不展示任何机器撰写的解释
- 新增 `.github/workflows/trends.yml`，每周一自动抓取并提交 `data/trends/`
- 新增 `lib/__tests__/trends.test.ts`（10 个用例）与 `scripts/trends/test_trends.py`（20 个用例），后者专门断言"爬虫不会产出解释字段"

### Fixed
- 课程正文里的 Markdown 表格之前根本没渲染成表格，而是原样显示成一堆竖线：react-markdown 默认不带 GFM，现已接入 remark-gfm，并补上表格样式（20 篇课程用到表格）
- 课程正文里的分点列表没有项目符号也没有缩进：Tailwind 的 preflight 把 `ul`/`ol` 的 `list-style` 清零了，现已在 `.prose` 里补回来
- 首页和选路向导里写死的「八条轨道」已经和实际轨道数对不上（现在是十条），首页改为按 `tracks.length` 动态渲染
- Dockerfile 之前没有把 `content/` 拷进运行镜像，容器里每节课都会显示成"正文还在写"；现在 `content/` 和 `data/` 都会拷进去

### Added
- 新增「大学里怎么用」轨道（8 节），面向只会拿豆包闲聊的非专业大学生：作业、论文、期末复习、社团、简历、汇报、四六级
- 课程从 22 节扩到 64 节，重组为 8 条轨道：认识 AI、大学里怎么用、用得靠谱、进阶技巧、内容创作、实习和办公、日常生活、AI 编程
- 离线提示词练习场 `/practice`：9 个真实场景 + 20 条规则的本地评分引擎（`lib/prompt-coach.ts`），不需要 API Key 或联网
- 提示词库 `/prompts`：40 条可直接复制的话术，8 个分类，支持搜索
- AI 名词表 `/glossary`：50 个术语，配大白话解释、生活比方和常见误解
- 选路向导 `/start`：四道题推荐学习起点
- 新增 12 个测验（48 道题），考「会不会用」而非名词背诵
- 练习场、每日打卡和提示词检查现在会发放 XP

### Changed
- 站名从「梦夜的编程课」改为「见 AI」，首页改为面向非专业大学生的 AI 入门；仓库改名为 `see-ai`
- 全仓库清理旧标识：CONTRIBUTING、SETUP_GUIDE、scripts/setup.sh、package.json 里的仓库地址和课程名都还指着已改名的 `vibe-coding-agent`，四个 README 的 CI 徽章也是
- 仓库改名为 `see-ai`（原 `learn-to-code`）。GitHub 会为旧地址自动跳转，历史外链不会断
- 课程导航按「轨道 → 章节 → 课程」三层分组
- 学习建议改为轨道感知，并会推荐练习场和提示词库
- 进度存储升级到 schema v3（新增 `exercisesCompleted`、`promptChecks`），旧数据自动迁移
- 系统提示词改为 AI 素养导师，苏格拉底模式针对提示词而不是编程

### Fixed
- 徽章此前从未真正解锁（`checkNewBadges` 没有被调用），现在接入游戏事件与打卡流程
- 课程正文文件缺失时不再让页面 500，改为显示一段说明

## [0.2.0] - 2026-06-12

### Added
- Production hardening: Vitest test suite, repository pattern for data access, observability tooling, and security fixes

### Changed
- Updated README translations (zh-CN, zh-Hant, ja) and refreshed blog link

### Fixed
- CSP that was blocking Next.js inline scripts and breaking all client interactivity

## [0.1.2] - 2026-06-05

### Added
- Gamification, exercises, and visualizations for lessons
- Dashboard and showcase views
- Editorial redesign with enhanced lesson content
- Community health files, GitHub issue/PR templates, and multi-language READMEs
- Complete zh-Hant and ja README translations

### Fixed
- Dropped Node 18 from CI to avoid build incompatibilities

### Security
- Require API authentication, removed `unsafe-eval` from the production CSP, added CSRF checks

## [0.1.1] - 2026-05-24

### Added
- MIT LICENSE
- CI workflow running `tsc --noEmit` and Next.js build on Node 18/20/22
- Bilingual English README
- "Related projects" section in the README

### Fixed
- Quiz lookup logic, extracted system prompts, deduplicated progress storage

### Security
- Fixed 11 issues found in a code audit

## [0.1.0] - 2026-05-05

Initial release.

### Added
- Interactive Vibe Coding crash course with 22 lessons
- AI teaching assistant integration
- Multi-model switching with animated UI and a zero-baseline setup guide
- Code playground and progress tracking

### Changed
- Extracted lesson content into separate `.md` files

### Fixed
- Escaped inline code backticks in template literals
- Removed `fs` from the client bundle by loading content in a server-only module
- Loaded markdown content with `fs.readFileSync` instead of `?raw` imports
