'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeToMotionPreference(callback: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(REDUCE_QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function readReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(REDUCE_QUERY).matches;
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
}

export default function AnimatedCounter({ value, duration = 1000, suffix = '' }: AnimatedCounterProps) {
  // 服务端与水合阶段一律按「减少动态效果」处理：直接显示最终值，
  // 这样不会先渲染 0 再跳到真实值，也不会在 effect 里同步 setState。
  const reduced = useSyncExternalStore(subscribeToMotionPreference, readReducedMotion, () => true);
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);
  const startTime = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    if (reduced) {
      // 数字是信息，逐帧滚动不是获取它的前提
      prevValue.current = value;
      return;
    }

    const from = prevValue.current;
    if (from === value) return;
    startTime.current = 0;

    function animate(now: number) {
      if (!startTime.current) startTime.current = now;
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (value - from) * eased);
      prevValue.current = current;
      setDisplay(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    }

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration, reduced]);

  return <span className="tabular-nums">{reduced ? value : display}{suffix}</span>;
}
