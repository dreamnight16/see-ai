import Link from "next/link";
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
} from "lucide-react";
import type { Track } from "@/lib/tracks";
import { lessons } from "@/lib/lessons";
import type { ComponentType } from "react";

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

const COLOR_STYLES: Record<string, { chip: string; ring: string; text: string }> = {
  accent: { chip: "bg-accent-soft", ring: "group-hover:border-accent/40", text: "text-accent" },
  success: { chip: "bg-success-soft", ring: "group-hover:border-success/40", text: "text-success" },
  warning: { chip: "bg-warning-soft", ring: "group-hover:border-warning/40", text: "text-warning" },
  info: { chip: "bg-info-soft", ring: "group-hover:border-info/40", text: "text-info" },
};

interface TrackCardProps {
  track: Track;
  /** 卡片上第一节课的链接锚点 */
  startLessonId?: string;
}

export default function TrackCard({ track, startLessonId }: TrackCardProps) {
  const trackLessons = lessons.filter((l) => l.track === track.id);
  const minutes = trackLessons.reduce((sum, l) => sum + l.estimatedMinutes, 0);
  const Icon = ICONS[track.icon] ?? Sprout;
  const style = COLOR_STYLES[track.color] ?? COLOR_STYLES.accent;
  const first = startLessonId ?? trackLessons[0]?.id;

  return (
    <div
      className={
        "card p-6 flex flex-col h-full transition-all duration-300 group " + style.ring
      }
    >
      <div className="flex items-start gap-3.5 mb-4">
        <span
          className={
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 " +
            style.chip +
            " " +
            style.text
          }
        >
          <Icon className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold leading-tight">{track.name}</h3>
          <p className={"text-xs mt-1 " + style.text}>{track.tagline}</p>
        </div>
      </div>

      <p className="text-sm text-muted leading-relaxed flex-1">{track.description}</p>

      <div className="mt-4 pt-4 border-t border-edge flex items-center justify-between gap-3">
        <span className="text-[11px] text-faint">
          {trackLessons.length} 节课 · 约 {minutes} 分钟
        </span>
        {first && (
          <Link
            href={"/lesson/" + first}
            className={
              "inline-flex items-center gap-1 text-xs font-medium transition-all " +
              style.text +
              " hover:gap-2"
            }
          >
            开始
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
