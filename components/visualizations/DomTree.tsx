'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const HTML_CODE = `<!DOCTYPE html>
<html>
<head>
  <title>我的主页</title>
  <style>
    body { font-family: sans-serif; }
    h1 { color: #e85d3a; }
  </style>
</head>
<body>
  <h1>你好！</h1>
  <p>欢迎来到我的网站</p>
</body>
</html>`;

const ROOT_COLOR = '#e85d3a';
const ELEMENT_COLOR = '#d4952a';
const TEXT_COLOR = '#5b8c5a';

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
    <div className="card p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-base">HTML → DOM 树</h3>
          <p className="text-[10px] text-muted">浏览器如何把代码变成树状结构</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggle}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent text-white hover:shadow-md active:scale-95 transition-all"
          >
            {running ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {running ? '暂停' : activeLevel < 0 ? '播放' : '继续'}
          </button>
          <button
            onClick={reset}
            className="p-1.5 rounded-lg text-xs text-muted hover:text-accent hover:bg-surface-alt transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Side by side: code + tree */}
      <div className="flex gap-4 flex-col md:flex-row">
        {/* Code panel */}
        <div className="md:w-[45%] shrink-0">
          <div className="rounded-xl border border-edge overflow-hidden">
            <div className="px-3 py-2 bg-surface-alt border-b border-edge text-[10px] text-muted font-medium">
              HTML 代码
            </div>
            <pre className="p-3 text-[11px] font-mono leading-relaxed bg-[#1e1b18] text-[#e8dcc8] overflow-auto max-h-[300px]">
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
                  stroke={visible ? edge.to.color : 'var(--color-border-primary)'}
                  strokeWidth={visible ? 2 : 1}
                  opacity={visible ? 1 : 0.2}
                  className="transition-all duration-500"
                />
              );
            })}

            {/* Nodes */}
            {treeNodes.map((node, i) => {
              const visible = activeLevel >= node.level;
              const width = node.label.length * 8 + 20;
              const x = node.x - width / 2;

              return (
                <g key={i} className="transition-all duration-500" opacity={visible ? 1 : 0.15}>
                  <rect
                    x={x}
                    y={node.y - 8}
                    width={width}
                    height={22}
                    rx={6}
                    fill={visible ? node.color : 'var(--color-bg-tertiary)'}
                    className="transition-all duration-500"
                  />
                  <text
                    x={node.x}
                    y={node.y + 6}
                    textAnchor="middle"
                    fill={visible ? '#fff' : 'var(--color-text-tertiary)'}
                    className="text-[10px] font-mono font-semibold transition-all duration-500"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}

            {/* Level labels */}
            {activeLevel >= 0 && (
              <g className="animate-slide-down">
                {[1, 2, 3, 4].map((level) => (
                  activeLevel >= level ? (
                    <text
                      key={level}
                      x={10}
                      y={level === 1 ? 35 : level === 2 ? 85 : level === 3 ? 135 : 185}
                      className="text-[9px] fill-muted"
                    >
                      L{level}
                    </text>
                  ) : null
                ))}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-4 p-3 rounded-xl bg-surface-alt border border-edge/50">
        <p className="text-xs text-muted leading-relaxed">
          <span className="font-semibold text-text-primary">原理：</span>
          浏览器读入 HTML 后，会把它解析成一棵&ldquo;树&rdquo;（DOM 树）。每个标签是一个节点，嵌套关系变成父子关系。
          树叶是文字内容，树枝是标签。浏览器根据这棵树来决定每个元素的颜色、大小和位置。
        </p>
      </div>
    </div>
  );
}
