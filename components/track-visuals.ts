import type { TrackColor } from '@/lib/tracks';

/**
 * 轨道配色 → 具体类名。
 *
 * Tailwind 只能看到源码里字面出现的类名，所以这里必须写全，不能拼接。
 *
 * field：品牌实色块。其上文字一律用 --dn-text-on-color，
 *        八种品牌色与该色的对比度均在 5.0:1 以上（实测 5.09–7.15）。
 * tint ：同色 14% 淡底，只用于大面积低对比区域，其上用 --dn-text-primary。
 * ink  ：同色的可读性派生值，只用于浅色底上的普通字号彩色文字。
 */
export interface TrackVisual {
  /** 实色块：品牌色 + 安全文字色 */
  field: string;
  /** 淡底 + 派生墨色 */
  tint: string;
  /** 派生墨色文字，用于浅底 */
  ink: string;
  /** 实色装饰条 / 进度条 */
  bar: string;
  /** 边框 */
  border: string;
}

export const TRACK_VISUALS: Record<TrackColor, TrackVisual> = {
  teal: {
    field: 'bg-teal text-on-color',
    tint: 'bg-teal-tint text-text-primary',
    ink: 'text-teal-ink',
    bar: 'bg-teal',
    border: 'border-teal',
  },
  cyan: {
    field: 'bg-cyan text-on-color',
    tint: 'bg-cyan-tint text-text-primary',
    ink: 'text-cyan-ink',
    bar: 'bg-cyan',
    border: 'border-cyan',
  },
  emerald: {
    field: 'bg-emerald text-on-color',
    tint: 'bg-emerald-tint text-text-primary',
    ink: 'text-emerald-ink',
    bar: 'bg-emerald',
    border: 'border-emerald',
  },
  violet: {
    field: 'bg-violet text-on-color',
    tint: 'bg-violet-tint text-text-primary',
    ink: 'text-violet-ink',
    bar: 'bg-violet',
    border: 'border-violet',
  },
  amber: {
    field: 'bg-amber text-on-color',
    tint: 'bg-amber-tint text-text-primary',
    ink: 'text-amber-ink',
    bar: 'bg-amber',
    border: 'border-amber',
  },
  orange: {
    field: 'bg-orange text-on-color',
    tint: 'bg-orange-tint text-text-primary',
    ink: 'text-orange-ink',
    bar: 'bg-orange',
    border: 'border-orange',
  },
  steel: {
    field: 'bg-steel text-on-color',
    tint: 'bg-steel-tint text-text-primary',
    ink: 'text-steel-ink',
    bar: 'bg-steel',
    border: 'border-steel',
  },
  crimson: {
    field: 'bg-crimson text-on-color',
    tint: 'bg-crimson-tint text-text-primary',
    ink: 'text-crimson-ink',
    bar: 'bg-crimson',
    border: 'border-crimson',
  },
};

export function trackVisual(color: TrackColor): TrackVisual {
  return TRACK_VISUALS[color] ?? TRACK_VISUALS.steel;
}
