**语言 / Language:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-Hant.md) | [日本語](README.ja.md)

# Vibe Coding 入门课

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![CI](https://github.com/dreamnight16/vibe-coding-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/dreamnight16/vibe-coding-agent/actions/workflows/ci.yml)
[![在线体验](https://socialistic.ai/api/embed/dreamcode-vibe-curriculum-6a796a?lang=zh)](https://socialistic.ai/zh/skill/dreamcode-vibe-curriculum-6a796a)

一个边学边做的网页制作互动课程。22 节课分成 7 个章节，配有本地练习和进度记录；遇到卡点时，也可以叫一个可选的小助手过来帮你捋一捋。

---

## 功能

- **22 节系统化课程** — 7 个章节从概念到发布
- **可选学习助手** — 苏格拉底引导模式 + 直接回答模式，流式响应
- **Prompt Playground** — 描述一个小想法，配置模型后生成可运行的 HTML/CSS/JS
- **游戏化系统** — 经验值、等级、连续学习天数、10 种成就徽章
- **代码练习** — 互动式练习，带提示和自动检查
- **学习看板** — 进度追踪、热力图、技能雷达图
- **PWA 支持** — 可安装到桌面，支持离线使用
- **服务商可选** — Claude、OpenAI、DeepSeek 及其他 OpenAI 兼容接口
- **备用线路** — 主服务没接通时尝试备用服务
- **核心流程离线可用** — 课程、练习、测验、进度和作品保存不依赖 API Key 或网络

## 在线体验

无需安装、无需配置 API Key——打开链接就能开始学习；AI 辅助是可选项：

[![在 Socialistic 上体验](https://socialistic.ai/api/embed/dreamcode-vibe-curriculum-6a796a?lang=zh)](https://socialistic.ai/zh/skill/dreamcode-vibe-curriculum-6a796a)

> 在线入口由 [@shesonglin](https://github.com/shesl-tinkerland) 贡献。  
> 官方站点：[learn.dreamnight.net.cn](https://learn.dreamnight.net.cn)

## 快速开始

### 自动设置（推荐）

```bash
bash scripts/setup.sh
```

### 手动

```bash
npm install
cp .env.example .env
# 编辑 .env，填入 API Key
npm run dev
```

打开 http://localhost:3000 开始学习。

> 详细的零基础设置指南：[SETUP_GUIDE.md](./SETUP_GUIDE.md)

### Docker

```bash
docker compose up -d
```

## 配置

### 可选：学习助手

不配置 AI 也可以启动并完成课程。只有需要学习助手、代码生成或代码审阅时，才需要填写以下配置：

```env
# 可选认证；配置后所有 AI 请求都需携带 Bearer 密钥
AI_API_AUTH_TOKEN=

# 主 AI 服务商
AI_PROVIDER=openai-compatible
AI_MODEL=deepseek-chat
AI_API_KEY=sk-...
AI_BASE_URL=https://api.deepseek.com/v1
```

### 可选：备用模型服务

主服务商故障时自动切换：

```env
AI_FALLBACK_PROVIDER=openai
AI_FALLBACK_MODEL=gpt-4o-mini
AI_FALLBACK_API_KEY=sk-...
AI_FALLBACK_BASE_URL=https://api.openai.com/v1
```

完整配置参见 `.env.example`。

## 开发

```bash
npm install
npm run dev      # 启动开发服务器
npm test         # 运行测试（46 个测试，4 个套件）
npm run build    # 生产构建
```

## 技术栈

- [Next.js](https://nextjs.org/) 16 + React 19 + TypeScript（strict 模式）
- [Tailwind CSS](https://tailwindcss.com/) v4
- [AI SDK](https://sdk.vercel.ai/) — 统一多模型接口
- [Vitest](https://vitest.dev/) — 单元测试（目标 80%+ 覆盖率）
- [Lucide React](https://lucide.dev/) — 图标
- [react-markdown](https://github.com/remarkjs/react-markdown) — 渲染课程内容

## 项目结构

```
app/
  api/agent/route.ts        # AI 对话流式接口（认证 + 限流 + 降级）
  api/review/route.ts       # AI 代码审阅接口
  api/storage/route.ts      # 服务端键值存储
  api/analytics/route.ts    # 数据分析端点
  lesson/[id]/page.tsx      # 课程详情页
  dashboard/page.tsx        # 学习看板
  page.tsx                  # 首页
components/
  ChatInterface.tsx         # AI 聊天组件
  PromptPlayground.tsx      # 代码生成练习区
  exercise/                 # 互动代码练习
  dashboard/                # 统计、热力图、技能雷达
  gamification/             # 经验条、徽章解锁、彩纸特效
  visualizations/           # 动画流程图、DOM 树
lib/
  lessons.ts                # 22 节课定义
  progress.ts               # 学习进度（Repository 模式）
  gamification.ts           # 经验值、等级、连续学习
  achievements.ts           # 10 种成就徽章
  adaptive.ts               # 学习推荐引擎
  repository.ts             # 存储抽象层（localStorage / 服务端）
  logger.ts                 # 结构化日志
  analytics.ts              # 用户行为追踪
scripts/
  setup.sh                  # 自动设置脚本
  generate-icons.mjs        # PWA 图标生成器
```

## 自定义课程

编辑 `lib/lessons.ts` 即可修改或添加课程内容，支持 Markdown 格式。

## 部署

### Vercel（推荐）

1. 推送代码到 GitHub
2. 在 [vercel.com](https://vercel.com/) 导入仓库
3. 在项目设置中添加环境变量
4. 点击部署

### Docker

```bash
docker compose up -d
```

使用多阶段构建，镜像约 150MB。

## 相关项目

- [Blog-mizuki](https://github.com/dreamnight16/Blog-mizuki) — 作者个人博客，更多 Vibe Coding 相关文章

## License

MIT

---

<div align="center">

**Language / 语言 / 言語**

[**English**](README.md) | [**简体中文**](README.zh-CN.md) | [**繁體中文**](README.zh-Hant.md) | [**日本語**](README.ja.md)

</div>
