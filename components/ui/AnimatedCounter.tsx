'use client';

import { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
}

export default function AnimatedCounter({ value, duration = 1000, suffix = '' }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);
  const startTime = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const from = prevValue.current;
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
  }, [value, duration]);

  return <span className="tabular-nums">{display}{suffix}</span>;
}
