import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { TransactionsTable } from "@/components/dashboard/transactions-table"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardStats />
      <TransactionsTable />
    </div>
  )
}
