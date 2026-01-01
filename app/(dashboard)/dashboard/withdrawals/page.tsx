import { WithdrawalSection } from "@/components/withdrawal-section"
import { WithdrawalsTable } from "@/components/withdrawals-table"

export default function WithdrawalsPage() {
  return (
    <div className="space-y-6">
      <WithdrawalSection />
      <WithdrawalsTable />
    </div>
  )
}
