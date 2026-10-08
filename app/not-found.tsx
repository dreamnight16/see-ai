import Link from "next/link";
import { Compass, Home, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[var(--see-shell)] px-[var(--see-gutter)] py-[var(--see-section)]">
      <div className="grid gap-[3px] lg:grid-cols-12">
        <section className="bg-teal p-6 text-on-color sm:p-10 lg:col-span-5">
          <p className="font-display text-[5rem] leading-none tabular-nums">404</p>
          <h1 className="font-display mt-4 text-[clamp(1.75rem,3.4vw,2.5rem)] leading-tight">
            这个页面不存在
          </h1>
          <p className="mt-4 max-w-[42ch] text-sm leading-relaxed">
            地址可能拼错了，也可能是课程调整过编号。课程表里所有课都还在。
          </p>
        </section>

        <section className="card flex flex-col justify-center gap-3 p-6 sm:p-8 lg:col-span-7">
          <Link
            href="/"
            className="dn-focus dn-interactive inline-flex min-h-[52px] items-center gap-2 bg-teal px-6 text-sm font-semibold text-on-color"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            回课程表
          </Link>
          <Link
            href="/start"
            className="dn-focus inline-flex min-h-[52px] items-center gap-2 border border-edge-strong px-6 text-sm font-semibold text-text-primary hover:bg-surface-alt"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            我该从哪开始
          </Link>
          <Link
            href="/lesson/ai-1-1"
            className="dn-focus inline-flex min-h-[52px] items-center gap-2 border border-edge-strong px-6 text-sm font-semibold text-text-primary hover:bg-surface-alt"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            从第一课开始
          </Link>
        </section>
      </div>
    </main>
  );
}
