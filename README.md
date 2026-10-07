**Language:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-Hant.md) | [日本語](README.ja.md)

# Vibe Coding Crash Course

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![CI](https://github.com/dreamnight16/vibe-coding-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/dreamnight16/vibe-coding-agent/actions/workflows/ci.yml)
[![Try Online](https://socialistic.ai/api/embed/dreamcode-vibe-curriculum-6a796a?lang=en)](https://socialistic.ai/en/skill/dreamcode-vibe-curriculum-6a796a)

An interactive tutorial site for learning by making. It has 22 lessons across 7 chapters, local exercises, progress tracking, and a small optional helper for when you get stuck.

---

## Features

- **22 structured lessons** — 7 chapters from concepts to publishing
- **Optional study helper** — Ask a question, get a hint, or talk through a stuck point
- **Prompt Playground** — Describe a small idea and get runnable HTML/CSS/JS when a provider is configured
- **Gamification** — XP, levels, streaks, 10 achievement badges
- **Code exercises** — Interactive exercises with hints and auto-check
- **Learning dashboard** — Progress tracking, heatmap, skill radar
- **PWA support** — Installable, works offline
- **Provider choice** — Claude, OpenAI, DeepSeek, and other OpenAI-compatible APIs
- **Fallback path** — Try a backup provider when the primary one is unavailable
- **Offline-friendly core** — Lessons, exercises, quizzes, progress, and saved projects do not require an API key or network

## Try Online

No install, no API key — open the link and start learning immediately. AI assistance is optional:

[![Try dreamcode-vibe-curriculum on Socialistic](https://socialistic.ai/api/embed/dreamcode-vibe-curriculum-6a796a?lang=en)](https://socialistic.ai/en/skill/dreamcode-vibe-curriculum-6a796a)

> Online entry contributed by [@shesonglin](https://github.com/shesl-tinkerland).  
> Official site: [learn.dreamnight.net.cn](https://learn.dreamnight.net.cn)

## Quick Start

### Auto setup (recommended)

```bash
bash scripts/setup.sh
```

### Manual

```bash
npm install
cp .env.example .env
# Edit .env with your API key
npm run dev
```

Open http://localhost:3000 to start learning.

> Detailed setup guide for beginners: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

### Docker

```bash
docker compose up -d
```

## Configuration

### Optional study helper

The app starts and the core course remains usable without AI configuration. Add these values only if you want the assistant, code generation, or code review features:

```env
# Optional authentication: when set, every AI request requires a bearer token
AI_API_AUTH_TOKEN=

# Primary AI provider
AI_PROVIDER=openai-compatible
AI_MODEL=deepseek-chat
AI_API_KEY=sk-...
AI_BASE_URL=https://api.deepseek.com/v1
```

### Optional: Backup model provider

If the primary AI provider fails, the fallback is tried automatically:

```env
AI_FALLBACK_PROVIDER=openai
AI_FALLBACK_MODEL=gpt-4o-mini
AI_FALLBACK_API_KEY=sk-...
AI_FALLBACK_BASE_URL=https://api.openai.com/v1
```

See `.env.example` for all options.

## Development

```bash
npm install
npm run dev      # Start dev server
npm test         # Run tests (46 tests, 4 suites)
npm run build    # Production build
```

## Tech Stack

- [Next.js](https://nextjs.org/) 16 + React 19 + TypeScript (strict mode)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [AI SDK](https://sdk.vercel.ai/) — unified multi-model interface
- [Vitest](https://vitest.dev/) — unit testing (80%+ coverage target)
- [Lucide React](https://lucide.dev/) — icons
- [react-markdown](https://github.com/remarkjs/react-markdown) — content rendering

## Project Structure

```
app/
  api/agent/route.ts        # AI streaming chat API (auth + rate limit + fallback)
  api/review/route.ts       # AI code review API
  api/storage/route.ts      # Server-side key-value storage
  api/analytics/route.ts    # Analytics event endpoint
  lesson/[id]/page.tsx      # Lesson detail page
  dashboard/page.tsx        # Learning dashboard
  page.tsx                  # Home page
components/
  ChatInterface.tsx         # AI chat with Socratic mode
  PromptPlayground.tsx      # Code generation sandbox
  exercise/                 # Interactive code exercises
  dashboard/                # Stats, heatmap, skill radar
  gamification/             # XP bar, badge unlock, confetti
  visualizations/           # Animated flow charts, DOM tree
lib/
  lessons.ts                # 22 lesson definitions
  progress.ts               # Learning progress (Repository pattern)
  gamification.ts           # XP, levels, streaks
  achievements.ts           # 10 badges with conditions
  adaptive.ts               # Learning recommendations
  repository.ts             # Storage abstraction (localStorage / server)
  logger.ts                 # Structured JSON logging
  analytics.ts              # User behavior tracking
scripts/
  setup.sh                  # Auto setup script
  generate-icons.mjs        # PWA icon generator
```

## Customizing Lessons

Edit `lib/lessons.ts` to modify or add lessons. Content supports Markdown.

## Deployment

### Vercel (easiest)

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com/)
3. Add environment variables in project settings
4. Deploy

### Docker

```bash
docker compose up -d
```

The image uses multi-stage builds for a small footprint (~150MB).

## License

MIT

---

<div align="center">

**Language / 语言 / 言語**

[**English**](README.md) | [**简体中文**](README.zh-CN.md) | [**繁體中文**](README.zh-Hant.md) | [**日本語**](README.ja.md)

</div>
