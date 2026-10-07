**Language:** [English](README.md) | [简体中文](README.zh-CN.md) | **繁體中文** | [日本語](README.ja.md)

# 夢夜的 AI 課

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![CI](https://github.com/dreamnight16/see-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/dreamnight16/see-ai/actions/workflows/ci.yml)
[![線上體驗](https://socialistic.ai/api/embed/dreamcode-vibe-curriculum-6a796a?lang=en)](https://socialistic.ai/en/skill/dreamcode-vibe-curriculum-6a796a)

一套面向非專業大學生的 AI 入門課。目標讀者不是程式設計師，而是**手機裡裝著豆包、平常只會拿它閒聊**的那批人。

整套課不講模型原理。它只解決一件事：讓只會跟 AI 聊天的人，第一次真正用它把一件正事做完——作業、論文、簡報、履歷、社團、四六級，然後知道什麼時候不該用它。

後兩條軌道專門用來跟上節奏：**AI 智慧代理**（從你問它答，到它自己動手做完）和**跟上浪潮**（推理模型、多模態、AI 搜尋、影片生成、機器人，以及怎麼分辨真技術和炒作）。

> 原來的「夢夜的程式課」沒有消失，它變成了其中一條軌道（AI 程式設計，22 節課），和另外九條並列。

---

## 十條軌道，76 節課

| 軌道 | 課程數 | 解決什麼 |
|------|--------|----------|
| 認識 AI | 5 | 它到底是什麼、能做什麼、為什麼有人說它沒用 |
| **在大學裡怎麼用** | **8** | 作業、論文、期末、社團、簡報、履歷、四六級 |
| 用得可靠 | 6 | 幻覺、查證、隱私、AI 詐騙、版權、什麼時候不該用 |
| 進階技巧 | 6 | 提示詞四件套、給背景、先想再答、餵資料、工作流程 |
| **AI 智慧代理** | **6** | 代理是什麼、手機裡哪個能用、工具呼叫與 MCP、自動化、它出錯時怎麼辦 |
| **跟上浪潮** | **6** | 推理模型、多模態、AI 搜尋與知識庫、影片生成、機器人、怎麼分辨炒作 |
| 內容創作 | 6 | 畫圖、海報、配音、短影音、公眾號、做小工具 |
| 實習和辦公 | 6 | 報告、試算表公式、PPT、會議紀錄、職場溝通 |
| 日常生活 | 5 | 通知、行程、翻譯、陪家人看診前整理、出門前的準備 |
| AI 程式設計 | 22 | 從網頁基礎到發布上線，全程用自然語言推進 |

課程表定義在 `lib/lessons.ts`，軌道定義在 `lib/tracks.ts`，正文是 `content/lessons/<id>.md`。

---

## 三個不依賴 AI 的功能

這是這一版的重點：**沒有 API Key、不連網，也能把課學完、把提示詞練會。**

### 提示詞練習場 `/practice`

十二個真實場景（停水通知、請假、行程安排、輔導作業、Excel 彙總、週報、海報、查核說法、客戶資料，以及三個代理場景：做調研、做自動化、替會對外動手的任務訂規矩）。你寫一遍自己的提問，本地規則引擎立刻評分，並指出漏了哪幾樣。

打分邏輯在 `lib/prompt-coach.ts`，一共二十條探測器：受眾、長度、語氣、格式、背景、例子、多版本、讓它先問你、要求它別亂編、隱私資料、含糊用詞……純規則，結果穩定，有測試盯著。

### 提示詞庫 `/prompts`

45 條可以直接複製去用的話術，九個分類（含「代理」一類：讓它先給計畫、把醜話說在前面、讓它自己驗收、把重複的活寫成說明書）。帶方括號佔位的地方換成你自己的情況。

### AI 名詞表 `/glossary`

68 個術語，分成六組，其中一組是「新潮概念」——工具呼叫、computer use、多代理、推理模型、世界模型、具身智慧、上下文工程、端側模型這些最近才冒出來的說法，每個都配白話解釋、一個生活裡的比喻，和一處容易被話術誤導的地方。

另外還有 `/start`：四道題幫你排出適合自己的學習順序。

### 每週熱詞 `/trends`

每週一自動掃一遍 AI 圈的論文、模型和熱榜，把反覆出現的說法挑出來，提交回倉庫。

**一條硬規矩：爬蟲不許寫解釋。** 它只產出「候選詞 + 出現次數 + 出處連結」，頁面上明確標著這些都是機器抓的、還沒寫解釋。名詞表裡的每一條解釋仍然由人寫完再上線——機器寫的東西沒人核對過，放上去就是給讀者添亂。

爬蟲復用了作者另外兩個倉庫：

| 倉庫 | 復用什麼 |
|------|----------|
| [chinese-scraper-utils](https://github.com/dreamnight16/chinese-scraper-utils) | 微博/知乎/Hacker News 熱榜抓取、UA 池、限速、穩定 ID；本倉庫用它的 `register_scraper` 把 Hugging Face 每日論文和 arXiv 註冊成同一種資料來源 |
| [weekly-hotspot](https://github.com/dreamnight16/weekly-hotspot) | 「多源抓取 → 去重 → 過濾 → 輸出 JSON + Markdown 週報」這條流水線的骨架，以及每週定時提交的工作流寫法 |

資料來源五個：Hugging Face 每日論文、arXiv cs.AI、Hacker News、微博熱搜、知乎熱榜。任何一個來源掛掉都只記錄不中斷，報告裡會寫清哪幾個來源這輪沒抓到。

```bash
pip install -r scripts/trends/requirements.txt
python -m pytest scripts/trends -q   # 20 個純函式測試，不連網
python scripts/trends/crawl.py       # 也可以 npm run trends
```

輸出三個檔案：

- `data/trends/latest.json` —— 網站讀的那個
- `data/trends/<YYYY-Www>.md` —— 給人看的週報，重點是「這週該給名詞表補哪幾個詞」
- `data/trends/seen.json` —— 每個詞第一次出現的週次，只增不改

---

## 功能一覽

- **76 節結構化課程**，10 條軌道，可跳著學，也可以按順序走
- **22 個章節測驗**，考「會不會用」，不考名詞背誦
- **離線練習場**，純規則回饋，不需要任何設定
- **提示詞庫 + 名詞表**，可搜尋、可複製
- **每週熱詞**（`/trends`）：每週自動抓一次 AI 圈的新說法，只放候選詞和出處，不放機器寫的解釋
- **學習嚮導**，四道題推薦起點
- **遊戲化**：XP、等級、連續天數、14 個徽章（現在真的會解鎖了）
- **學習儀表板**：進度、熱力圖、能力雷達
- **選用學習助手**：Claude、OpenAI、DeepSeek 等 OpenAI 相容介面，支援備用模型
- **PWA**：可安裝，課程與練習離線可用

---

## 快速開始

```bash
npm install
cp .env.example .env   # 不設定也能跑，學習助手會顯示為無法使用
npm run dev
```

打開 http://localhost:3000。

> 完全不想碰命令列的同學，直接用線上版：https://learn.dreamnight.net.cn

### Docker

```bash
docker compose up -d
```

---

## 選用：接入學習助手

課程、練習、測驗、提示詞庫、名詞表都不需要 API Key。只有頁面底部的「學習助手」需要：

```env
AI_PROVIDER=openai-compatible
AI_MODEL=deepseek-chat
AI_API_KEY=sk-...
AI_BASE_URL=https://api.deepseek.com/v1
```

備用模型、驗證權杖、流量限制等選項見 `.env.example`。

---

## 開發

```bash
npm run dev      # 開發伺服器
npm test         # 單元測試
npm run lint     # ESLint
npm run build    # 正式環境建置
```

### 關鍵目錄

```
app/
  page.tsx                  首頁：軌道卡片 + 完整課程表
  lesson/[id]/page.tsx      課程頁（正文 + 練習 + 測驗 + 選用助手）
  prompts/                  提示詞庫
  practice/                 提示詞練習場
  glossary/                 名詞表
  start/                    四道題的選路嚮導
  trends/                   每週熱詞（讀 data/trends/latest.json）
components/
  practice/PromptLab.tsx    練習場互動
  prompts/PromptLibrary.tsx 提示詞庫互動
  glossary/                 名詞表互動
  StartWizard.tsx           選路嚮導
lib/
  tracks.ts                 十條軌道
  lessons.ts                76 節課的課程表
  prompt-coach.ts           離線提示詞評分引擎
  prompt-library.ts         45 條提示詞，9 個分類
  glossary.ts               68 個術語，6 個分組
  practice-scenarios.ts     練習場場景
  quiz-data.ts              舊測驗 + 新軌道測驗彙總
  quiz-data-ai.ts           20 個新軌道測驗
  achievements.ts           14 個徽章
  adaptive.ts               學習建議
  progress.ts               學習進度（schema v3）
  trends.ts                 每週熱詞報告的讀取與驗證
scripts/trends/             熱詞爬蟲（Python）
  crawl.py                  入口
  sources.py                五個資料來源，復用 chinese-scraper-utils
  keywords.py               判斷一條標題跟 AI 有沒有關係
  terms.py                  抽候選詞、盯關注清單、跟名詞表對帳
content/lessons/            76 篇課程正文
data/trends/                每週熱詞的產出（由定時任務提交）
```

### 加一節課

1. 在 `content/lessons/` 下寫 `<id>.md`（不要寫 H1，頁面會渲染標題）
2. 在 `lib/lessons.ts` 裡加一行
3. 跑 `npm test` —— `lib/__tests__/curriculum.test.ts` 會檢查每一課都有正文、前置課程存在、軌道有效

---

## 技術棧

**網站**：Next.js 16 + React 19 + TypeScript（strict）· Tailwind CSS v4 · AI SDK（多模型）· Vitest · lucide-react · react-markdown

**爬蟲**：Python 3.11+ · chinese-scraper-utils · httpx · pytest。只在跑 `scripts/trends` 時才需要 Python，網站本身不需要。

## 部署

推送到 GitHub 後在 Vercel 匯入即可，環境變數可選。也可以 `docker compose up -d`。

## License

MIT

---

<div align="center">

**Language / 語言 / 言語**

[**English**](README.md) | [**简体中文**](README.zh-CN.md) | [**繁體中文**](README.zh-Hant.md) | [**日本語**](README.ja.md)

</div>
