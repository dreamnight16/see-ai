import type { ReactNode } from 'react';

export interface ToolFact {
  value: string;
  label: string;
}

interface ToolHeaderProps {
  /** 小标签，通常写明这个工具不需要什么（联网 / 账号 / API Key） */
  kicker: string;
  title: string;
  lead: string;
  /** 右侧数字色块的整组配色，必须是字面量类名，Tailwind 才能扫到 */
  field: string;
  /** 数字必须是真实数据，禁止编造 */
  facts: ToolFact[];
  /** 页脚注，用来标注数据来源或静态回退 */
  footnote?: string;
  children?: ReactNode;
}

/**
 * 工具页统一的头部：左边是主张，右边是一面真实数字的色块墙。
 *
 * 工具页原本各自写了一遍「装饰线 + 大标题 + 一行说明」，
 * 现在收成一个组件，保证十个页面的层级、间距和语气一致。
 */
export default function ToolHeader({
  kicker,
  title,
  lead,
  field,
  facts,
  footnote,
  children,
}: ToolHeaderProps) {
  return (
    <header className="border-b border-edge">
      <div className="mx-auto grid max-w-[var(--see-shell)] gap-8 px-[var(--see-gutter)] py-10 lg:grid-cols-12 lg:gap-12 lg:py-14">
        <div className="lg:col-span-7">
          <p className="see-kicker text-teal-ink">{kicker}</p>
          <h1 className="font-display mt-4 text-[clamp(1.9rem,4.2vw,2.9rem)] leading-[1.12]">
            {title}
          </h1>
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-text-secondary">
            {lead}
          </p>
          {children}
        </div>

        <div className="lg:col-span-5">
          <dl className="grid grid-cols-2 gap-[3px]">
            {facts.map((fact, i) => (
              <div
                key={fact.label}
                className={
                  'flex min-h-[112px] flex-col justify-between p-4 ' +
                  field +
                  (i === 0 && facts.length % 2 === 1 ? ' col-span-2' : '')
                }
              >
                <dd className="font-display text-[2.5rem] leading-none tabular-nums">
                  {fact.value}
                </dd>
                <dt className="text-xs font-semibold leading-snug">{fact.label}</dt>
              </div>
            ))}
          </dl>
          {footnote && (
            <p className="mt-3 text-[11px] leading-relaxed text-text-secondary">
              {footnote}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
