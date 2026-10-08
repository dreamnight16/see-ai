'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  color: string; size: number; rotation: number;
  rotationSpeed: number; life: number; maxLife: number;
}

interface ConfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
}

/* DNDL 品牌八色的原始值：canvas 读不到 CSS 变量，只能在这里写字面量 */
const COLORS = ['#59AAA5', '#70B2D1', '#72AD8C', '#A18BC8', '#D4AC65', '#D78E74', '#829BA9', '#C98292'];

export default function Confetti({ active, duration = 3000, particleCount = 100 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  // 庆祝反馈不能变成必须承受的动画：系统要求减少动态效果时整段不画
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!active || reducedMotion) {
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 3,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 10 - 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        life: 0,
        maxLife: duration + Math.random() * 1000,
      });
    }
    particlesRef.current = particles;
    startTimeRef.current = performance.now();

    const gravity = 0.15;

    function animate(now: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const elapsed = now - startTimeRef.current;
      let alive = false;
      for (const p of particles) {
        p.life = elapsed;
        if (p.life > p.maxLife) continue;
        alive = true;
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;

        const alpha = 1 - p.life / p.maxLife;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        // 直角几何：粒子是方块，不是纸屑矩形
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      if (alive) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [active, duration, particleCount, reducedMotion]);

  if (!active || reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    />
  );
}
