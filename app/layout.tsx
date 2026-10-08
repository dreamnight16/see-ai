import type { Metadata, Viewport } from "next";
import { Noto_Sans_SC, JetBrains_Mono } from "next/font/google";
import AppShell from "./app-shell";
import "./globals.css";

/**
 * 字体策略（DNDL §4.1）：
 * DNDL 的字体栈以设备自带的 Segoe UI / PingFang SC / HarmonyOS Sans SC /
 * Microsoft YaHei 为首选，回退链里挂上自托管的 Noto Sans SC，
 * 不依赖运行时联网下载字体。
 *
 * 原来还加载了 Noto Serif SC 作为 --font-serif，但 DNDL 的 Display 字重
 * 是 300 的无衬线体，项目里也没有任何地方用到衬线族，故移除该字体文件。
 */
const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "见 AI",
  description:
    "面向非专业大学生的 AI 入门课：作业、论文、汇报、简历、四六级怎么用 AI，以及什么时候不该用。不配 API Key 也能学。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "见 AI",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  // DNDL Canvas
  themeColor: "#F9FBFA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* eslint-disable @next/next/no-css-tags --
       这三个文件是逐字节取自 DNDL 上游的静态资源（见 public/vendor/dndl/VERSION），
       必须以独立样式表原样加载，不能被打包改写，因此这里手写 <link>。 */
    <html
      lang="zh-CN"
      className={`${notoSansSC.variable} ${jetbrainsMono.variable} antialiased`}
    >
      {/* DNDL 以确定版本引入，保留 tokens → materials → motion 的同级关系。 */}
      <link rel="stylesheet" href="/vendor/dndl/tokens.css" precedence="dndl" />
      <link rel="stylesheet" href="/vendor/dndl/materials.css" precedence="dndl" />
      <link rel="stylesheet" href="/vendor/dndl/motion.css" precedence="dndl" />
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
