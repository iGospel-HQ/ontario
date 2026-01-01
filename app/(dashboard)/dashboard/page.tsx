import { DashboardStats } from "@/components/dashboard-stats"
import { WithdrawalSection } from "@/components/withdrawal-section"
import { TransactionsTable } from "@/components/transactions-table"
import { WithdrawalsTable } from "@/components/withdrawals-table"
import { GiftsTable } from "@/components/gifts-table"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardStats />
      <WithdrawalSection />
      <TransactionsTable />
      <WithdrawalsTable />
      <GiftsTable />
    </div>
  )
}
