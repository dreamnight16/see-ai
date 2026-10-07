import type { NextConfig } from "next";

/**
 * output: "standalone" 是给自托管和 Docker 用的：它会把产物整理成
 * .next/standalone，Dockerfile 就是拷这个目录。
 *
 * 但 Vercel 自己负责产物布局，不需要也不该开这个开关——开了之后
 * 构建会在收尾阶段报错：
 *   Error: ENOENT: no such file or directory,
 *   open '/vercel/path0/.next/next-server.js.nft.json'
 * （页面其实都生成完了，是 Vercel 的 onBuildComplete 和 Next 的
 *  standalone 收尾步骤抢着处理 .next 导致的。）
 *
 * Vercel 的构建环境里 VERCEL=1，所以按这个来区分。
 */
const nextConfig: NextConfig = {
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
};

export default nextConfig;
