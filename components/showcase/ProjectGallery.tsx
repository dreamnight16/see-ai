'use client';

import { useState } from 'react';
import type { SavedProject } from '@/lib/projects';
import { loadProjects, deleteProject } from '@/lib/projects';
import { Trash2, Eye, Code2, Calendar, Sparkles, Download } from 'lucide-react';
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
      <div className="text-center py-16 animate-fade-in">
        <Code2 className="w-16 h-16 text-faint/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">还没有作品</h2>
        <p className="text-muted mb-6 max-w-md mx-auto">
          去课程里打开 Playground，先做出你的第一个网页作品。卡住时，再叫助手帮一把。
        </p>
        <Link
          href="/lesson/3-1"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          开始创作
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <div
            key={project.id}
            className="card p-5 group cursor-pointer animate-pop-in hover:border-accent/20"
            style={{ animationDelay: `${i * 60}ms` }}
            onClick={() => setSelected(selected?.id === project.id ? null : project)}
          >
            {/* Title */}
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0">
                <h4 className="font-display font-bold text-sm truncate group-hover:text-accent transition-colors">
                  {project.title || '未命名作品'}
                </h4>
                <p className="text-[10px] text-faint flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {new Date(project.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
              {project.lessonId && (
                <Link
                  href={`/lesson/${project.lessonId}`}
                  className="text-[9px] px-2 py-0.5 rounded-full bg-accent-soft text-accent font-medium shrink-0 hover:bg-accent/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  课程
                </Link>
              )}
            </div>

            {/* Code preview */}
            <div className="p-3 rounded-lg bg-surface-alt border border-edge/50 mb-3">
              <code className="text-[10px] text-muted font-mono line-clamp-3 leading-relaxed">
                {getCodePreview(project.code)}
              </code>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); handlePreview(project); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] text-muted hover:text-accent hover:bg-accent-soft/50 transition-all"
              >
                <Eye className="w-3 h-3" /> 预览
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setExportProject(project); setShowExport(true); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] text-muted hover:text-accent hover:bg-accent-soft/50 transition-all"
              >
                <Download className="w-3 h-3" /> 导出
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-faint hover:text-accent hover:bg-accent-soft/50 transition-all ml-auto"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Export dialog */}
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
