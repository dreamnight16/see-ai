interface Props {
  completed: number
  total: number
  label?: string
}

const MILESTONES = [0, 25, 50, 75, 100]

/**
 * 直角进度条。状态同时用「填充长度 + 文字百分比 + 刻度」表达，
 * 不只靠颜色，色觉差异下同样可读。
 */
export default function ProgressBar({ completed, total, label }: Props) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const isDone = pct === 100

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4">
        {label ? <span className="text-sm font-semibold">{label}</span> : <span />}
        <span className="text-sm tabular-nums text-text-secondary">
          <span className="font-semibold text-text-primary">{completed}</span>
          <span> / {total}</span>
          <span className="ml-2 font-semibold text-text-primary">{pct}%</span>
        </span>
      </div>

      <div
        className="h-3 w-full bg-surface-raised"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completed}
        aria-valuetext={`${completed} / ${total}，${pct}%`}
      >
        <div
          className={'h-full transition-[width] duration-[380ms] ease-[var(--dn-ease-in)] ' + (isDone ? 'bg-emerald' : 'bg-teal')}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between" aria-hidden="true">
        {MILESTONES.map((milestone) => (
          <span
            key={milestone}
            className={
              'h-1.5 w-1.5 ' + (pct >= milestone ? (isDone ? 'bg-emerald' : 'bg-teal') : 'bg-surface-raised')
            }
          />
        ))}
      </div>
    </div>
  )
}
