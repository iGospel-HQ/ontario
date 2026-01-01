"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
// import { getWithdrawals } from "@/lib/api"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export function WithdrawalsTable() {
  const withdrawals: any[] = []
  const isLoading = false
  // const { data: withdrawals = [], isLoading } = useQuery({
  //   queryKey: ["withdrawals"],
  //   queryFn: getWithdrawals,
  // })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "failed":
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal History</CardTitle>
        <CardDescription>Track your withdrawal requests</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted" />
            ))}
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No withdrawals found</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell className="font-mono text-sm">{withdrawal.reference}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(withdrawal.amount)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{withdrawal.bank}</p>
                        <p className="text-sm text-muted-foreground">{withdrawal.accountNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(withdrawal.status)}>
                        {withdrawal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(withdrawal.createdAt), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
