'use client';

import { MessageCircle, MessagesSquare } from 'lucide-react';

interface SocraticToggleProps {
  value: boolean;
  onChange: (val: boolean) => void;
}

/**
 * 回答方式：直角分段控件，替掉原来的胶囊滑动开关。
 *
 * 选中态同时给三重线索——品牌实色底、加粗文字、底部 3px 实色条——
 * 任何一条失效都不会让「当前选的是哪个」变成只靠颜色判断。
 * value 契约不变：false = 直接回答，true = 引导思考。
 */
export default function SocraticToggle({ value, onChange }: SocraticToggleProps) {
  const base =
    'dn-focus relative inline-flex min-h-[44px] items-center gap-1.5 px-3 text-xs transition-colors';
  const selected = 'bg-teal font-semibold text-on-color';
  const idle = 'bg-surface text-text-secondary hover:bg-surface-alt hover:text-text-primary';

  return (
    <div role="group" aria-label="回答方式" className="inline-flex border border-edge-strong">
      <button
        type="button"
        onClick={() => onChange(false)}
        aria-pressed={!value}
        className={`${base} ${!value ? selected : idle}`}
      >
        <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        直接回答
        {!value && (
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-on-color" />
        )}
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        aria-pressed={value}
        className={`${base} border-l border-edge-strong ${value ? selected : idle}`}
      >
        <MessagesSquare className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        引导思考
        {value && (
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-on-color" />
        )}
      </button>
    </div>
  );
}
