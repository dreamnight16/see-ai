'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Compass } from 'lucide-react';
import GamificationStatus from '@/components/gamification/GamificationStatus';

/**
 * 全站顶部导航。
 *
 * 顶栏是覆盖层，用 DNDL 的 Acrylic 材质；materials.css 在模糊不可用、
 * 用户关掉透明效果、prefers-reduced-transparency 和强制颜色模式下都会
 * 退回不透明 Surface，所以内容可读性不依赖 backdrop-filter。
 *
 * 当前所在位置用「色块 + 下边框」两个线索表示，不只靠颜色。
 */
const NAV = [
  { href: '/', label: '课程表' },
  { href: '/prompts', label: '提示词库' },
  { href: '/practice', label: '练习场' },
  { href: '/glossary', label: '名词表' },
  { href: '/trends', label: '本周热词' },
  { href: '/showcase', label: '我的作品' },
  { href: '/dashboard', label: '学习数据' },
];

function isCurrent(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/' || pathname.startsWith('/lesson/');
  return pathname === href || pathname.startsWith(href + '/');
}

interface SiteHeaderProps {
  /** 徽章解锁后交给外层排队弹窗；顶栏里的进度组件负责触发 */
  onBadgeUnlock?: (badgeId: string) => void;
}

export default function SiteHeader({ onBadgeUnlock }: SiteHeaderProps = {}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    // 关闭后把焦点还给触发元素，用户不会丢位置
    menuButtonRef.current?.focus();
  }, []);

  // Escape 关闭；打开时锁住底层滚动，但不卸载底层页面
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        close();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <>
      <header className="see-shell-header dn-acrylic fixed inset-x-0 top-0 z-20 flex h-[var(--see-header-h)] items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="see-brand dn-focus flex min-h-[44px] shrink-0 items-center gap-2.5"
          aria-label="见 AI 课程首页"
        >
          <span className="flex h-9 w-9 items-center justify-center bg-teal text-[15px] font-semibold text-on-color">
            见
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-[17px] leading-none">见 AI</span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[2.2px] text-muted">
              AI Literacy
            </span>
          </span>
        </Link>

        <nav aria-label="主导航" className="hidden lg:flex lg:items-center lg:gap-1">
          {NAV.map((item) => {
            const current = isCurrent(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? 'page' : undefined}
                className={
                  'dn-focus flex min-h-[44px] items-center border-b-[3px] px-3 text-sm transition-colors ' +
                  (current
                    ? 'border-teal font-semibold text-teal-ink'
                    : 'border-transparent text-text-secondary hover:border-steel hover:text-text-primary')
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <GamificationStatus compact onBadgeUnlock={onBadgeUnlock} />
          <Link
            href="/start"
            className="dn-focus dn-interactive hidden min-h-[44px] items-center gap-2 bg-teal px-4 text-sm font-semibold text-on-color sm:inline-flex"
          >
            <Compass className="h-4 w-4" />
            我该从哪开始
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="打开导航菜单"
            aria-expanded={open}
            className="dn-focus flex h-11 w-11 items-center justify-center border border-edge-strong text-text-primary lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="关闭导航菜单"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-[var(--dn-overlay)]"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="导航菜单"
            tabIndex={-1}
            className="dn-elevation-4 absolute inset-y-0 right-0 flex w-[86%] max-w-[340px] flex-col bg-surface outline-none"
          >
            <div className="flex items-center justify-between border-b border-edge px-4 py-3">
              <span className="see-kicker text-text-secondary">导航</span>
              <button
                type="button"
                onClick={close}
                aria-label="关闭导航菜单"
                className="dn-focus flex h-11 w-11 items-center justify-center border border-edge-strong"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="移动端主导航" className="flex-1 overflow-y-auto py-2">
              {NAV.map((item) => {
                const current = isCurrent(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={current ? 'page' : undefined}
                    className={
                      'dn-focus flex min-h-[48px] items-center gap-3 px-4 text-base ' +
                      (current
                        ? 'bg-teal text-on-color font-semibold'
                        : 'text-text-primary hover:bg-surface-alt')
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/start"
                onClick={() => setOpen(false)}
                className="dn-focus flex min-h-[48px] items-center gap-3 px-4 text-base text-text-primary hover:bg-surface-alt"
              >
                我该从哪开始
              </Link>
              <Link
                href="/visualizations"
                onClick={() => setOpen(false)}
                className="dn-focus flex min-h-[48px] items-center gap-3 px-4 text-base text-text-primary hover:bg-surface-alt"
              >
                可视化演示
              </Link>
            </nav>
            <div className="border-t border-edge px-4 py-3">
              <a
                href="https://dreamnight.net.cn"
                className="see-link dn-focus inline-flex min-h-[44px] items-center text-xs"
              >
                返回 DreamNight 博客
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
