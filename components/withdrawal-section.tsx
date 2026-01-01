"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
// import { getDashboardStats, getBankDetails } from "@/lib/api"
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

const MIN_WITHDRAWAL_AMOUNT = 5000;

export function WithdrawalSection() {
  const [isBankSetupOpen, setIsBankSetupOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const stats: any = {};
  const bankDetails: any = null;
  // const { data: stats } = useQuery({
  //   queryKey: ["dashboard-stats"],
  //   queryFn: getDashboardStats,
  // })

  // const { data: bankDetails } = useQuery({
  //   queryKey: ["bank-details"],
  //   queryFn: getBankDetails,
  // })

  const availableBalance = stats?.availableBalance ?? 0;
  const canWithdraw =
    availableBalance >= MIN_WITHDRAWAL_AMOUNT && !!bankDetails;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bank Details Status */}
        <div className="flex items-start justify-between rounded-lg border p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {bankDetails ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Bank Account Configured</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">
                    No Bank Account Configured
                  </span>
                </>
              )}
            </div>
            {bankDetails && (
              <div className="ml-7 text-sm text-muted-foreground">
                <p>
                  {bankDetails.accountName} - {bankDetails.bankName}
                </p>
                <p>{bankDetails.accountNumber}</p>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsBankSetupOpen(true);
              console.log(" Open bank setup modal");
            }}
          >
            {bankDetails ? "Change" : "Setup"}
          </Button>
        </div>

        {/* Withdraw Button */}
        <div className="space-y-2">
          <Button
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            size="lg"
            disabled={!canWithdraw}
            onClick={() => {
              setIsWithdrawOpen(true);
              console.log(" Open withdraw modal");
            }}
          >
            Withdraw Funds
          </Button>
          {availableBalance < MIN_WITHDRAWAL_AMOUNT && (
            <p className="text-center text-xs text-muted-foreground">
              Minimum withdrawal amount is{" "}
              {formatCurrency(MIN_WITHDRAWAL_AMOUNT)}
            </p>
          )}
          {!bankDetails && availableBalance >= MIN_WITHDRAWAL_AMOUNT && (
            <p className="text-center text-xs text-muted-foreground">
              Please configure your bank account to withdraw
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
