import { Eye, Users, TrendingUp, Calendar } from "lucide-react"

export function BlogStats({
  totalVisitors,
  totalViews,
  todayVisitors,
  todayViews,
}: {
  totalVisitors: number
  totalViews: number
  todayVisitors: number
  todayViews: number
}) {
  return (
    <div className="my-8">
      <div
        className="
          grid grid-cols-2 md:grid-cols-2 gap-4
          p-6
        "
      >
        {/* Total Visitors */}
        {/* <StatCard
          icon={<Users />}
          label="Total Visitors"
          value={totalVisitors}
          accent="text-blue-500"
        /> */}

        {/* Total Views */}
        <StatCard
          icon={<Eye />}
          label="Total Views"
          value={totalViews}
          accent="text-violet-500"
        />

        {/* Today Visitors */}
        {/* <StatCard
          icon={<Calendar />}
          label="Today Visitors"
          value={todayVisitors}
          accent="text-emerald-500"
        /> */}

        {/* Today Views */}
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
  icon: React.ReactNode
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
        <p className="text-lg font-bold">{value.toLocaleString()}</p>
      </div>
    </div>
  )
}
