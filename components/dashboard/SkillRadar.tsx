'use client';

import { useState } from 'react';
import { loadProgress } from '@/lib/progress';
import { lessons } from '@/lib/lessons';

interface Skill {
  label: string;
  value: number; // 0-100
}

/**
 * 能力雷达。
 *
 * 图形用品牌色，轴线用 DNDL 的 Divider；同时把每个轴的数值
 * 以文本形式列在下方——图形本身对读屏软件没有意义，数值才是信息。
 */
export default function SkillRadar() {
  const [skills] = useState<Skill[]>(() => {
    const progress = loadProgress();
    const lessonEntries = Object.entries(progress.lessons);
    const completedIds = lessonEntries.filter(([, v]) => v.completed).map(([k]) => k);

    const htmlLessons = lessons.filter((l) => l.tags.includes('实践') || l.tags.includes('项目'));
    const jsLessons = lessons.filter((l) => l.tags.includes('项目') && l.difficulty !== 'beginner');
    const promptLessons = lessons.filter((l) => l.tags.includes('技巧'));
    const toolLessons = lessons.filter((l) => l.tags.includes('工具'));
    const conceptLessons = lessons.filter((l) => l.tags.includes('概念'));

    const calcScore = (lessonSet: typeof lessons): number => {
      if (lessonSet.length === 0) return 0;
      const completedInSet = lessonSet.filter((l) => completedIds.includes(l.id)).length;
      return Math.round((completedInSet / lessonSet.length) * 100);
    };

    return [
      { label: 'HTML/CSS', value: calcScore(htmlLessons) },
      { label: 'JavaScript', value: calcScore(jsLessons) },
      { label: '提示词', value: calcScore(promptLessons) },
      { label: '工具使用', value: calcScore(toolLessons) },
      { label: '概念理解', value: calcScore(conceptLessons) },
      {
        label: '动手实践',
        value: completedIds.length > 0
          ? Math.round((completedIds.length / lessons.length) * 100)
          : 0,
      },
    ];
  });

  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 46;

  const angles = skills.map((_, i) => (i * 2 * Math.PI) / skills.length - Math.PI / 2);

  function polygonPoints(vals: number[]): string {
    return vals
      .map((v, i) => {
        const r = (v / 100) * radius;
        const x = cx + r * Math.cos(angles[i]);
        const y = cy + r * Math.sin(angles[i]);
        return `${x},${y}`;
      })
      .join(' ');
  }

  return (
    <section className="card p-5">
      <h3 className="font-display text-lg">能力雷达</h3>
      <p className="mt-1 text-xs text-text-secondary">
        按课程标签统计的完成比例，不是能力测评。
      </p>

      <div className="mt-4 flex justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
          {[0.25, 0.5, 0.75, 1].map((scale) => (
            <polygon
              key={scale}
              points={polygonPoints(skills.map(() => scale * 100))}
              fill="none"
              stroke="var(--dn-divider)"
              strokeWidth="1"
            />
          ))}

          {angles.map((angle, i) => {
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="var(--dn-divider)"
                strokeWidth="1"
              />
            );
          })}

          <polygon
            points={polygonPoints(skills.map((s) => s.value))}
            fill="var(--dn-teal)"
            fillOpacity="0.22"
            stroke="var(--dn-teal)"
            strokeWidth="2"
          />

          {skills.map((skill, i) => {
            const labelR = radius + 26;
            const x = cx + labelR * Math.cos(angles[i]);
            const y = cy + labelR * Math.sin(angles[i]);
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fontWeight="600"
                fill="var(--dn-text-primary)"
              >
                {skill.label}
              </text>
            );
          })}
        </svg>
      </div>

      <ul className="mt-4 border-t border-edge">
        {skills.map((skill) => (
          <li
            key={skill.label}
            className="flex min-h-[40px] items-center gap-3 border-b border-edge text-sm last:border-b-0"
          >
            <span className="flex-1">{skill.label}</span>
            <span className="h-2 w-24 bg-surface-raised" aria-hidden="true">
              <span className="block h-full bg-teal" style={{ width: skill.value + '%' }} />
            </span>
            <span className="w-10 text-right tabular-nums text-text-secondary">
              {skill.value}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
