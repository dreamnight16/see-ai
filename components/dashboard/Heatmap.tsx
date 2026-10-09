'use client';

import { useHeatmap } from '@/hooks/useHeatmap';
import { useHydrated } from '@/hooks/useHydrated';

/**
 * 五档强度全部取自品牌 Teal 的同色阶梯，而不是另一套暖色；
 * 0 档用 DNDL 的 Divider，保证空和有是最容易分辨的一对。
 * 每个格子都有 title 文本（日期 + XP），颜色不是唯一的信息。
 */
const COLORS = ['#E1E9E7', '#DEEEED', '#ACD4D2', '#82BFBB', '#59AAA5'];
const LEVEL_LABELS = ['无记录', '少量', '一些', '较多', '最多'];

export default function Heatmap() {
  // 格子上的日期与颜色都取决于"今天"和本地进度，两者服务端都拿不到：
  // 水合完成前只渲染标题、统计和占位块，避免水合前后对不上（React #418）
  const hydrated = useHydrated();
  const { data } = useHeatmap(hydrated);

  const weeks: typeof data[] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const CELL = 12;
  const GAP = 2;
  const LABELS = ['', '一', '', '三', '', '五', ''];
  const totalXp = data.reduce((sum, day) => sum + day.xp, 0);
  const activeDays = data.filter((day) => day.xp > 0).length;

  return (
    <section className="card p-5">
      <h3 className="font-display text-lg">学习热力图</h3>
      <p className="mt-1 text-xs text-text-secondary">
        最近 52 周。有记录的 <span className="tabular-nums font-semibold text-text-primary">{activeDays}</span> 天，
        合计 <span className="tabular-nums font-semibold text-text-primary">{totalXp}</span> XP。
      </p>

      {!hydrated && <div className="mt-4 h-[118px]" aria-hidden="true" />}

      <div className={`mt-4 overflow-x-auto${hydrated ? '' : ' hidden'}`}>
        <svg
          width={weeks.length * (CELL + GAP) + 24}
          height={CELL * 7 + GAP * 6 + 22}
          aria-hidden="true"
        >
          {LABELS.map((label, i) => (
            <text
              key={i}
              x={0}
              y={i * (CELL + GAP) + CELL - 2}
              fontSize="8"
              fill="var(--dn-text-secondary)"
              textAnchor="start"
            >
              {label}
            </text>
          ))}

          <g transform="translate(20, 0)">
            {weeks.map((week, wi) =>
              week.map((day, di) => (
                <rect
                  key={`${wi}-${di}`}
                  x={wi * (CELL + GAP)}
                  y={di * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  fill={COLORS[day.level]}
                >
                  <title>{`${day.date}：${day.xp} XP（${LEVEL_LABELS[day.level]}）`}</title>
                </rect>
              )),
            )}
          </g>
        </svg>
      </div>

      <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <li className="text-[11px] text-text-secondary">少</li>
        {COLORS.map((color, i) => (
          <li key={i} className="flex items-center gap-1.5 text-[11px] text-text-secondary">
            <span className="h-2.5 w-2.5" style={{ backgroundColor: color }} aria-hidden="true" />
            {LEVEL_LABELS[i]}
          </li>
        ))}
        <li className="text-[11px] text-text-secondary">多</li>
      </ul>
    </section>
  );
}
