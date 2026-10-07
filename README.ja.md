**Language:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-Hant.md) | **日本語**

# 夢夜の AI コース

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![CI](https://github.com/dreamnight16/vibe-coding-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/dreamnight16/vibe-coding-agent/actions/workflows/ci.yml)
[![オンラインで試す](https://socialistic.ai/api/embed/dreamcode-vibe-curriculum-6a796a?lang=en)](https://socialistic.ai/en/skill/dreamcode-vibe-curriculum-6a796a)

プログラマーではない大学生向けの AI 入門コースです。対象読者はエンジニアではなく、**スマホに豆包（Doubao）を入れていて、普段はそれで雑談しかしない**ような人たちです。

このコースではモデルの仕組みは扱いません。解決するのはただ一つ、AI とチャットするだけだった人が、初めて本当に一つの用事を最後までやり切れるようにすることです。課題、論文、発表、履歴書、サークル、四六級（中国の大学英語試験）。そして、いつ使うべきでないかも分かるようになります。

後の 2 つのトラックは、流れについていくためのものです。**AI エージェント**（質問して答えてもらう段階から、自分で動いて最後までやってくれる段階へ）と、**最新トレンドを追う**（推論モデル、マルチモーダル、AI 検索、動画生成、ロボット、そして本物の技術と誇大広告の見分け方）。

> 以前の「夢夜のプログラミングコース」が消えたわけではありません。10 つのうちの 1 つ、「AI プログラミング」（22 レッスン）として並んでいます。

---

## 10 つのトラック、76 レッスン

| トラック | レッスン数 | 解決すること |
|------|--------|----------|
| AI を知る | 5 | そもそも何なのか、何ができるのか、なぜ「役に立たない」と言われるのか |
| **大学での使い方** | **8** | 課題、論文、期末、サークル、発表、履歴書、四六級（中国の大学英語試験） |
| 安心して使う | 6 | ハルシネーション、事実確認、プライバシー、AI 詐欺、著作権、使わない方がよい場面 |
| 応用テクニック | 6 | プロンプトの 4 点セット、背景を伝える、先に考えさせる、資料を読ませる、ワークフロー |
| **AI エージェント** | **6** | エージェントとは何か、スマホではどれが使えるか、ツール呼び出しと MCP、自動化、失敗したときの対処 |
| **最新トレンドを追う** | **6** | 推論モデル、マルチモーダル、AI 検索とナレッジベース、動画生成、ロボット、誇大広告の見分け方 |
| コンテンツ制作 | 6 | 画像生成、ポスター、ナレーション、ショート動画、WeChat 公式アカウント、小さなツールづくり |
| インターンと仕事 | 6 | レポート、表計算の数式、スライド、議事録、職場でのコミュニケーション |
| 日常生活 | 5 | 通知、予定、翻訳、家族の通院前の整理、外出前の準備 |
| AI プログラミング | 22 | Web の基礎から公開まで、すべて自然言語で進めます |

レッスンの定義は `lib/lessons.ts`、トラックの定義は `lib/tracks.ts`、本文は `content/lessons/<id>.md` にあります。

---

## AI に依存しない 3 つの機能

ここがこのバージョンの要点です。**API Key もインターネット接続もなしで、コースを最後まで学べて、プロンプトの練習もできます。**

### プロンプト練習場 `/practice`

12 の実場面（断水のお知らせ、休暇申請、外出の段取り、宿題の手伝い、Excel 集計、週報、ポスター、情報の確認、顧客情報、さらにエージェント向けの 3 つ：調査をさせる、自動化する、外に手を出すタスクのルールを決める）。自分で書いた質問を一度入力すると、ローカルのルールエンジンがすぐに採点し、足りない要素を指摘します。

採点ロジックは `lib/prompt-coach.ts` にあり、全部で 20 個の検出項目があります。読み手、長さ、トーン、形式、背景、例、複数案、先に質問させる、勝手に作らせない、プライバシー情報、あいまいな表現……。純粋なルールなので結果は安定し、テストも付いています。

### プロンプト集 `/prompts`

そのままコピーして使える 45 個の言い回しを、9 つのカテゴリに分けました（「エージェント」のカテゴリには、まず計画を出させる、先にリスクを言わせる、自分で検収させる、繰り返す作業を手順書にする、といったものが入っています）。角括弧のプレースホルダーは、自分の状況に置き換えてください。

### AI 用語集 `/glossary`

68 個の用語を 6 つのグループに分けました。そのひとつが「新しい概念」で、ツール呼び出し、computer use、マルチエージェント、推論モデル、ワールドモデル、身体性 AI、コンテキストエンジニアリング、オンデバイスモデルといった最近出てきた言葉を扱います。それぞれに、やさしい説明、身近な例え、そして「ここで騙されやすい」というポイントを添えています。

ほかにも `/start` があります。4 つの質問に答えると、自分に合った学習順が分かります。

### 毎週のトレンドワード `/trends`

毎週月曜日に AI 界の論文・モデル・ランキングをひととおり見て、繰り返し出てくる言い方を拾い出し、リポジトリにコミットします。

**固いルールがひとつあります。クローラーに解説は書かせません。** 出力するのは「候補語 + 出現回数 + 出典リンク」だけで、ページ上にも、これらは機械が拾ったもので解説はまだ書かれていないとはっきり表示します。用語集の解説はこれまでどおり、人が書き終えてから公開します。機械が書いたものは誰も確認していないので、そのまま載せると読者を混乱させるだけだからです。

クローラーは作者の別の 2 つのリポジトリを再利用しています。

| リポジトリ | 再利用しているもの |
|------|----------|
| [chinese-scraper-utils](https://github.com/dreamnight16/chinese-scraper-utils) | Weibo/知乎/Hacker News のランキング取得、UA プール、レート制限、安定した ID。本リポジトリでは `register_scraper` を使って Hugging Face のデイリーペーパーと arXiv を同じ種類のデータソースとして登録しています |
| [weekly-hotspot](https://github.com/dreamnight16/weekly-hotspot) | 「複数ソースの取得 → 重複排除 → フィルタ → JSON + Markdown 週報の出力」というパイプラインの骨組みと、毎週の定期コミットのワークフローの書き方 |

データソースは 5 つです。Hugging Face のデイリーペーパー、arXiv cs.AI、Hacker News、Weibo の急上昇ワード、知乎のランキング。どれか 1 つが落ちても記録するだけで処理は止めず、どのソースが今回取れなかったかをレポートに明記します。

```bash
pip install -r scripts/trends/requirements.txt
python -m pytest scripts/trends -q   # 純粋関数のテスト 20 件、ネットワーク不要
python scripts/trends/crawl.py       # npm run trends でも可
```

出力は 3 つのファイルです。

- `data/trends/latest.json` —— サイトが読むファイル
- `data/trends/<YYYY-Www>.md` —— 人向けの週報。狙いは「今週は用語集にどの語を足すべきか」
- `data/trends/seen.json` —— 各語が最初に出現した週。追記のみで変更しません

---

## 機能一覧

- **76 レッスンの構造化コース**、10 つのトラック。飛ばして学んでも、順番に進んでもかまいません
- **22 個の章末クイズ**。「使いこなせるか」を問い、用語の暗記は問いません
- **オフライン練習場**。純粋なルールベースのフィードバックで、設定は不要です
- **プロンプト集 + 用語集**。検索もコピーもできます
- **毎週のトレンドワード**（`/trends`）：毎週 1 回 AI 界の新しい言い方を自動で集め、候補語と出典だけを載せ、機械が書いた解説は載せません
- **学習ガイド**。4 つの質問で起点を提案します
- **ゲーミフィケーション**：XP、レベル、連続日数、14 個のバッジ（今は本当に解除されます）
- **学習ダッシュボード**：進捗、ヒートマップ、能力レーダー
- **任意の学習アシスタント**：Claude、OpenAI、DeepSeek など OpenAI 互換 API に対応し、バックアップモデルも使えます
- **PWA**：インストールでき、コースと練習はオフラインでも使えます

---

## クイックスタート

```bash
npm install
cp .env.example .env   # 設定しなくても動きます。学習アシスタントは「利用不可」と表示されます
npm run dev
```

http://localhost:3000 を開きます。

> コマンドラインに触りたくない人は、オンライン版をそのまま使ってください：https://learn.dreamnight.net.cn

### Docker

```bash
docker compose up -d
```

---

## オプション：学習アシスタントの接続

コース、練習、クイズ、プロンプト集、用語集に API Key は必要ありません。必要なのはページ下部の「学習アシスタント」だけです。

```env
AI_PROVIDER=openai-compatible
AI_MODEL=deepseek-chat
AI_API_KEY=sk-...
AI_BASE_URL=https://api.deepseek.com/v1
```

バックアップモデル、認証トークン、レート制限などのオプションは `.env.example` を参照してください。

---

## 開発

```bash
npm run dev      # 開発サーバー
npm test         # ユニットテスト
npm run lint     # ESLint
npm run build    # 本番ビルド
```

### 主要なディレクトリ

```
app/
  page.tsx                  トップ：トラックカード + 全レッスン一覧
  lesson/[id]/page.tsx      レッスンページ（本文 + 練習 + クイズ + 任意のアシスタント）
  prompts/                  プロンプト集
  practice/                 プロンプト練習場
  glossary/                 用語集
  start/                    4 つの質問で進路を選ぶガイド
  trends/                   毎週のトレンドワード（data/trends/latest.json を読み込みます）
components/
  practice/PromptLab.tsx    練習場のインタラクション
  prompts/PromptLibrary.tsx プロンプト集のインタラクション
  glossary/                 用語集のインタラクション
  StartWizard.tsx           進路選択ガイド
lib/
  tracks.ts                 10 つのトラック
  lessons.ts                76 レッスンの一覧
  prompt-coach.ts           オフラインのプロンプト採点エンジン
  prompt-library.ts         45 個のプロンプト、9 カテゴリ
  glossary.ts               68 個の用語、6 グループ
  practice-scenarios.ts     練習場のシナリオ
  quiz-data.ts              旧クイズ + 新トラックのクイズのまとめ
  quiz-data-ai.ts           新トラックのクイズ 20 個
  achievements.ts           14 個のバッジ
  adaptive.ts               学習の提案
  progress.ts               学習の進捗（schema v3）
  trends.ts                 毎週のトレンドワード レポートの読み込みと検証
scripts/trends/             トレンドワードのクローラー（Python）
  crawl.py                  エントリーポイント
  sources.py                5 つのデータソース。chinese-scraper-utils を再利用
  keywords.py               タイトルが AI と関係あるかを判定
  terms.py                  候補語の抽出、ウォッチリストの管理、用語集との突き合わせ
content/lessons/            76 本のレッスン本文
data/trends/                毎週のトレンドワードの出力（定期ジョブがコミット）
```

### レッスンを 1 つ追加する

1. `content/lessons/` の下に `<id>.md` を作成します（H1 は書かないでください。タイトルはページが描画します）
2. `lib/lessons.ts` に 1 行追加します
3. `npm test` を実行します。`lib/__tests__/curriculum.test.ts` が、各レッスンに本文があるか、前提レッスンが存在するか、トラックが有効かを確認します

---

## 技術スタック

**サイト**：Next.js 16 + React 19 + TypeScript（strict）· Tailwind CSS v4 · AI SDK（マルチモデル）· Vitest · lucide-react · react-markdown

**クローラー**：Python 3.11+ · chinese-scraper-utils · httpx · pytest。Python が必要なのは `scripts/trends` を動かすときだけで、サイト自体には不要です。

## デプロイ

GitHub にプッシュして Vercel でインポートするだけです。環境変数は任意です。`docker compose up -d` でもかまいません。

## License

MIT

---

<div align="center">

**Language / 語言 / 言語**

[**English**](README.md) | [**简体中文**](README.zh-CN.md) | [**繁體中文**](README.zh-Hant.md) | [**日本語**](README.ja.md)

</div>
