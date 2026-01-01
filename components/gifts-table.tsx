"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
// import { getGifts } from "@/lib/api"
import { format } from "date-fns"

export function GiftsTable() {
  const gifts: any[] = []
  const isLoading = false
  // const { data: gifts = [], isLoading } = useQuery({
  //   queryKey: ["gifts"],
  //   queryFn: getGifts,
  // })


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gift History</CardTitle>
        <CardDescription>Records of users who sent gifts/supports</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted" />
            ))}
          </div>
        ) : gifts.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No gifts received yet</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gifts.map((gift) => (
                  <TableRow key={gift.id}>
                    <TableCell className="font-medium">{gift.sender}</TableCell>
                    <TableCell className="max-w-md">
                      {gift.message ? (
                        <p className="truncate text-sm text-muted-foreground">{gift.message}</p>
                      ) : (
                        <span className="text-sm italic text-muted-foreground">No message</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(gift.amount)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(gift.createdAt), "MMM dd, yyyy HH:mm")}
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
