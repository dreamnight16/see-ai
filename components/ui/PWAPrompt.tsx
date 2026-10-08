'use client';

import { Download, X } from 'lucide-react';

interface PWAPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

/**
 * 安装提示是覆盖层：用 DNDL 的 Acrylic（自带不透明回退、reduced-transparency
 * 与强制颜色处理），并用 Level 3 阴影解释它浮在页面之上。
 */
export default function PWAPrompt({ onInstall, onDismiss }: PWAPromptProps) {
  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md">
      <div
        className="dn-acrylic dn-elevation-3 dn-enter flex items-center gap-3 p-4"
        onKeyDown={(event) => {
          // Escape 只在焦点位于浮层内部时生效，避免误关页面其它内容
          if (event.key === 'Escape') onDismiss();
        }}
      >
        {/* Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-teal text-on-color">
          <Download className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">安装应用</p>
          <p className="text-xs text-text-secondary">添加到主屏幕，随时随地学习</p>
        </div>

        {/* Actions */}
        <button
          type="button"
          onClick={onInstall}
          className="dn-focus dn-interactive flex min-h-[44px] shrink-0 items-center bg-teal px-4 text-sm font-semibold text-on-color"
        >
          安装
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="关闭安装提示"
          className="dn-focus dn-interactive flex h-11 w-11 shrink-0 items-center justify-center border border-edge-strong text-text-primary hover:bg-surface-alt"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
