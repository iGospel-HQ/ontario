"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "@/lib/api-client";
import { toast } from "sonner";

const schema = z.object({
  amount: z.number().min(1),
  pin: z.string().length(4),
});

export function WithdrawDialog({ open, onOpenChange, bank }: any) {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (values: any) =>
      apiService.withdrawFunds({
        ...values,
        account_number: bank.account_number,
        account_name: bank.account_name,
        bank_code: bank.bank_code,
      }),
    onSuccess: () => {
      toast("Withdrawal successful");
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="space-y-4"
        >
          <Input
            type="number"
            placeholder="Amount"
            {...form.register("amount", { valueAsNumber: true })}
          />
          <Input
            type="password"
            placeholder="Transaction PIN"
            {...form.register("pin")}
          />

          <Button className="w-full" disabled={mutation.isPending}>
            Withdraw
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
