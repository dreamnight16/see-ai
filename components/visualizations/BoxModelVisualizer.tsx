'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Check } from 'lucide-react';

interface Layer {
  id: string;
  label: string;
  /** 淡底（品牌色的 tint）：大面积低对比，其上文字用 --dn-text-primary */
  fill: string;
  /** 品牌实色：边框、色标与选中态色块 */
  stroke: string;
  /** 深色代码块里高亮这一行用的品牌色，在 Ink 底上对比度 ≥ 4.5:1 */
  code: string;
  description: string;
}

export default function BoxModelVisualizer() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const layers: Layer[] = [
    { id: 'margin', label: 'margin', fill: 'var(--see-amber-tint)', stroke: 'var(--dn-amber)', code: 'text-amber', description: '外边距 — 元素和元素之间的距离' },
    { id: 'border', label: 'border', fill: 'var(--see-orange-tint)', stroke: 'var(--dn-orange)', code: 'text-orange', description: '边框 — 元素的边界线' },
    { id: 'padding', label: 'padding', fill: 'var(--see-emerald-tint)', stroke: 'var(--dn-emerald)', code: 'text-emerald', description: '内边距 — 内容和边框之间的距离' },
    { id: 'content', label: '内容', fill: 'var(--see-cyan-tint)', stroke: 'var(--dn-cyan)', code: 'text-cyan', description: '内容区 — 文字或图片所在的地方' },
  ];

  const outerSize = 280;
  const sizes = {
    margin: outerSize,
    border: outerSize - 64,
    padding: outerSize - 128,
    content: outerSize - 176,
  };

  const active = layers.find((l) => l.id === activeLayer) ?? null;

  return (
    <div className="card dn-rise p-5" style={{ '--dn-enter-index': 0 } as CSSProperties}>
      <div className="mb-4">
        <h3 className="font-display text-base">CSS 盒模型</h3>
        <p className="text-[11px] text-text-secondary">每个 HTML 元素都是一个&ldquo;盒子&rdquo;</p>
      </div>

      {/* Toggles：选中态同时有色块、勾号与 aria-pressed，不只靠颜色 */}
      <div className="mb-5 flex flex-wrap gap-2">
        {layers.map((layer) => {
          const selected = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActiveLayer(selected ? null : layer.id)}
              onMouseEnter={() => setActiveLayer(layer.id)}
              onMouseLeave={() => setActiveLayer(null)}
              className={
                'dn-focus dn-interactive flex min-h-[44px] items-center gap-2 border px-3 text-xs font-semibold ' +
                (selected
                  ? 'text-on-color'
                  : 'border-edge bg-surface-alt text-text-secondary')
              }
              style={selected ? { backgroundColor: layer.stroke, borderColor: layer.stroke } : undefined}
            >
              <span aria-hidden="true" className="h-2.5 w-2.5" style={{ backgroundColor: layer.stroke }} />
              {layer.label}
              {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {/* Box model visualization */}
      <div className="mb-5 flex justify-center">
        <svg width={outerSize + 20} height={outerSize + 20} viewBox={'-10 -10 ' + (outerSize + 20) + ' ' + (outerSize + 20)}>
          {/* Margin */}
          <rect
            x={(outerSize - sizes.margin) / 2}
            y={(outerSize - sizes.margin) / 2}
            width={sizes.margin}
            height={sizes.margin}
            fill={layers[0].fill}
            stroke={layers[0].stroke}
            strokeWidth={activeLayer === 'margin' ? 3 : 1.5}
            strokeDasharray="6,3"
            opacity={activeLayer !== null && activeLayer !== 'margin' ? 0.5 : 1}
            className="transition-[fill,stroke,opacity] duration-[380ms] ease-[var(--dn-ease-in)]"
          />

          {/* Border */}
          <rect
            x={(outerSize - sizes.border) / 2}
            y={(outerSize - sizes.border) / 2}
            width={sizes.border}
            height={sizes.border}
            fill={layers[1].fill}
            stroke={layers[1].stroke}
            strokeWidth={activeLayer === 'border' ? 3 : 2}
            opacity={activeLayer !== null && activeLayer !== 'border' ? 0.5 : 1}
            className="transition-[fill,stroke,opacity] duration-[380ms] ease-[var(--dn-ease-in)]"
          />

          {/* Padding */}
          <rect
            x={(outerSize - sizes.padding) / 2}
            y={(outerSize - sizes.padding) / 2}
            width={sizes.padding}
            height={sizes.padding}
            fill={layers[2].fill}
            stroke={layers[2].stroke}
            strokeWidth={activeLayer === 'padding' ? 3 : 1.5}
            opacity={activeLayer !== null && activeLayer !== 'padding' ? 0.5 : 1}
            className="transition-[fill,stroke,opacity] duration-[380ms] ease-[var(--dn-ease-in)]"
          />

          {/* Content */}
          <rect
            x={(outerSize - sizes.content) / 2}
            y={(outerSize - sizes.content) / 2}
            width={sizes.content}
            height={sizes.content}
            fill={layers[3].fill}
            stroke={layers[3].stroke}
            strokeWidth={activeLayer === 'content' ? 3 : 1.5}
            opacity={activeLayer !== null && activeLayer !== 'content' ? 0.5 : 1}
            className="transition-[fill,stroke,opacity] duration-[380ms] ease-[var(--dn-ease-in)]"
          />

          {/* Content text */}
          <text
            x={outerSize / 2}
            y={outerSize / 2 + 4}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-text-primary text-xs font-semibold"
          >
            内容
          </text>

          {/* Annotation lines */}
          {activeLayer &&
            (activeLayer === 'margin' || activeLayer === 'padding') && (
              <g>
                {activeLayer === 'margin' && (
                  <>
                    <line x1={5} y1={outerSize / 2} x2={20} y2={outerSize / 2} stroke={layers[0].stroke} strokeWidth="1.5" />
                    <line x1={5} y1={outerSize / 2 - 20} x2={5} y2={outerSize / 2 + 20} stroke={layers[0].stroke} strokeWidth="1.5" />
                  </>
                )}
                {activeLayer === 'padding' && (
                  <>
                    <line x1={outerSize - 10} y1={outerSize / 2} x2={outerSize - 30} y2={outerSize / 2} stroke={layers[2].stroke} strokeWidth="1.5" />
                  </>
                )}
              </g>
            )}
        </svg>
      </div>

      {/* Code equivalent：代码块统一用 see-code，选中行额外给一个行首标记 */}
      <div className="mb-3 border border-edge">
        <div className="border-b border-edge bg-surface-alt px-3 py-2">
          <span className="see-kicker text-text-secondary">对应的 CSS 代码</span>
        </div>
        <pre className="see-code overflow-x-auto p-4 font-mono text-xs leading-relaxed">
          <code>
            <span aria-hidden="true" className="inline-block w-3 text-on-ink/60">
              {activeLayer === 'margin' ? '▸' : ''}
            </span>
            <span className={activeLayer === 'margin' ? 'font-semibold text-amber' : ''}>margin: 20px;</span>{'\n'}
            <span aria-hidden="true" className="inline-block w-3 text-on-ink/60">
              {activeLayer === 'border' ? '▸' : ''}
            </span>
            <span className={activeLayer === 'border' ? 'font-semibold text-orange' : ''}>border: 2px solid #253B39;</span>{'\n'}
            <span aria-hidden="true" className="inline-block w-3 text-on-ink/60">
              {activeLayer === 'padding' ? '▸' : ''}
            </span>
            <span className={activeLayer === 'padding' ? 'font-semibold text-emerald' : ''}>padding: 16px;</span>{'\n'}
            <span aria-hidden="true" className="inline-block w-3 text-on-ink/60">
              {activeLayer === 'content' ? '▸' : ''}
            </span>
            <span className={activeLayer === 'content' ? 'font-semibold text-cyan' : ''}>width: 200px;</span>
          </code>
        </pre>
      </div>

      {/* Active layer description */}
      {active && (
        <div
          className="border p-3 text-xs leading-relaxed"
          style={{ backgroundColor: active.fill, borderColor: active.stroke }}
        >
          <span className="font-semibold">{active.label}：</span>
          {active.description}
        </div>
      )}
    </div>
  );
}
