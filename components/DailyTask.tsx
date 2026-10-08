"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { promptTemplates } from "@/lib/prompt-library";
import { practiceScenarios } from "@/lib/practice-scenarios";
import CopyButton from "@/components/CopyButton";

/**
 * 每天换一条的"今天就试这一件"。
 * 用日期做下标而不是随机数，这样同一天刷新页面看到的是同一条，
 * 服务端和客户端渲染也不会打架。
 */
function pickIndexForToday(length: number): number {
  if (length <= 0) return 0;
  const now = new Date();
  const days = Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000,
  );
  return days % length;
}

// 这个"外部状态"就是日历，不需要订阅任何东西
const subscribeToNothing = () => () => {};

export default function DailyTask() {
  // 首页是静态预渲染的，直接渲染"当天那一条"会让水合前后对不上
  // （构建那天的日期和访问那天的日期经常不是同一天）。
  // useSyncExternalStore 正好解决这件事：水合阶段用服务端快照（第 0 条），
  // 水合完成后自动切到客户端快照（当天那一条），不需要在 effect 里 setState。
  const index = useSyncExternalStore(
    subscribeToNothing,
    () => pickIndexForToday(promptTemplates.length),
    () => 0,
  );

  const template = promptTemplates[index];
  if (!template) return null;
  const scenario = practiceScenarios[index % practiceScenarios.length];

  return (
    <section className="card flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center bg-amber text-on-color">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-lg leading-tight">今天就试这一件</h2>
          <p className="text-xs text-text-secondary">
            每天换一条。看完就去发一次，比多看三节课管用。
          </p>
        </div>
      </div>

      <div className="mt-5 border border-edge">
        <div className="flex items-start justify-between gap-3 border-b border-edge bg-surface-alt px-4 py-3">
          <div className="min-w-0">
            <h3 className="font-display text-base leading-tight">{template.title}</h3>
            <p className="mt-1 text-xs text-text-secondary">{template.scene}</p>
          </div>
          <CopyButton text={template.prompt} label="复制这段" compact />
        </div>

        <pre className="whitespace-pre-wrap bg-surface p-4 font-sans text-[13px] leading-relaxed text-text-primary">
          {template.prompt}
        </pre>

        {template.tip && (
          <p className="border-t border-edge bg-amber-tint px-4 py-3 text-xs leading-relaxed text-text-primary">
            <span className="font-semibold">拿到结果之后：</span>
            {template.tip}
          </p>
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4">
        <p className="text-xs text-text-secondary">
          复制到豆包、DeepSeek、Kimi 里都行，换成你自己的情况再发。
        </p>
        {scenario && (
          <Link
            href="/practice"
            className="dn-focus see-link ml-auto inline-flex min-h-[44px] items-center gap-1.5 text-xs font-semibold"
          >
            想先练一遍？去练习场
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
}
