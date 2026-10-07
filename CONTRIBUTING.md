# Contributing to DreamCode · 梦夜的 AI 课

一套面向非专业大学生的 AI 入门课。课程正文、练习场、提示词库、名词表和热词爬虫都欢迎贡献。

Thanks for your interest in contributing!

## Getting Started

```bash
git clone https://github.com/dreamnight16/see-ai.git
cd see-ai
npm install
cp .env.example .env   # 可选：只在要用页面底部的学习助手时才需要填
npm run dev
```

## Development Workflow

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `npx tsc --noEmit` to type-check
4. Run `npm run lint` (CI runs it, so a lint error will fail the build)
5. Run `npm test` for TypeScript tests；改到 `scripts/trends/` 时还要跑 `python -m pytest scripts/trends -q`
6. Run `npm run build` to verify the build
7. Add tests for new functionality
8. Commit using [Conventional Commits][conv] format
9. Push and open a pull request

## Commit Convention

```
feat: add lesson on prompt engineering
fix: sanitize user input in quiz answers
refactor: extract rate limiter into middleware
test: add unit tests for quiz scoring
docs: update SETUP_GUIDE with new provider
```

Types: `feat` `fix` `refactor` `test` `docs` `chore` `perf` `ci`

## Code Style

- TypeScript strict mode enabled
- Next.js App Router conventions
- Components in `components/`, hooks in `hooks/`, lib in `lib/`
- Functions under 50 lines; files under 800 lines
- Use Tailwind CSS for styling

## Adding a Lesson

1. 在 `content/lessons/` 下新建 `<id>.md`。不要写 H1——页面会渲染标题，正文从 `## 这节课你会...` 开始
2. 在 `lib/lessons.ts` 的课程表里加一条，指定 `track`、`module`、`takeaway` 和 `prerequisites`
3. 跑 `npm test`——`lib/__tests__/curriculum.test.ts` 会检查每一课都有正文文件、前置课程存在、轨道有效、没有 H1
4. 如果这一课改变了学习顺序，同步更新 README 里的轨道表

## Pull Request Checklist

- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes；动过爬虫的话 `python -m pytest scripts/trends -q` 也要过
- [ ] Build succeeds (`npm run build`)
- [ ] New tests added for new behavior
- [ ] `.env.example` updated if new env vars needed
- [ ] Content changes reviewed for accuracy

## Questions?

Open a [discussion](https://github.com/dreamnight16/see-ai/discussions).

[conv]: https://www.conventionalcommits.org/
