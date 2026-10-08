'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Download, Copy, Globe, Cloud, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { DEPLOY_GUIDES } from '@/lib/deploy';

interface ExportDialogProps {
  code: string;
  title: string;
  onClose: () => void;
}

/**
 * 导出模态。
 *
 * Level 4 层级：遮罩 + 明确阴影。打开时焦点锁在对话框内，
 * Escape 与关闭按钮都能退出，关闭后焦点回到打开它的那个按钮。
 */
export default function ExportDialog({ code, title, onClose }: ExportDialogProps) {
  const [activeTab, setActiveTab] = useState<'download' | 'deploy'>('download');
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  function handleDownload() {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'my-page'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const tabClass = (active: boolean) =>
    'dn-focus inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 px-3 text-sm font-semibold transition-colors ' +
    (active ? 'bg-teal text-on-color' : 'bg-surface text-text-primary hover:bg-surface-alt');

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="关闭导出对话框"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-[var(--dn-overlay)]"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-dialog-title"
        className="dn-elevation-4 relative flex max-h-[86vh] w-full max-w-lg flex-col overflow-y-auto border border-edge bg-surface"
      >
        <div className="flex items-start justify-between gap-3 border-b border-edge px-5 py-4">
          <div className="min-w-0">
            <h2 id="export-dialog-title" className="font-display text-xl leading-tight">
              导出作品
            </h2>
            <p className="mt-1 truncate text-xs text-text-secondary">
              {title || '未命名作品'}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="关闭导出对话框"
            className="dn-focus flex h-11 w-11 shrink-0 items-center justify-center border border-edge-strong hover:bg-surface-alt"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex gap-1 border-b border-edge p-2">
          <button type="button" onClick={() => setActiveTab('download')} aria-pressed={activeTab === 'download'} className={tabClass(activeTab === 'download')}>
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            下载代码
          </button>
          <button type="button" onClick={() => setActiveTab('deploy')} aria-pressed={activeTab === 'deploy'} className={tabClass(activeTab === 'deploy')}>
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            发布上网
          </button>
        </div>

        <div className="p-5">
          {activeTab === 'download' && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleDownload}
                className="dn-focus dn-interactive flex min-h-[52px] w-full items-center justify-center gap-2 bg-teal px-4 text-sm font-semibold text-on-color"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                下载 HTML 文件
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="dn-focus flex min-h-[52px] w-full items-center justify-center gap-2 border border-edge-strong px-4 text-sm font-semibold text-text-primary hover:bg-surface-alt"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-ink" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
                {copied ? '已复制到剪贴板' : '复制代码'}
              </button>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-2">
              {DEPLOY_GUIDES.map((guide) => {
                const expanded = expandedGuide === guide.id;
                return (
                  <div key={guide.id} className="border border-edge">
                    <button
                      type="button"
                      onClick={() => setExpandedGuide(expanded ? null : guide.id)}
                      aria-expanded={expanded}
                      className="dn-focus flex min-h-[64px] w-full items-center justify-between gap-3 p-4 text-left hover:bg-surface-alt"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center bg-teal-tint text-teal-ink">
                          {guide.id === 'github-pages' ? (
                            <Globe className="h-4 w-4" aria-hidden="true" />
                          ) : guide.id === 'download' ? (
                            <Download className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Cloud className="h-4 w-4" aria-hidden="true" />
                          )}
                        </span>
                        <span>
                          <span className="block text-sm font-semibold">{guide.label}</span>
                          <span className="mt-0.5 block text-xs text-text-secondary">
                            {guide.description}
                          </span>
                        </span>
                      </span>
                      {expanded ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
                      )}
                    </button>
                    {expanded && (
                      <ol className="list-decimal space-y-2 border-t border-edge px-4 py-3 pl-8 text-sm leading-relaxed text-text-primary">
                        {guide.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
