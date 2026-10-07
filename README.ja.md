**言語 / Language:** [English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-Hant.md) | [日本語](README.ja.md)

# Vibe Coding 入門コース

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![CI](https://github.com/dreamnight16/vibe-coding-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/dreamnight16/vibe-coding-agent/actions/workflows/ci.yml)
[![オンラインで試す](https://socialistic.ai/api/embed/dreamcode-vibe-curriculum-6a796a?lang=ja)](https://socialistic.ai/ja/skill/dreamcode-vibe-curriculum-6a796a)

作りながらウェブ制作を学ぶインタラクティブな学習サイトです。7 章 22 レッスン、ローカル演習、進捗管理があり、つまずいた時だけ使える小さな補助も用意しています。

---

## 機能

- **22 の体系的なレッスン** — 概念から公開までの 7 章構成
- **オプションの学習アシスタント** — ソクラテス式誘導モード + 直接回答モード、ストリーミング応答
- **Prompt Playground** — 小さなアイデアを説明すると、設定したモデルで実行可能な HTML/CSS/JS を生成
- **ゲーミフィケーション** — XP、レベル、連続学習日数、10 種類の達成バッジ
- **コード演習** — ヒントと自動チェック付きのインタラクティブ演習
- **学習ダッシュボード** — 進捗追跡、ヒートマップ、スキルレーダー
- **PWA 対応** — インストール可能、オフライン動作対応
- **プロバイダー選択** — Claude、OpenAI、DeepSeek、その他の OpenAI 互換インターフェース
- **バックアップ経路** — メインサービスにつながらない時は別の設定を試行
- **オフライン対応のコア** — レッスン、演習、クイズ、進捗、作品保存は API Key やネットワーク不要

## オンラインで試す

インストール不要・API Key 不要——リンクを開くだけですぐに学習を始められます。AI 補助はオプションです：

[![Socialistic で試す](https://socialistic.ai/api/embed/dreamcode-vibe-curriculum-6a796a?lang=ja)](https://socialistic.ai/ja/skill/dreamcode-vibe-curriculum-6a796a)

> オンライン入口は [@shesonglin](https://github.com/shesl-tinkerland) による提供です。  
> 公式サイト：[learn.dreamnight.net.cn](https://learn.dreamnight.net.cn)

## クイックスタート

### 自動セットアップ（推奨）

```bash
bash scripts/setup.sh
```

### 手動セットアップ

```bash
npm install
cp .env.example .env
# .env を編集して API Key を入力
npm run dev
```

http://localhost:3000 にアクセスして学習を開始してください。

> 初心者向け詳細セットアップガイド：[SETUP_GUIDE.md](./SETUP_GUIDE.md)

### Docker

```bash
docker compose up -d
```

## 設定

### オプション：学習ヘルパー

AI を設定しなくてもコースを開始できます。アシスタント、コード生成、コードレビューを使う場合だけ以下を設定してください。

```env
# 任意の認証設定。有効にすると全AIリクエストにBearerトークンが必要
AI_API_AUTH_TOKEN=

# メイン AI プロバイダー
AI_PROVIDER=openai-compatible
AI_MODEL=deepseek-chat
AI_API_KEY=sk-...
AI_BASE_URL=https://api.deepseek.com/v1
```

### オプション：バックアップモデルサービス

メインプロバイダー障害時に自動切替：

```env
AI_FALLBACK_PROVIDER=openai
AI_FALLBACK_MODEL=gpt-4o-mini
AI_FALLBACK_API_KEY=sk-...
AI_FALLBACK_BASE_URL=https://api.openai.com/v1
```

全設定は `.env.example` を参照してください。

## 開発

```bash
npm install
npm run dev      # 開発サーバー起動
npm test         # テスト実行（46 テスト、4 スイート）
npm run build    # プロダクションビルド
```

## 技術スタック

- [Next.js](https://nextjs.org/) 16 + React 19 + TypeScript（strict モード）
- [Tailwind CSS](https://tailwindcss.com/) v4
- [AI SDK](https://sdk.vercel.ai/) — 統一マルチモデルインターフェース
- [Vitest](https://vitest.dev/) — ユニットテスト（目標 80%+ カバレッジ）
- [Lucide React](https://lucide.dev/) — アイコン
- [react-markdown](https://github.com/remarkjs/react-markdown) — コンテンツレンダリング

## プロジェクト構造

```
app/
  api/agent/route.ts        # AI 会話ストリーミング API（認証 + レート制限 + フォールバック）
  api/review/route.ts       # AI コードレビュー API
  api/storage/route.ts      # サーバーサイド key-value ストレージ
  api/analytics/route.ts    # 分析イベントエンドポイント
  lesson/[id]/page.tsx      # レッスン詳細ページ
  dashboard/page.tsx        # 学習ダッシュボード
  page.tsx                  # トップページ
components/
  ChatInterface.tsx         # AI チャットコンポーネント
  PromptPlayground.tsx      # コード生成サンドボックス
  exercise/                 # インタラクティブコード演習
  dashboard/                # 統計、ヒートマップ、スキルレーダー
  gamification/             # XP バー、バッジ解除、紙吹雪エフェクト
  visualizations/           # アニメーションフローチャート、DOM ツリー
lib/
  lessons.ts                # 22 レッスン定義
  progress.ts               # 学習進捗（Repository パターン）
  gamification.ts           # XP、レベル、連続学習
  achievements.ts           # 10 種類の達成バッジ
  adaptive.ts               # 学習レコメンデーションエンジン
  repository.ts             # ストレージ抽象化（localStorage / サーバー）
  logger.ts                 # 構造化ログ
  analytics.ts              # ユーザー行動トラッキング
scripts/
  setup.sh                  # 自動セットアップスクリプト
  generate-icons.mjs        # PWA アイコンジェネレーター
```

## カスタムレッスン

`lib/lessons.ts` を編集するとレッスン内容の修正や追加が可能です。Markdown 形式に対応しています。

## デプロイ

### Vercel（最も簡単）

1. GitHub にプッシュ
2. [vercel.com](https://vercel.com/) でリポジトリをインポート
3. プロジェクト設定で環境変数を追加
4. デプロイ

### Docker

```bash
docker compose up -d
```

マルチステージビルドにより、イメージは約 150MB です。

## 関連プロジェクト

- [Blog-mizuki](https://github.com/dreamnight16/Blog-mizuki) — 著者の個人ブログ、Vibe Coding に関する記事多数

## License

MIT

---

<div align="center">

**Language / 語言 / 言語**

[**English**](README.md) | [**简体中文**](README.zh-CN.md) | [**繁體中文**](README.zh-Hant.md) | [**日本語**](README.ja.md)

</div>
