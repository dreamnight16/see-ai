**語言 / Language:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-Hant.md) | [日本語](README.ja.md)

# Vibe Coding 入門課

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![CI](https://github.com/dreamnight16/vibe-coding-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/dreamnight16/vibe-coding-agent/actions/workflows/ci.yml)
[![線上體驗](https://socialistic.ai/api/embed/dreamcode-vibe-curriculum-6a796a?lang=zh)](https://socialistic.ai/zh/skill/dreamcode-vibe-curriculum-6a796a)

一個邊學邊做的網頁製作互動課程。22 節課分成 7 個章節，配有本地練習和進度記錄；遇到卡點時，也可以叫一個選用的小助手過來一起捋一捋。

---

## 功能

- **22 節系統化課程** — 7 個章節從概念到發布
- **可選學習助手** — 蘇格拉底引導模式 + 直接回答模式，串流回應
- **Prompt Playground** — 描述一個小想法，設定模型後生成可執行的 HTML/CSS/JS
- **遊戲化系統** — 經驗值、等級、連續學習天數、10 種成就徽章
- **程式碼練習** — 互動式練習，附提示與自動檢查
- **學習儀表板** — 進度追蹤、熱力圖、技能雷達圖
- **PWA 支援** — 可安裝到桌面，支援離線使用
- **服務商可選** — Claude、OpenAI、DeepSeek 及其他 OpenAI 相容介面
- **備用線路** — 主服務沒接通時嘗試備用服務
- **核心流程離線可用** — 課程、練習、測驗、進度和作品保存不依賴 API Key 或網路

## 線上體驗

無需安裝、無需設定 API Key——打開連結就能開始學習；AI 輔助是選用功能：

[![在 Socialistic 上體驗](https://socialistic.ai/api/embed/dreamcode-vibe-curriculum-6a796a?lang=zh)](https://socialistic.ai/zh/skill/dreamcode-vibe-curriculum-6a796a)

> 線上入口由 [@shesonglin](https://github.com/shesl-tinkerland) 貢獻。  
> 官方站點：[learn.dreamnight.net.cn](https://learn.dreamnight.net.cn)

## 快速開始

### 自動設定（推薦）

```bash
bash scripts/setup.sh
```

### 手動

```bash
npm install
cp .env.example .env
# 編輯 .env，填入 API Key
npm run dev
```

打開 http://localhost:3000 開始學習。

> 詳細的零基礎設定指南：[SETUP_GUIDE.md](./SETUP_GUIDE.md)

### Docker

```bash
docker compose up -d
```

## 設定

### 選用：學習助手

不設定 AI 也可以啟動並完成課程。只有需要學習助手、程式碼生成或程式碼審閱時，才需要填寫以下設定：

```env
# 可選認證；設定後所有 AI 請求都須攜帶 Bearer 金鑰
AI_API_AUTH_TOKEN=

# 主 AI 服務商
AI_PROVIDER=openai-compatible
AI_MODEL=deepseek-chat
AI_API_KEY=sk-...
AI_BASE_URL=https://api.deepseek.com/v1
```

### 選用：備用模型服務

主服務商故障時自動切換：

```env
AI_FALLBACK_PROVIDER=openai
AI_FALLBACK_MODEL=gpt-4o-mini
AI_FALLBACK_API_KEY=sk-...
AI_FALLBACK_BASE_URL=https://api.openai.com/v1
```

完整設定參見 `.env.example`。

## 開發

```bash
npm install
npm run dev      # 啟動開發伺服器
npm test         # 執行測試（46 個測試，4 個套件）
npm run build    # 生產建置
```

## 技術棧

- [Next.js](https://nextjs.org/) 16 + React 19 + TypeScript（strict 模式）
- [Tailwind CSS](https://tailwindcss.com/) v4
- [AI SDK](https://sdk.vercel.ai/) — 統一多模型介面
- [Vitest](https://vitest.dev/) — 單元測試（目標 80%+ 覆蓋率）
- [Lucide React](https://lucide.dev/) — 圖示
- [react-markdown](https://github.com/remarkjs/react-markdown) — 渲染課程內容

## 專案結構

```
app/
  api/agent/route.ts        # AI 對話串流介面（認證 + 限流 + 降級）
  api/review/route.ts       # AI 程式碼審閱介面
  api/storage/route.ts      # 伺服器端鍵值儲存
  api/analytics/route.ts    # 資料分析端點
  lesson/[id]/page.tsx      # 課程詳情頁
  dashboard/page.tsx        # 學習儀表板
  page.tsx                  # 首頁
components/
  ChatInterface.tsx         # AI 聊天元件
  PromptPlayground.tsx      # 程式碼生成練習區
  exercise/                 # 互動程式碼練習
  dashboard/                # 統計、熱力圖、技能雷達
  gamification/             # 經驗條、徽章解鎖、彩帶特效
  visualizations/           # 動畫流程圖、DOM 樹
lib/
  lessons.ts                # 22 節課定義
  progress.ts               # 學習進度（Repository 模式）
  gamification.ts           # 經驗值、等級、連續學習
  achievements.ts           # 10 種成就徽章
  adaptive.ts               # 學習推薦引擎
  repository.ts             # 儲存抽象層（localStorage / 伺服器端）
  logger.ts                 # 結構化日誌
  analytics.ts              # 使用者行為追蹤
scripts/
  setup.sh                  # 自動設定指令碼
  generate-icons.mjs        # PWA 圖示產生器
```

## 自訂課程

編輯 `lib/lessons.ts` 即可修改或新增課程內容，支援 Markdown 格式。

## 部署

### Vercel（推薦）

1. 推送程式碼到 GitHub
2. 在 [vercel.com](https://vercel.com/) 匯入倉庫
3. 在專案設定中新增環境變數
4. 點擊部署

### Docker

```bash
docker compose up -d
```

使用多階段建置，映像檔約 150MB。

## 相關專案

- [Blog-mizuki](https://github.com/dreamnight16/Blog-mizuki) — 作者個人部落格，更多 Vibe Coding 相關文章

## License

MIT

---

<div align="center">

**Language / 語言 / 言語**

[**English**](README.md) | [**简体中文**](README.zh-CN.md) | [**繁體中文**](README.zh-Hant.md) | [**日本語**](README.ja.md)

</div>
