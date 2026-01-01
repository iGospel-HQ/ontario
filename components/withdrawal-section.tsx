"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/api-client";
import { CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { useState } from "react";

import { BankSetupDialog } from "./bank-setup-dialog";
import { PinSetupDialog } from "./pin-setup-dialog";
import { PinChangeDialog } from "./pin-change-dialog";
import { WithdrawDialog } from "./withdraw-dialog";

import { useAuthStore } from "@/store/use-auth-store";

const MIN_WITHDRAWAL_AMOUNT = 5000;
const TRANSACTION_FEE = 100;

export function WithdrawalSection() {
  const { user } = useAuthStore();

  const [isBankSetupOpen, setIsBankSetupOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isPinSetupOpen, setIsPinSetupOpen] = useState(false);
  const [isPinChangeOpen, setIsPinChangeOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: apiService.getDashboardStats,
  });

  const { data: bankDetails } = useQuery({
    queryKey: ["bank-details"],
    queryFn: apiService.getWalletBankAccounts,
  });

  const availableBalance = data?.stats?.wallet_balance ?? 0;
  const bank = bankDetails?.results?.[0];

  const canWithdraw =
    availableBalance >= MIN_WITHDRAWAL_AMOUNT &&
    !!bank &&
    user?.has_pin === true;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);

  return (
    <>
      {/* WALLET BALANCE */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">
            {formatCurrency(availableBalance)}
          </p>
        </CardContent>
      </Card>

      {/* WITHDRAWALS */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawals</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* BANK DETAILS */}
          <div className="flex flex-col md:flex-row gap-5 items-start justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {bank ? (
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

              {bank && (
                <div className="ml-7 text-sm text-muted-foreground">
                  <p>
                    {bank.account_name} – {bank.bank_name}
                  </p>
                  <p>****{bank.account_number.slice(-4)}</p>
                </div>
              )}
            </div>

            {!bank && (
              <Button
                variant="default"
                size="sm"
                className="w-full md:w-fit"
                onClick={() => setIsBankSetupOpen(true)}
              >
                Setup
              </Button>
            )}
          </div>

          {/* PIN STATUS */}
          <div className="flex flex-col md:flex-row gap-5 items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <span className="font-medium">
                {user?.has_pin
                  ? "Transaction PIN Set"
                  : "Transaction PIN Not Set"}
              </span>
            </div>

            {user?.has_pin ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full md:w-fit"
                onClick={() => setIsPinChangeOpen(true)}
              >
                Change PIN
              </Button>
            ) : (
              <Button
                size="sm"
                className="w-full md:w-fit"
                onClick={() => setIsPinSetupOpen(true)}
              >
                Set PIN
              </Button>
            )}
          </div>

          {/* WITHDRAW BUTTON */}
          <div className="space-y-2">
            <Button
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
              disabled={!canWithdraw}
              onClick={() => setIsWithdrawOpen(true)}
            >
              Withdraw Funds
            </Button>

              <p className="text-center text-xs text-muted-foreground">
                Minimum withdrawal amount is{" "}
                {formatCurrency(MIN_WITHDRAWAL_AMOUNT)} with transaction fee of{" "}
                {formatCurrency(TRANSACTION_FEE)}
              </p>

            {!bank && availableBalance >= MIN_WITHDRAWAL_AMOUNT && (
              <p className="text-center text-xs text-muted-foreground">
                Please configure your bank account to withdraw
              </p>
            )}

            {!user?.has_pin && bank && (
              <p className="text-center text-xs text-muted-foreground">
                Please set a transaction PIN to withdraw
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* DIALOGS */}
      <BankSetupDialog
        open={isBankSetupOpen}
        onOpenChange={setIsBankSetupOpen}
      />

      <PinSetupDialog open={isPinSetupOpen} onOpenChange={setIsPinSetupOpen} />

      <PinChangeDialog
        open={isPinChangeOpen}
        onOpenChange={setIsPinChangeOpen}
      />

      {bank && (
        <WithdrawDialog
          open={isWithdrawOpen}
          onOpenChange={setIsWithdrawOpen}
          bank={bank}
        />
      )}
    </>
  );
}
