'use client';

import { useState, useCallback } from 'react';
import BadgeUnlock from '@/components/gamification/BadgeUnlock';
import PWAPrompt from '@/components/ui/PWAPrompt';
import SiteHeader from '@/components/shell/SiteHeader';
import SiteFooter from '@/components/shell/SiteFooter';
import { usePWA } from '@/hooks/usePWA';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [queuedBadges, setQueuedBadges] = useState<string[]>([]);
  const { installPrompt, isInstalled, promptInstall, dismissPrompt } = usePWA();
  const [pwaDismissed, setPwaDismissed] = useState(false);

  const handleBadgeUnlock = useCallback((badgeId: string) => {
    setQueuedBadges((prev) => [...prev, badgeId]);
  }, []);

  const handleDismissBadge = useCallback(() => {
    setQueuedBadges((prev) => prev.slice(1));
  }, []);

  const currentBadge = queuedBadges[0] || null;

  return (
    <>
      <SiteHeader onBadgeUnlock={handleBadgeUnlock} />
      <a
        href="#main"
        className="dn-focus sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-teal focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-on-color"
      >
        跳到主要内容
      </a>
      {/* 顶栏是 fixed 的，内容整体下移一个顶栏高度 */}
      <div className="pt-[var(--see-header-h)]">{children}</div>
      <SiteFooter />
      {currentBadge && (
        <BadgeUnlock badgeId={currentBadge} onDismiss={handleDismissBadge} />
      )}
      {installPrompt && !isInstalled && !pwaDismissed && (
        <PWAPrompt
          onInstall={() => { promptInstall(); setPwaDismissed(true); }}
          onDismiss={() => { dismissPrompt(); setPwaDismissed(true); }}
        />
      )}
    </>
  );
}
