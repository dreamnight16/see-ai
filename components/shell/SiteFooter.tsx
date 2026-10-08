import Link from 'next/link';
import { lessons } from '@/lib/lessons';

/**
 * 全站页脚。原来只挂在首页，现在收进 shell——
 * 课程页和工具页也需要一条明确的「这是哪儿、还能去哪儿」的出口。
 */
export default function SiteFooter() {
  return (
    <footer className="mt-[var(--see-section)] border-t border-edge bg-surface">
      <div className="mx-auto grid max-w-[var(--see-shell)] gap-8 px-[var(--see-gutter)] py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center bg-teal text-sm font-semibold text-on-color">
              见
            </span>
            <span className="font-display text-lg">见 AI</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-text-secondary">
            面向非专业大学生的 AI 入门课。不讲模型原理，只讲怎么用，以及什么时候别用。
          </p>
        </div>

        <nav aria-label="课程" className="text-sm">
          <h2 className="see-kicker text-text-secondary">课程</h2>
          <ul className="mt-3 space-y-1">
            <li><Link className="see-link text-text-primary" href="/">十条轨道，{lessons.length} 节课</Link></li>
            <li><Link className="see-link text-text-primary" href="/start">四道题排顺序</Link></li>
            <li><Link className="see-link text-text-primary" href="/visualizations">可视化演示</Link></li>
          </ul>
        </nav>

        <nav aria-label="工具" className="text-sm">
          <h2 className="see-kicker text-text-secondary">不联网也能用</h2>
          <ul className="mt-3 space-y-1">
            <li><Link className="see-link text-text-primary" href="/prompts">提示词库</Link></li>
            <li><Link className="see-link text-text-primary" href="/practice">提示词练习场</Link></li>
            <li><Link className="see-link text-text-primary" href="/glossary">AI 名词表</Link></li>
            <li><Link className="see-link text-text-primary" href="/trends">本周热词</Link></li>
          </ul>
        </nav>

        <div className="text-sm">
          <h2 className="see-kicker text-text-secondary">这个项目</h2>
          <ul className="mt-3 space-y-1">
            <li>
              <a className="see-link text-text-primary" href="https://dreamnight.net.cn">
                返回 DreamNight 博客
              </a>
            </li>
            <li>
              <a className="see-link text-text-primary" href="https://github.com/dreamnight16/see-ai">
                源代码（MIT）
              </a>
            </li>
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-text-secondary">
            视觉遵循 DreamNight Design Language v1.0（实现 1.1.0），品牌色板与核心语言未作修改。
          </p>
        </div>
      </div>
    </footer>
  );
}
