import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function WithdrawalSectionSkeleton() {
  return (
    <>
      {/* Wallet Balance Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-56" />
        </CardContent>
      </Card>

      {/* Withdrawals Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Bank details */}
          <div className="rounded-lg border p-4 space-y-3">
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-3 w-40 ml-6" />
            <Skeleton className="h-3 w-28 ml-6" />
            <Skeleton className="h-8 w-24 mt-3" />
          </div>

          {/* PIN status */}
          <div className="rounded-lg border p-4 flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-8 w-28" />
          </div>

          {/* Withdraw button */}
          <div className="space-y-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-3 w-3/4 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
