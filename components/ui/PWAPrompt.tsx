'use client';

import { useEffect, useRef } from 'react';
import { Download, X } from 'lucide-react';

interface PWAPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

/**
 * 安装提示是覆盖层：用 DNDL 的 Acrylic（自带不透明回退、reduced-transparency
 * 与强制颜色处理），并用 Level 3 阴影解释它浮在页面之上。
 *
 * 它浮在右下角，而课程目录按钮（移动端 FAB）也在右下角，层级还更低——
 * 390×844 实测两者矩形完全重叠，点按钮只会关掉提示。所以这里把自身高度
 * 写进 --see-bottom-banner（含离底边距与间隔），按钮按它抬上去；
 * 观察尺寸是因为提示在窄屏会折行变高，写死高度迟早对不上。
 */
export default function PWAPrompt({ onInstall, onDismiss }: PWAPromptProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;
    const root = document.documentElement;
    // 自身高度 + 距底边 16px（bottom-4）+ 12px 间隔
    const publish = () => {
      root.style.setProperty('--see-bottom-banner', `${el.offsetHeight + 28}px`);
    };
    publish();
    if (typeof ResizeObserver === 'undefined') {
      return () => root.style.removeProperty('--see-bottom-banner');
    }
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--see-bottom-banner');
    };
  }, []);

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md">
      <div
        ref={bannerRef}
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
