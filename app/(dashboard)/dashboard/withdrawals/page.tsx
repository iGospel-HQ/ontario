import { WithdrawalSection } from "@/components/dashboard/withdrawal-section"
import { WithdrawalsTable } from "@/components/dashboard/withdrawals-table"

export default function WithdrawalsPage() {
  return (
    <div className="space-y-6">
      <WithdrawalSection />
      <WithdrawalsTable />
    </div>
  )
}
