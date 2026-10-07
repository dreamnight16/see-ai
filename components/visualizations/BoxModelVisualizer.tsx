'use client';

import { useState } from 'react';

export default function BoxModelVisualizer() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const layers = [
    { id: 'margin', label: 'margin', color: '#fdf3e0', borderColor: '#d4952a', description: '外边距 — 元素和元素之间的距离' },
    { id: 'border', label: 'border', color: '#fcd9c8', borderColor: '#e85d3a', description: '边框 — 元素的边界线' },
    { id: 'padding', label: 'padding', color: '#eaf5ea', borderColor: '#5b8c5a', description: '内边距 — 内容和边框之间的距离' },
    { id: 'content', label: '内容', color: '#eaf1f8', borderColor: '#4a7fb5', description: '内容区 — 文字或图片所在的地方' },
  ];

  const outerSize = 280;
  const sizes = {
    margin: outerSize,
    border: outerSize - 64,
    padding: outerSize - 128,
    content: outerSize - 176,
  };

  return (
    <div className="card p-5 animate-slide-up">
      <div className="mb-4">
        <h3 className="font-display font-bold text-base">CSS 盒模型</h3>
        <p className="text-[10px] text-muted">每个 HTML 元素都是一个&ldquo;盒子&rdquo;</p>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-2 mb-5">
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
            onMouseEnter={() => setActiveLayer(layer.id)}
            onMouseLeave={() => setActiveLayer(null)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              activeLayer === layer.id
                ? 'text-white shadow-md'
                : 'text-muted bg-surface-alt border-edge'
            }`}
            style={{
              backgroundColor: activeLayer === layer.id ? layer.borderColor : undefined,
              borderColor: activeLayer === layer.id ? layer.borderColor : undefined,
            }}
          >
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: layer.borderColor }} />
            {layer.label}
          </button>
        ))}
      </div>

      {/* Box model visualization */}
      <div className="flex justify-center mb-5">
        <svg width={outerSize + 20} height={outerSize + 20} viewBox={`-10 -10 ${outerSize + 20} ${outerSize + 20}`}>
          {/* Margin */}
          <rect
            x={(outerSize - sizes.margin) / 2}
            y={(outerSize - sizes.margin) / 2}
            width={sizes.margin}
            height={sizes.margin}
            rx={8}
            fill={layers[0].color}
            stroke={layers[0].borderColor}
            strokeWidth={activeLayer === 'margin' ? 3 : 1.5}
            strokeDasharray="6,3"
            className="transition-all duration-300 cursor-pointer"
            opacity={activeLayer && activeLayer !== 'margin' ? 0.5 : 1}
          />

          {/* Border */}
          <rect
            x={(outerSize - sizes.border) / 2}
            y={(outerSize - sizes.border) / 2}
            width={sizes.border}
            height={sizes.border}
            rx={4}
            fill={layers[1].color}
            stroke={layers[1].borderColor}
            strokeWidth={activeLayer === 'border' ? 3 : 2}
            className="transition-all duration-300 cursor-pointer"
            opacity={activeLayer && activeLayer !== 'border' ? 0.5 : 1}
          />

          {/* Padding */}
          <rect
            x={(outerSize - sizes.padding) / 2}
            y={(outerSize - sizes.padding) / 2}
            width={sizes.padding}
            height={sizes.padding}
            rx={2}
            fill={layers[2].color}
            stroke={layers[2].borderColor}
            strokeWidth={activeLayer === 'padding' ? 3 : 1.5}
            className="transition-all duration-300 cursor-pointer"
            opacity={activeLayer && activeLayer !== 'padding' ? 0.5 : 1}
          />

          {/* Content */}
          <rect
            x={(outerSize - sizes.content) / 2}
            y={(outerSize - sizes.content) / 2}
            width={sizes.content}
            height={sizes.content}
            rx={2}
            fill={layers[3].color}
            stroke={layers[3].borderColor}
            strokeWidth={activeLayer === 'content' ? 3 : 1.5}
            className="transition-all duration-300 cursor-pointer"
            opacity={activeLayer && activeLayer !== 'content' ? 0.5 : 1}
          />

          {/* Content text */}
          <text
            x={outerSize / 2}
            y={outerSize / 2 + 4}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-semibold fill-text-primary"
          >
            内容
          </text>

          {/* Annotation lines */}
          {activeLayer && (
            <g className="animate-fade-in">
              {activeLayer === 'margin' && (
                <>
                  <line x1={5} y1={outerSize / 2} x2={20} y2={outerSize / 2} stroke={layers[0].borderColor} strokeWidth="1.5" />
                  <line x1={5} y1={outerSize / 2 - 20} x2={5} y2={outerSize / 2 + 20} stroke={layers[0].borderColor} strokeWidth="1.5" />
                </>
              )}
              {activeLayer === 'padding' && (
                <>
                  <line x1={outerSize - 10} y1={outerSize / 2} x2={outerSize - 30} y2={outerSize / 2} stroke={layers[2].borderColor} strokeWidth="1.5" />
                </>
              )}
            </g>
          )}
        </svg>
      </div>

      {/* Code equivalent */}
      <div className="rounded-xl border border-edge overflow-hidden mb-3">
        <div className="px-3 py-2 bg-surface-alt border-b border-edge text-[10px] text-muted font-medium">
          对应的 CSS 代码
        </div>
        <pre className={`p-4 text-xs font-mono leading-relaxed transition-all duration-300 ${
          activeLayer ? 'bg-surface' : 'bg-[#1e1b18]'
        }`}
        style={activeLayer ? { color: 'var(--color-text-primary)' } : { color: '#e8dcc8' }}
        >
          <code>
            <span className={activeLayer === 'margin' ? 'text-warning font-bold' : ''}>margin: 20px;</span>{'\n'}
            <span className={activeLayer === 'border' ? 'text-accent font-bold' : ''}>border: 2px solid #333;</span>{'\n'}
            <span className={activeLayer === 'padding' ? 'text-success font-bold' : ''}>padding: 16px;</span>{'\n'}
            <span className={activeLayer === 'content' ? 'text-info font-bold' : ''}>width: 200px;</span>
          </code>
        </pre>
      </div>

      {/* Active layer description */}
      {activeLayer && (
        <div
          className="p-3 rounded-xl animate-slide-down text-xs leading-relaxed"
          style={{
            backgroundColor: layers.find((l) => l.id === activeLayer)!.color,
            borderColor: layers.find((l) => l.id === activeLayer)!.borderColor,
            borderWidth: 1,
          }}
        >
          <span className="font-semibold">{layers.find((l) => l.id === activeLayer)!.label}：</span>
          {layers.find((l) => l.id === activeLayer)!.description}
        </div>
      )}
    </div>
  );
}
