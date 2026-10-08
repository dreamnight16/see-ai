'use client';

import VibeCodingFlow from '@/components/visualizations/VibeCodingFlow';
import TokenStream from '@/components/visualizations/TokenStream';
import DomTree from '@/components/visualizations/DomTree';
import BoxModelVisualizer from '@/components/visualizations/BoxModelVisualizer';
import ToolHeader from '@/components/shell/ToolHeader';

const DEMOS = [
  {
    id: 'flow',
    title: 'Vibe Coding 完整流程',
    lead: '从一句大白话到能打开的网页，中间到底发生了什么。',
    node: <VibeCodingFlow />,
  },
  {
    id: 'tokens',
    title: '代码是怎样一步步写出来的',
    lead: '模型是逐段预测下一个词，而不是先想好整段再一次性写出来。',
    node: <TokenStream />,
  },
  {
    id: 'dom',
    title: 'HTML → DOM 树',
    lead: '浏览器把标签和嵌套关系解析成一棵树，再据此决定每个元素的样子。',
    node: <DomTree />,
  },
  {
    id: 'box',
    title: 'CSS 盒模型',
    lead: '每个元素都是一个盒子：内容、内边距、边框、外边距，一层套一层。',
    node: <BoxModelVisualizer />,
  },
];

export default function VisualizationsClient() {
  return (
    <div>
      <ToolHeader
        kicker="可视化演示 · 四个概念"
        title="有些东西看一遍比读十遍清楚"
        lead="这四个演示对应课程里的四个关键概念。每一个都可以暂停、重播，也可以只看静态结果——动画只是解释过程，不是理解的前提。"
        field="bg-violet text-on-color"
        facts={[
          { value: String(DEMOS.length), label: '个可交互演示' },
          { value: '可暂停', label: '每个都能停在任意一步' },
        ]}
        footnote="所有演示都是本地 SVG 与 CSS 动画，不请求任何接口；开启「减少动态效果」时不会自动播放。"
      />

      <div className="mx-auto max-w-[var(--see-shell)] space-y-[3px] px-[var(--see-gutter)] py-10">
        {DEMOS.map((demo, i) => (
          <section
            key={demo.id}
            className="dn-rise"
            style={{ ['--dn-enter-index' as string]: i }}
            aria-labelledby={`demo-${demo.id}`}
          >
            <h2 id={`demo-${demo.id}`} className="sr-only">
              {demo.title}
            </h2>
            <p className="mb-2 max-w-[62ch] text-sm leading-relaxed text-text-secondary">
              {demo.lead}
            </p>
            {demo.node}
          </section>
        ))}
      </div>
    </div>
  );
}
