import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  accented?: boolean
}

export function StatCard({ title, value, icon: Icon, accented = false }: StatCardProps) {
  return (
    <Card className={cn(accented && "border-accent bg-accent/5")}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={cn("text-sm font-medium", accented ? "text-accent" : "text-muted-foreground")}>{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          </div>
          <div
            className={cn(
              "rounded-lg p-3",
              accented ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
