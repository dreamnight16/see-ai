'use client'

import { useSyncExternalStore } from 'react'
import { loadProgress, subscribe } from '@/lib/progress'
import ProgressBar from './ProgressBar'

/**
 * 学习进度只存在用户自己的浏览器里。
 * 用 useSyncExternalStore 订阅本地进度：服务端快照恒为 0，
 * 水合之后才切到真实值；没有记录时给明确的静态回退，不编造任何数据。
 */
function countCompleted(): number {
  return Object.values(loadProgress().lessons).filter((l) => l.completed).length
}

const serverSnapshot = () => 0

export default function TotalProgress({ total }: { total: number }) {
  const completed = useSyncExternalStore(subscribe, countCompleted, serverSnapshot)
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const isDone = pct === 100

  return (
    <div className="space-y-3">
      {isDone ? (
        <p className="text-sm font-semibold">全部 {total} 节都学完了，接下来就是拿去用。</p>
      ) : completed > 0 ? (
        <p className="text-sm">
          已学完 <span className="font-semibold tabular-nums">{completed}</span> 节课，
          还剩 <span className="tabular-nums">{total - completed}</span> 节。
        </p>
      ) : (
        <p className="text-sm text-text-secondary">
          这台设备上还没有学习记录。进度保存在你自己的浏览器里，不会上传。
        </p>
      )}
      <ProgressBar completed={completed} total={total} label="学习进度" />
    </div>
  )
}
