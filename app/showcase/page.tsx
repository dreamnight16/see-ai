import type { Metadata } from 'next';
import ProjectGallery from '@/components/showcase/ProjectGallery';
import ToolHeader from '@/components/shell/ToolHeader';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '我的作品 - 见 AI',
};

export default function ShowcasePage() {
  return (
    <div>
      <ToolHeader
        kicker="我的作品 · 存在这台设备上"
        title="做出来的东西，都收在这里"
        lead="在课程的「网页小工坊」里生成并保存过的页面会出现在这里。可以预览、导出成 HTML，或者直接发布上网。"
        field="bg-orange text-on-color"
        facts={[
          { value: '本地', label: '作品只保存在你自己的浏览器里' },
          { value: 'HTML', label: '导出的是单文件，双击就能打开' },
        ]}
        footnote="没有作品时这里会明说没有，不显示任何示例占位。"
      />

      <div className="mx-auto max-w-[var(--see-shell)] px-[var(--see-gutter)] py-10">
        <ProjectGallery />

        <div className="mt-12 border-t border-edge pt-8">
          <Link
            href="/lesson/3-1"
            className="dn-focus dn-interactive inline-flex min-h-[48px] items-center gap-2 bg-teal px-6 text-sm font-semibold text-on-color"
          >
            继续创作
          </Link>
        </div>
      </div>
    </div>
  );
}
