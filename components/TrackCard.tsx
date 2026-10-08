import Link from 'next/link';
import {
  Coffee,
  Briefcase,
  Palette,
  ShieldCheck,
  Target,
  Code,
  Sprout,
  Bot,
  Rocket,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import type { Track } from '@/lib/tracks';
import { lessons } from '@/lib/lessons';
import { trackVisual } from '@/components/track-visuals';
import type { ComponentType } from 'react';

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Sprout,
  GraduationCap,
  ShieldCheck,
  Target,
  Bot,
  Rocket,
  Palette,
  Briefcase,
  Coffee,
  Code,
};

interface TrackCardProps {
  track: Track;
  /** 在整张课程表里的序号，显示成 01 / 02 … */
  index: number;
  /** 卡片上第一节课的链接锚点 */
  startLessonId?: string;
}

/**
 * 一条轨道 = 一块品牌实色色块。
 *
 * 文字全部用 --dn-text-on-color；层级靠字号和字重拉开，不靠降低不透明度，
 * 因为透明度会直接吃掉对比度。整块可点击，键盘焦点由 .dn-focus 提供。
 */
export default function TrackCard({ track, index, startLessonId }: TrackCardProps) {
  const trackLessons = lessons.filter((l) => l.track === track.id);
  const minutes = trackLessons.reduce((sum, l) => sum + l.estimatedMinutes, 0);
  const Icon = ICONS[track.icon] ?? Sprout;
  const visual = trackVisual(track.color);
  const first = startLessonId ?? trackLessons[0]?.id;
  const projectCount = trackLessons.filter((l) => l.type === 'project').length;

  const body = (
    <article
      className={
        'dn-interactive flex h-full flex-col p-5 sm:p-6 ' + visual.field
      }
    >
      <div className="flex items-start justify-between gap-4">
        <span className="see-kicker tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>
        <Icon className="h-7 w-7 shrink-0" aria-hidden="true" />
      </div>

      <h3 className="font-display mt-10 text-3xl leading-[1.1] sm:text-[2rem]">
        {track.name}
      </h3>
      <p className="mt-2.5 text-sm font-semibold">{track.tagline}</p>
      <p className="mt-3 text-[13px] leading-relaxed">{track.description}</p>

      <div className="mt-auto pt-6">
        <p className="text-xs">
          写给：{track.audience}
        </p>
        <p className="mt-1.5 text-xs tabular-nums">
          {trackLessons.length} 节课 · 约 {minutes} 分钟
          {projectCount > 0 ? ` · ${projectCount} 个实战` : ''}
        </p>
      </div>
    </article>
  );

  if (!first) return body;

  return (
    <Link
      href={'/lesson/' + first}
      className="dn-focus block h-full"
      aria-label={`进入「${track.name}」轨道`}
    >
      {body}
    </Link>
  );
}

/** 紧凑索引行：不展开内容，只作为课程表里的入口 */
export function TrackRow({ track }: { track: Track }) {
  const visual = trackVisual(track.color);
  const trackLessons = lessons.filter((l) => l.track === track.id);
  const Icon = ICONS[track.icon] ?? Sprout;
  const first = trackLessons[0]?.id;

  return (
    <li className="border-b border-edge last:border-b-0">
      <Link
        href={first ? '/lesson/' + first : '/'}
        className="dn-focus group flex min-h-[64px] items-center gap-4 px-4 py-3 hover:bg-surface-alt"
      >
        <span
          className={
            'flex h-10 w-10 shrink-0 items-center justify-center ' + visual.field
          }
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold">{track.name}</span>
          <span className="mt-0.5 block truncate text-xs text-text-secondary">
            {track.tagline}
          </span>
        </span>
        <span className="hidden shrink-0 text-xs tabular-nums text-text-secondary sm:block">
          {trackLessons.length} 节
        </span>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-text-secondary group-hover:text-text-primary"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}
