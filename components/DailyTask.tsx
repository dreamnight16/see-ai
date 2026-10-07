"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CalendarDays } from "lucide-react";
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
    <div className="card p-6 md:p-7 border-accent/20">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-9 h-9 rounded-xl bg-accent-soft flex items-center justify-center">
          <CalendarDays className="w-4 h-4 text-accent" />
        </span>
        <div>
          <h2 className="font-display font-bold leading-tight">今天就试这一件</h2>
          <p className="text-[11px] text-muted">每天换一条。看完就去发一次，比多看三节课管用。</p>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-surface-alt border border-edge">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-display font-semibold">{template.title}</h3>
          <CopyButton text={template.prompt} label="复制这段" compact />
        </div>
        <p className="text-xs text-muted mb-3">{template.scene}</p>
        <pre className="rounded-lg bg-surface p-3.5 text-xs leading-relaxed whitespace-pre-wrap font-sans text-muted border border-edge">
          {template.prompt}
        </pre>
        {template.tip && (
          <p className="mt-3 text-[11px] text-accent leading-relaxed">
            拿到结果之后：{template.tip}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-4">
        <span className="text-[11px] text-faint inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          复制到豆包、DeepSeek、Kimi 里都行，换成你自己的情况再发
        </span>
        {scenario && (
          <Link
            href="/practice"
            className="inline-flex items-center gap-1 text-xs text-accent hover:underline ml-auto"
          >
            想先练一遍？去练习场
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
