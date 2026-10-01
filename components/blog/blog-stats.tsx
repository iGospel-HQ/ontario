import type { ReactNode } from "react"
import { Eye, TrendingUp } from "lucide-react"

export function BlogStats({
  totalViews,
  todayViews,
}: {
  totalVisitors?: number
  totalViews: number
  todayVisitors?: number
  todayViews: number
}) {
  return (
    <div className="my-8">
      <div
        className="
          grid grid-cols-2 md:grid-cols-3 gap-4
          p-6
        "
      >
        <StatCard
          icon={<Eye />}
          label="Total Views"
          value={totalViews}
          accent="text-violet-500"
        />

        <StatCard
          icon={<TrendingUp />}
          label="Today Views"
          value={todayViews}
          accent="text-orange-500"
        />
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
