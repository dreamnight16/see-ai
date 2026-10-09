'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Step {
  label: string;
  description: string;
  x: number;
  y: number;
  /** 品牌实色：只用于色块本身 */
  color: string;
  /** 同色派生墨色：品牌原色在浅底上做小字对比度不足，标签文字走 ink */
  ink: string;
}

const STEPS: Step[] = [
  { label: '描述需求', description: '用大白话说清楚你想做什么', x: 50, y: 60, color: 'var(--dn-teal)', ink: 'var(--see-teal-ink)' },
  { label: '拆成小步', description: '把页面和交互拆成能动手的任务', x: 220, y: 60, color: 'var(--dn-amber)', ink: 'var(--see-amber-ink)' },
  { label: '写出第一版', description: '先得到一份能打开、能修改的代码', x: 390, y: 60, color: 'var(--dn-emerald)', ink: 'var(--see-emerald-ink)' },
  { label: '预览效果', description: '在浏览器中看到你的作品', x: 560, y: 60, color: 'var(--dn-cyan)', ink: 'var(--see-cyan-ink)' },
  { label: '迭代修改', description: '哪里不对，就指出哪里再改一轮', x: 475, y: 160, color: 'var(--dn-teal)', ink: 'var(--see-teal-ink)' },
  { label: '完成作品', description: '留下一个你看得懂、改得动的版本', x: 305, y: 160, color: 'var(--dn-emerald)', ink: 'var(--see-emerald-ink)' },
];

const ARROWS = [
  { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 5 },
];

/* SVG 里写不了 Tailwind 类，颜色一律取 DNDL 变量，避免在这里复制十六进制 */
const LINE = 'var(--dn-divider)';
const PENDING_FILL = 'var(--dn-divider)';
const ON_COLOR = 'var(--dn-text-on-color)';

/* 节点是直角方块：品牌几何语言里没有圆形节点，方块边长也只差一档用来表达「当前」 */
const NODE_SIZE = 48;
const NODE_ACTIVE_SIZE = 56;

/* 提示条宽度固定，靠夹取 x 保证最后一步的提示不被 viewBox 裁掉 */
const TIP_WIDTH = 140;
const VIEW_WIDTH = 660;

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

  const tip = activeStep >= 0 && activeStep < STEPS.length ? STEPS[activeStep] : null;
  const tipX = tip ? Math.min(Math.max(tip.x - 30, 4), VIEW_WIDTH - TIP_WIDTH - 4) : 0;

  return (
    <div className="card dn-rise p-5" style={{ '--dn-enter-index': 0 } as CSSProperties}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-display text-base">Vibe Coding 完整流程</h3>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggle}
            className="dn-focus dn-interactive flex min-h-[44px] items-center gap-1.5 bg-teal px-4 text-xs font-semibold text-on-color"
          >
            {running ? (
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {running ? '暂停' : '播放'}
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="重置流程"
            className="dn-focus dn-interactive flex h-11 w-11 items-center justify-center border border-edge-strong text-text-primary hover:bg-surface-alt"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox="0 0 660 250" className="w-full min-w-[500px]" style={{ maxHeight: 280 }}>
          <defs>
            <marker id="arrowhead-v2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={LINE} />
            </marker>
            <marker id="arrowhead-active-v2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="var(--dn-teal)" />
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
                stroke={isActive ? 'var(--dn-teal)' : LINE}
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeDasharray={isActive ? 'none' : '6,3'}
                markerEnd={isActive ? 'url(#arrowhead-active-v2)' : 'url(#arrowhead-v2)'}
                className="transition-[stroke] duration-[380ms] ease-[var(--dn-ease-in)]"
              />
            );
          })}

          {STEPS.map((step, i) => {
            const isCurrent = activeStep === i;
            const isDone = activeStep > i;
            const lit = isCurrent || isDone;
            const box = isCurrent ? NODE_ACTIVE_SIZE : NODE_SIZE;
            const cx = step.x + 40;

            return (
              <g key={i}>
                {/* 当前步用更粗的深色描边，状态不只靠颜色：形状也在说话 */}
                <rect
                  x={cx - box / 2}
                  y={step.y - box / 2}
                  width={box}
                  height={box}
                  fill={lit ? step.color : PENDING_FILL}
                  stroke={isCurrent ? 'var(--dn-ink-primary)' : lit ? step.color : LINE}
                  strokeWidth={isCurrent ? 3 : 1}
                  className="transition-[fill,stroke] duration-[380ms] ease-[var(--dn-ease-in)]"
                />
                <text
                  x={cx} y={step.y + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={lit ? ON_COLOR : 'var(--dn-text-primary)'}
                  className="text-xs font-semibold"
                >
                  {isDone ? '✓' : i + 1}
                </text>
                <text
                  x={cx} y={step.y + 42}
                  textAnchor="middle"
                  fill={isCurrent ? step.ink : 'var(--dn-text-primary)'}
                  className="text-[11px] font-semibold"
                >
                  {step.label}
                </text>
              </g>
            );
          })}

          {tip && (
            <g>
              <rect x={tipX} y={tip.y - 56} width={TIP_WIDTH} height={24} fill="var(--dn-teal)" />
              <text
                x={tipX + TIP_WIDTH / 2} y={tip.y - 41}
                textAnchor="middle" fill={ON_COLOR} className="text-[10px]"
              >
                {tip.description}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* 容器窄于 500px 时图必须横滑，不给提示的话第 3 步会被从中间切断，
          看上去像渲染坏了。640px 以上容器装得下整张图，无需提示。 */}
      <p className="mt-2 text-center text-[10px] text-text-secondary sm:hidden">
        ← 左右滑动查看完整流程 →
      </p>

      <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-text-secondary">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 bg-teal" /> 当前步骤
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 bg-emerald" /> 已完成
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 border border-edge-strong bg-surface" /> 待执行
        </span>
      </div>
    </div>
  );
}
