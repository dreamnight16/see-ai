"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-[var(--see-shell)] px-[var(--see-gutter)] py-[var(--see-section)]">
      <div className="grid gap-[3px] lg:grid-cols-12">
        <section className="bg-crimson p-6 text-on-color sm:p-10 lg:col-span-5">
          <AlertTriangle className="h-9 w-9" aria-hidden="true" />
          <h1 className="font-display mt-8 text-[clamp(2rem,4vw,2.75rem)] leading-tight">
            出了点问题
          </h1>
          <p className="mt-4 max-w-[42ch] text-sm leading-relaxed">
            页面加载时发生了一点意外。你可以重试，或者回首页继续浏览。
            课程正文、练习和进度都存在本地，不会因为这个错误丢掉。
          </p>
        </section>

        <section className="card p-6 sm:p-8 lg:col-span-7">
          <h2 className="see-kicker text-text-secondary">错误信息</h2>
          <p className="mt-3 break-all font-mono text-sm leading-relaxed text-text-primary">
            {error.message || "未知错误"}
          </p>
          {error.digest && (
            <p className="mt-4 border-t border-edge pt-4 font-mono text-xs text-text-secondary">
              错误编号：{error.digest}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="dn-focus dn-interactive inline-flex min-h-[48px] items-center gap-2 bg-teal px-6 text-sm font-semibold text-on-color"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              重试
            </button>
            <Link
              href="/"
              className="dn-focus inline-flex min-h-[48px] items-center gap-2 border border-edge-strong px-6 text-sm font-semibold text-text-primary hover:bg-surface-alt"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              返回课程表
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
