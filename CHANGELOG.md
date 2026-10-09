# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.2] - 2026-10-09

### Fixed
- **生产环境所有 `onClick` 控件都点不动**（汉堡菜单、学习助手的「直接回答 / 引导思考」、
  测验选项、练习「检查」……），只有 `<a href>` 还能用，看起来就是「有的按钮用不了」：
  `middleware.ts` 在生产分支把 CSP 收成了 `script-src 'self'`，而 App Router 是把
  RSC/flight 数据用**内联脚本**下发的（`self.__next_f.push(...)`）。内联脚本被浏览器拦掉后
  React 拿不到 flight 数据，hydration 直接失败——线上实测：控制台两条 CSP 拦截报错、
  `Minified React error #412`、根容器上没有任何 `__react*` 属性、点「引导思考」`aria-pressed`
  纹丝不动、点汉堡菜单抽屉不出现。现在生产保留 `script-src 'self' 'unsafe-inline'`
  （`'unsafe-eval'` 仍然只在开发模式放开），另补 `object-src 'none'` 作为补偿。
  之所以不上 nonce：Next 官方文档写明 nonce 要求全站动态渲染（静态生成时没有请求头可读），
  本站是纯预渲染 + CDN 缓存的课程站，代价不成比例；SRI 那套只管外部脚本，覆盖不到内联 flight 数据。
  这条规则 0.1.x 踩过、0.2.0 修过，0.3.0 重做界面时又退回去了，因此新增
  `lib/__tests__/middleware-csp.test.ts` 把「生产必须有 `'unsafe-inline'`、绝不能有
  `'unsafe-eval'`」钉成断言
- 只要本机有学习进度，**11 条路由页页都 hydration 失败**（React #418），整棵树被丢回客户端
  重新渲染：`GamificationStatus`（顶栏，每一页都有）、`Recommendations`（首页 / 课程页）、
  `LessonNavigator`（课程目录）、`StatsGrid` / `SkillRadar` / `Heatmap`（学习数据页）都在渲染期间
  直接读 localStorage 里的进度——服务端读不到、客户端读得到，两边文本对不上。
  现在统一在「水合首帧」按服务端那份空进度渲染，水合完成后再切到真实进度
  （新增 `hooks/useHydrated.ts`，走 `useSyncExternalStore`，不在 effect 里 setState）。
  实测：有进度的 11 条路由从「页页报错」变成 0 报错，同时课程目录的 `2 / 76 课完成`、
  学习数据的八块统计（475 XP / 连胜 4 天 / 活跃 1 天 / 16 分钟 / 6 徽章）、能力雷达、
  热力图 365 格与「有记录的 1 天，合计 120 XP」、首页学习建议，水合后都仍是真实数据。
  热力图还多一层「构建那天 ≠ 访问那天」的不一致，一并按同样做法收口
- 「回答方式」对老用户会造成 hydration 不匹配：`ChatInterface` 在 `useState` 初始化里直接读
  `localStorage`，服务端读不到、客户端读得到，选过「引导思考」的人之后每次进课程页都报
  `Minified React error #418`，React 只能把整棵树丢回客户端重渲染（表现为状态先闪一下再跳回去）。
  改成首帧按默认值渲染、挂载后再把上次的选择读回来，并且读回来之前不写，避免这一趟把用户的选择覆盖掉
- 移动端右下角的「课程目录」按钮会被「安装应用」提示整块盖住，点下去只是把提示关掉：
  两个浮层都在右下角，提示是 `fixed bottom-4` + `z-50`，按钮是 `fixed bottom-5 right-5` + `z-30`。
  390×844 实测：提示占 x16–374 / y742–828，按钮占 x314–370 / y768–824，完全重叠，
  `elementFromPoint` 在按钮中心命中的是提示里的关闭按钮。改为 `PWAPrompt` 把自身高度
  写进 `--see-bottom-banner`（含离底边距与 12px 间隔，用 ResizeObserver 跟踪，
  因为窄屏提示会折行变高），按钮据此抬到提示上方；提示不在时位置照旧
- 练习的「检查」按钮在不通过时一声不吭，点了跟坏掉一样（模板代码点「检查」前后 DOM 完全没变化）：
  现在会写明「还没通过：有 N 处没做到」，只报数量、不报具体检查点（报出来等于直接给答案），
  要看方向还是点「提示」。通过时的表现不变

## [0.3.1] - 2026-10-09

### Fixed
- 全站 `<button>` 的鼠标指针是箭头而不是手型，按钮看起来"点不了"：
  Tailwind v4 的 preflight 不再给 `button` 设 `cursor: pointer`，而源码里从未补过这一条。
  受影响最明显的是课程页「回答方式」的两个按钮——该页 106 个控件里 104 个是 `<a>`（链接自带手型），
  唯独这两个按钮没有，所以只有它俩显得像坏掉。`/lesson/ai-1-1` 该类控件 2 → 0，
  `/prompts` 55 → 0（现 77 个全部为手型）。已在 `app/globals.css` 基础层补齐，
  禁用态仍保持箭头（`disabled` / `aria-disabled` 一并排除）
- 顶栏 logo 链接在移动端只有 36×44，窄于最小交互目标：正方形图标 36px 宽，
  而其后的文字列在 `sm` 以下是隐藏的，链接宽度就只剩 36px。加上 `min-w-11` 后为 44×44，
  图标仍在 x=16，视觉位置未变
- 可视化页 `TokenStream` 的播放/重置按钮声明了 `h-11 w-11`（44×44），
  却被 flex 横向挤压成 38×44：窄屏下这一行的两个按钮都不是 `shrink-0`。补上后为 44×44
- 可视化页流程图在窄屏被从词中间切断、看上去像渲染坏了：容器宽于 500px 才装得下整张图，
  390px 下第 3 步只露出半个字，4、5 步完全不可见，且移动端不显示横向滚动条，无从得知可以横滑。
  实测 <640px 需要横滑、≥640px 不需要，正好落在 `sm` 断点，故加一行 `sm:hidden` 的滑动提示；
  桌面端不显示，六步完整可见

## [0.3.0] - 2026-10-09

### Added — 采用 DreamNight Design Language (DNDL v1.0)

- **品牌统一重设计**：按 DNDL v1.0（实现版本 1.1.0）重做界面。
  `tokens.css` / `materials.css` / `motion.css` / `LICENSE` 以确定版本逐字节引入，
  另附 `VERSION` 记录来源仓库与 commit，五个文件保持同级关系；未就地改动任何品牌数值。
- **几何与排版**：默认直角、大面积品牌实色块、Display 级排版取代装饰性容器堆叠。
- **可读性**：色块正文统一使用 `--dn-text-on-color`，浅色底次要小字使用 `--dn-text-secondary`；
  按 WCAG 实测逐项核验对比度，不以元素级 opacity 淡化文字。
- **无障碍**：交互目标取 `--dn-target-min`；焦点可见；支持 `prefers-reduced-motion`、
  关闭透明与 `forced-colors` 回退；状态不再只靠颜色传达。
- **信息架构**：页面结构与导航按产品真实内容重做（非仅换色）。


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
