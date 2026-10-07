'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Step {
  label: string;
  description: string;
  x: number;
  y: number;
  color: string;
}

const STEPS: Step[] = [
  { label: '描述需求', description: '用大白话说清楚你想做什么', x: 50, y: 60, color: '#3159d8' },
  { label: '拆成小步', description: '把页面和交互拆成能动手的任务', x: 220, y: 60, color: '#d99a2e' },
  { label: '写出第一版', description: '先得到一份能打开、能修改的代码', x: 390, y: 60, color: '#229b8d' },
  { label: '预览效果', description: '在浏览器中看到你的作品', x: 560, y: 60, color: '#4a7fb5' },
  { label: '迭代修改', description: '哪里不对，就指出哪里再改一轮', x: 475, y: 160, color: '#3159d8' },
  { label: '完成作品', description: '留下一个你看得懂、改得动的版本', x: 305, y: 160, color: '#229b8d' },
];

const ARROWS = [
  { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 5 },
];

export default function VibeCodingFlow() {
  const [activeStep, setActiveStep] = useState(-1);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        const step = prev + 1;
        return step > STEPS.length ? 0 : step;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, [running]);

  function toggle() {
    setRunning((prev) => !prev);
  }

  function reset() {
    setRunning(false);
    setActiveStep(-1);
  }

  return (
    <div className="card p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-base">Vibe Coding 完整流程</h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggle}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent text-white hover:shadow-md active:scale-95 transition-all"
          >
            {running ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {running ? '暂停' : '播放'}
          </button>
          <button
            onClick={reset}
            className="p-1.5 rounded-lg text-xs text-muted hover:text-accent hover:bg-surface-alt transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox="0 0 660 250" className="w-full min-w-[500px]" style={{ maxHeight: 280 }}>
          <defs>
            <filter id="flow-glow-v2">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <marker id="arrowhead-v2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="var(--color-border-primary)" />
            </marker>
            <marker id="arrowhead-active-v2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="var(--color-accent)" />
            </marker>
          </defs>

          {ARROWS.map((arrow, i) => {
            const from = STEPS[arrow.from];
            const to = STEPS[arrow.to];
            const isActive = activeStep > arrow.from && activeStep <= STEPS.length;
            const d = (arrow.from === 3 && arrow.to === 4)
              ? `M ${from.x + 40} ${from.y} C ${from.x + 40} ${from.y + 40}, ${to.x + 40} ${to.y - 40}, ${to.x + 40} ${to.y}`
              : `M ${from.x + 80} ${from.y} C ${from.x + 110} ${from.y}, ${to.x - 30} ${to.y}, ${to.x} ${to.y}`;

            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={isActive ? 'var(--color-accent)' : 'var(--color-border-primary)'}
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeDasharray={isActive ? 'none' : '6,3'}
                markerEnd={isActive ? 'url(#arrowhead-active-v2)' : 'url(#arrowhead-v2)'}
                className="transition-all duration-500"
              />
            );
          })}

          {STEPS.map((step, i) => {
            const isActive = activeStep >= i && activeStep < STEPS.length;
            const isCurrent = activeStep === i;
            const isDone = activeStep > i;

            return (
              <g
                key={i}
                className="transition-all duration-500"
                style={{ opacity: activeStep >= 0 ? (isActive ? 1 : 0.3) : 1 }}
              >
                <circle
                  cx={step.x + 40} cy={step.y}
                  r={isCurrent ? 28 : 24}
                  fill={isDone ? step.color : isCurrent ? step.color : 'var(--color-bg-tertiary)'}
                  stroke={isCurrent ? step.color : isDone ? step.color : 'var(--color-border-primary)'}
                  strokeWidth={isCurrent ? 3 : 2}
                  className="transition-all duration-500"
                  filter={isCurrent ? 'url(#flow-glow-v2)' : undefined}
                />
                <text
                  x={step.x + 40} y={step.y + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={isActive ? '#fff' : 'var(--color-text-secondary)'}
                  className="text-xs font-bold transition-all duration-500"
                >
                  {isDone ? '✓' : i + 1}
                </text>
                <text
                  x={step.x + 40} y={step.y + 42}
                  textAnchor="middle"
                  fill={isCurrent ? step.color : 'var(--color-text-primary)'}
                  className="text-[11px] font-semibold transition-all duration-500"
                >
                  {step.label}
                </text>
              </g>
            );
          })}

          {activeStep >= 0 && activeStep < STEPS.length && (
            <g className="animate-slide-down">
              <rect
                x={STEPS[activeStep].x - 30} y={STEPS[activeStep].y - 50}
                width={140} height={24} rx={8}
                fill="var(--color-accent)" opacity={0.9}
              />
              <text
                x={STEPS[activeStep].x + 40} y={STEPS[activeStep].y - 35}
                textAnchor="middle" fill="#fff" className="text-[10px]"
              >
                {STEPS[activeStep].description}
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-muted">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-accent" /> 当前步骤
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success" /> 已完成
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-surface-raised border border-edge" /> 待执行
        </span>
      </div>
    </div>
  );
}
