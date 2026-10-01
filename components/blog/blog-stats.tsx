import type { ReactNode } from "react"
import { CalendarCheck, Eye, TrendingUp, Users } from "lucide-react"

export interface TrafficStats {
  total_visitors: number
  total_views: number
  today_visitors: number
  today_views: number
}

/** Visitor and page-view counters shown under a post. */
export function BlogStats({ stats }: { stats: TrafficStats }) {
  return (
    <div className="my-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        <StatCard icon={<Users />} label="Total Visitors" value={stats.total_visitors} accent="text-blue-500" />
        <StatCard icon={<Eye />} label="Total Page Visits" value={stats.total_views} accent="text-violet-500" />
        <StatCard icon={<CalendarCheck />} label="Today's Visitors" value={stats.today_visitors} accent="text-emerald-500" />
        <StatCard icon={<TrendingUp />} label="Today's Page Visits" value={stats.today_views} accent="text-orange-500" />
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode
  label: string
  value: number
  accent: string
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`
          w-10 h-10
          rounded-xl
          flex items-center justify-center
          bg-background
          ${accent}
          shadow-sm
        `}
      >
        {icon}
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{(value ?? 0).toLocaleString("en-US")}</p>
      </div>
    </div>
  )
}
