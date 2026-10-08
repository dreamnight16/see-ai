'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import type { CSSProperties } from 'react';

const HTML_CODE = `<!DOCTYPE html>
<html>
<head>
  <title>我的主页</title>
  <style>
    body { font-family: sans-serif; }
    h1 { color: #59AAA5; }
  </style>
</head>
<body>
  <h1>你好！</h1>
  <p>欢迎来到我的网站</p>
</body>
</html>`;

/* 三类节点各用一个品牌实色，色块上的文字统一用 --dn-text-on-color */
const ROOT_COLOR = 'var(--dn-teal)';
const ELEMENT_COLOR = 'var(--dn-cyan)';
const TEXT_COLOR = 'var(--dn-emerald)';

/* 还没解析到的层留虚线占位框，而不是把节点淡成看不清 */
const PENDING_FILL = 'var(--dn-surface)';
const LINE = 'var(--dn-divider)';
const ON_COLOR = 'var(--dn-text-on-color)';

export default function DomTree() {
  const [activeLevel, setActiveLevel] = useState(-1);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const levelCount = 5;

  useEffect(() => {
    if (running) {
      let step = activeLevel;
      timerRef.current = setInterval(() => {
        step++;
        if (step > levelCount) {
          setRunning(false);
          step = levelCount;
        }
        setActiveLevel(step);
      }, 800);
    }
    return () => clearInterval(timerRef.current);
  }, [running, activeLevel]);

  function toggle() {
    if (!running) {
      if (activeLevel >= levelCount) setActiveLevel(-1);
      setRunning(true);
    } else {
      setRunning(false);
    }
  }

  function reset() {
    setRunning(false);
    setActiveLevel(-1);
  }

  // Manual DOM tree structure for visualization
  const treeNodes = [
    { id: 'html', label: '<html>', x: 300, y: 35, parent: null, level: 1, color: ROOT_COLOR },
    { id: 'head', label: '<head>', x: 160, y: 85, parent: 'html', level: 2, color: ROOT_COLOR },
    { id: 'body', label: '<body>', x: 440, y: 85, parent: 'html', level: 2, color: ROOT_COLOR },
    { id: 'title', label: '<title>', x: 80, y: 135, parent: 'head', level: 3, color: ELEMENT_COLOR },
    { id: 'style', label: '<style>', x: 240, y: 135, parent: 'head', level: 3, color: ELEMENT_COLOR },
    { id: 'h1', label: '<h1>', x: 380, y: 135, parent: 'body', level: 3, color: ELEMENT_COLOR },
    { id: 'p', label: '<p>', x: 500, y: 135, parent: 'body', level: 3, color: ELEMENT_COLOR },
    { id: 'title-text', label: '"我的主页"', x: 80, y: 185, parent: 'title', level: 4, color: TEXT_COLOR },
    { id: 'h1-text', label: '"你好！"', x: 380, y: 185, parent: 'h1', level: 4, color: TEXT_COLOR },
    { id: 'p-text', label: '"欢迎..."', x: 500, y: 185, parent: 'p', level: 4, color: TEXT_COLOR },
  ];

  // Edges
  const edges = treeNodes
    .filter((n) => n.parent)
    .map((n) => {
      const parent = treeNodes.find((p) => p.id === n.parent)!;
      return { from: parent, to: n };
    });

  return (
    <div className="card dn-rise p-5" style={{ '--dn-enter-index': 0 } as CSSProperties}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-base">HTML → DOM 树</h3>
          <p className="text-[11px] text-text-secondary">浏览器如何把代码变成树状结构</p>
        </div>
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
            {running ? '暂停' : activeLevel < 0 ? '播放' : '继续'}
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="重置解析过程"
            className="dn-focus dn-interactive flex h-11 w-11 items-center justify-center border border-edge-strong text-text-primary hover:bg-surface-alt"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Side by side: code + tree */}
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Code panel */}
        <div className="shrink-0 md:w-[45%]">
          <div className="border border-edge">
            <div className="border-b border-edge bg-surface-alt px-3 py-2">
              <span className="see-kicker text-text-secondary">HTML 代码</span>
            </div>
            <pre className="see-code max-h-[300px] overflow-auto p-3 font-mono text-[11px] leading-relaxed">
              <code>{HTML_CODE}</code>
            </pre>
          </div>
        </div>

        {/* Tree visualization */}
        <div className="flex-1">
          <svg viewBox="0 0 600 230" className="w-full" style={{ maxHeight: 230 }}>
            {/* Edges */}
            {edges.map((edge, i) => {
              const visible = activeLevel >= edge.to.level;
              return (
                <line
                  key={i}
                  x1={edge.from.x}
                  y1={edge.from.y + 12}
                  x2={edge.to.x}
                  y2={edge.to.y - 6}
                  stroke={visible ? edge.to.color : LINE}
                  strokeWidth={visible ? 2 : 1}
                  strokeDasharray={visible ? 'none' : '4,3'}
                  className="transition-[stroke] duration-[380ms] ease-[var(--dn-ease-in)]"
                />
              );
            })}

            {/* Nodes */}
            {treeNodes.map((node, i) => {
              const visible = activeLevel >= node.level;
              const width = node.label.length * 8 + 20;
              const x = node.x - width / 2;

              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={node.y - 8}
                    width={width}
                    height={22}
                    fill={visible ? node.color : PENDING_FILL}
                    stroke={visible ? node.color : LINE}
                    strokeWidth={1}
                    strokeDasharray={visible ? 'none' : '4,3'}
                    className="transition-[fill,stroke] duration-[380ms] ease-[var(--dn-ease-in)]"
                  />
                  <text
                    x={node.x}
                    y={node.y + 6}
                    textAnchor="middle"
                    fill={visible ? ON_COLOR : 'var(--dn-text-secondary)'}
                    className="text-[10px] font-mono font-semibold"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}

            {/* Level labels */}
            {activeLevel >= 0 && (
              <g>
                {[1, 2, 3, 4].map((level) =>
                  activeLevel >= level ? (
                    <text
                      key={level}
                      x={10}
                      y={level === 1 ? 35 : level === 2 ? 85 : level === 3 ? 135 : 185}
                      className="fill-text-secondary text-[9px]"
                    >
                      L{level}
                    </text>
                  ) : null,
                )}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-4 border border-edge bg-surface-alt p-3">
        <p className="text-xs leading-relaxed text-text-secondary">
          <span className="font-semibold text-text-primary">原理：</span>
          浏览器读入 HTML 后，会把它解析成一棵&ldquo;树&rdquo;（DOM 树）。每个标签是一个节点，嵌套关系变成父子关系。
          树叶是文字内容，树枝是标签。浏览器根据这棵树来决定每个元素的颜色、大小和位置。
        </p>
      </div>
    </div>
  );
}
