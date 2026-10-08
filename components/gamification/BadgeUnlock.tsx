'use client';

import { useEffect, useRef, useState } from 'react';
import Confetti from '@/components/ui/Confetti';
import { getBadgeById } from '@/lib/achievements';
import { X, Award, Footprints, Zap, Flag, GraduationCap, Trophy, Wand2, Flame, Compass, Code2, Star } from 'lucide-react';

interface BadgeUnlockProps {
  badgeId: string;
  onDismiss: () => void;
}

/**
 * 徽章解锁提示。
 *
 * 4 秒后自动收起，也可以立刻关掉（按钮或 Escape）。
 * 自动收起只是省事，不是唯一出口——内容不会因为动画结束才可读。
 */
export default function BadgeUnlock({ badgeId, onDismiss }: BadgeUnlockProps) {
  const [visible, setVisible] = useState(false);
  const badge = getBadgeById(badgeId);
  const dismissRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 4000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [badgeId, onDismiss]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setVisible(false);
        setTimeout(onDismiss, 200);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onDismiss]);

  if (!badge) return null;

  const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    Footprints, Zap, Flag, GraduationCap, Trophy, Wand2, Flame, Compass, Code2, Award, Star,
  };
  const IconComponent = ICON_MAP[badge.icon] || Award;

  function dismiss() {
    setVisible(false);
    setTimeout(onDismiss, 200);
  }

  return (
    <>
      <Confetti active={visible} duration={2500} particleCount={80} />
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <button
          type="button"
          aria-label="关闭徽章提示"
          onClick={dismiss}
          className="absolute inset-0 h-full w-full cursor-default bg-[var(--dn-overlay)]"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="badge-unlock-title"
          className={
            'dn-elevation-4 relative w-full max-w-sm border border-edge bg-surface text-center transition-opacity duration-[380ms] ease-[var(--dn-ease-in)] ' +
            (visible ? 'opacity-100' : 'opacity-0')
          }
        >
          <div className="flex justify-end px-2 pt-2">
            <button
              ref={dismissRef}
              type="button"
              onClick={dismiss}
              aria-label="关闭徽章提示"
              className="dn-focus flex h-11 w-11 items-center justify-center border border-edge-strong hover:bg-surface-alt"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="px-6 pb-8">
            <span className="mx-auto flex h-20 w-20 items-center justify-center bg-amber text-on-color">
              <IconComponent className="h-10 w-10" aria-hidden="true" />
            </span>

            <p className="see-kicker mt-5 text-amber-ink">获得新徽章</p>
            <h2 id="badge-unlock-title" className="font-display mt-3 text-2xl leading-tight">
              {badge.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              {badge.description}
            </p>

            <p className="mt-5 inline-flex min-h-[40px] items-center gap-2 bg-violet px-4 text-sm font-semibold text-on-color">
              <Star className="h-4 w-4" aria-hidden="true" />
              +{badge.xpReward} XP
            </p>

            <p className="mt-4 text-xs text-text-secondary">
              这个提示 4 秒后自动收起，也可以按 Escape 关掉。
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
