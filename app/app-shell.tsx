'use client';

import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import GamificationStatus from '@/components/gamification/GamificationStatus';
import BadgeUnlock from '@/components/gamification/BadgeUnlock';
import PWAPrompt from '@/components/ui/PWAPrompt';
import { usePWA } from '@/hooks/usePWA';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLessonPage = pathname.startsWith('/lesson/');
  const [queuedBadges, setQueuedBadges] = useState<string[]>([]);
  const { installPrompt, isInstalled, promptInstall, dismissPrompt } = usePWA();
  const [pwaDismissed, setPwaDismissed] = useState(false);

  // Queued badge handling
  const handleBadgeUnlock = useCallback((badgeId: string) => {
    setQueuedBadges((prev) => [...prev, badgeId]);
  }, []);

  const handleDismissBadge = useCallback(() => {
    setQueuedBadges((prev) => prev.slice(1));
  }, []);

  const currentBadge = queuedBadges[0] || null;

  return (
    <>
      {!isLessonPage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 w-full max-w-[400px] px-4">
          <GamificationStatus onBadgeUnlock={handleBadgeUnlock} />
        </div>
      )}
      {children}
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
