'use client';

import { useEffect, useState } from 'react';
import Confetti from '@/components/ui/Confetti';
import { getBadgeById } from '@/lib/achievements';
import { X, Award, Footprints, Zap, Flag, GraduationCap, Trophy, Wand2, Flame, Compass, Code2, Star } from 'lucide-react';

interface BadgeUnlockProps {
  badgeId: string;
  onDismiss: () => void;
}

export default function BadgeUnlock({ badgeId, onDismiss }: BadgeUnlockProps) {
  const [visible, setVisible] = useState(false);
  const badge = getBadgeById(badgeId);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 500);
    }, 4000);
    return () => clearTimeout(timer);
  }, [badgeId, onDismiss]);

  if (!badge) return null;

  const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    Footprints, Zap, Flag, GraduationCap, Trophy, Wand2, Flame, Compass, Code2, Award, Star,
  };
  const IconComponent = ICON_MAP[badge.icon] || Award;

  return (
    <>
      <Confetti active={visible} duration={2500} particleCount={80} />
      <div
        className={`fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => { setVisible(false); setTimeout(onDismiss, 500); }}
      >
        <div
          className={`bg-surface rounded-3xl p-10 max-w-sm w-[90%] text-center shadow-2xl border border-edge ${
            visible ? 'animate-scale-in' : 'scale-90 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Badge icon */}
          <div className="w-24 h-24 mx-auto mb-5 rounded-3xl bg-accent-soft flex items-center justify-center shadow-glow animate-bounce">
            <IconComponent className="w-12 h-12 text-accent" />
          </div>

          {/* Title */}
          <p className="text-sm text-accent font-semibold mb-2 animate-slide-up stagger-1">
            获得新徽章！
          </p>
          <h2 className="font-display text-2xl font-bold mb-2 animate-slide-up stagger-2">
            {badge.name}
          </h2>
          <p className="text-muted text-sm mb-4 animate-slide-up stagger-3">
            {badge.description}
          </p>

          {/* XP reward */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning-soft text-warning text-sm font-semibold animate-slide-up stagger-4">
            <Star className="w-4 h-4" />
            +{badge.xpReward} XP
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => { setVisible(false); setTimeout(onDismiss, 500); }}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-surface-alt hover:bg-surface-raised flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-muted" />
          </button>
        </div>
      </div>
    </>
  );
}
