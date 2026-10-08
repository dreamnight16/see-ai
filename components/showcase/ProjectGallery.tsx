'use client';

import { useState } from 'react';
import type { SavedProject } from '@/lib/projects';
import { loadProjects, deleteProject } from '@/lib/projects';
import { Trash2, Eye, Code2, Calendar, Download, Sparkles } from 'lucide-react';
import ExportDialog from './ExportDialog';
import Link from 'next/link';

export default function ProjectGallery() {
  const [projects, setProjects] = useState<SavedProject[]>(() => loadProjects());
  const [selected, setSelected] = useState<SavedProject | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [exportProject, setExportProject] = useState<SavedProject | null>(null);

  function handleDelete(id: string) {
    deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function handlePreview(project: SavedProject) {
    const blob = new Blob([project.code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function getCodePreview(code: string, maxLen = 150): string {
    return code.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLen) + '...';
  }

  if (projects.length === 0) {
    return (
      <div className="border border-edge bg-surface px-6 py-14 text-center">
        <Code2 className="mx-auto h-11 w-11 text-text-secondary" aria-hidden="true" />
        <h2 className="font-display mt-5 text-2xl">还没有作品</h2>
        <p className="mx-auto mt-3 max-w-[46ch] text-sm leading-relaxed text-text-secondary">
          去课程里打开「网页小工坊」，先做出你的第一个网页作品。卡住时，再叫助手帮一把。
        </p>
        <Link
          href="/lesson/3-1"
          className="dn-focus dn-interactive mt-6 inline-flex min-h-[48px] items-center gap-2 bg-teal px-6 text-sm font-semibold text-on-color"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          开始创作
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ul className="grid gap-[3px] md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => {
          const isSelected = selected?.id === project.id;
          return (
            <li
              key={project.id}
              className={
                "dn-rise flex flex-col border bg-surface " +
                (isSelected ? "border-teal" : "border-edge")
              }
              style={{ ["--dn-enter-index" as string]: Math.min(i, 12) }}
            >
              <div className="flex items-start justify-between gap-3 border-b border-edge px-4 py-3">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base leading-tight">
                    {project.title || '未命名作品'}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    <span className="tabular-nums">
                      {new Date(project.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  </p>
                </div>
                {project.lessonId && (
                  <Link
                    href={`/lesson/${project.lessonId}`}
                    className="dn-focus inline-flex min-h-[36px] shrink-0 items-center bg-violet px-2.5 text-[11px] font-semibold text-on-color"
                  >
                    来自这一课
                  </Link>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelected(isSelected ? null : project)}
                aria-expanded={isSelected}
                className="dn-focus block flex-1 bg-canvas p-4 text-left hover:bg-surface-alt"
              >
                <code className="line-clamp-3 block font-mono text-[11px] leading-relaxed text-text-primary">
                  {getCodePreview(project.code)}
                </code>
                <span className="mt-3 inline-block text-[11px] font-semibold text-teal-ink">
                  {isSelected ? '收起代码摘要' : '展开完整代码摘要'}
                </span>
              </button>

              {isSelected && (
                <pre className="max-h-48 overflow-auto border-t border-edge bg-canvas p-4 font-mono text-[11px] leading-relaxed text-text-primary">
                  <code>{project.code.slice(0, 600)}</code>
                </pre>
              )}

              <div className="flex items-center gap-1 border-t border-edge px-2 py-1.5">
                <button
                  type="button"
                  onClick={() => handlePreview(project)}
                  className="dn-focus inline-flex min-h-[44px] items-center gap-1.5 px-2.5 text-xs font-semibold text-text-primary hover:bg-surface-alt"
                >
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" /> 预览
                </button>
                <button
                  type="button"
                  onClick={() => { setExportProject(project); setShowExport(true); }}
                  className="dn-focus inline-flex min-h-[44px] items-center gap-1.5 px-2.5 text-xs font-semibold text-text-primary hover:bg-surface-alt"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" /> 导出
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(project.id)}
                  aria-label={`删除作品 ${project.title || '未命名作品'}`}
                  className="dn-focus ml-auto inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 px-2.5 text-xs font-semibold text-crimson-ink hover:bg-crimson-tint"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  删除
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {showExport && exportProject && (
        <ExportDialog
          code={exportProject.code}
          title={exportProject.title}
          onClose={() => { setShowExport(false); setExportProject(null); }}
        />
      )}
    </div>
  );
}
