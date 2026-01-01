"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "@/lib/api-client";
import { toast } from "sonner";
import { useRef } from "react";
import clsx from "clsx";

const schema = z.object({
  amount: z.number().min(1),
  pin: z.string().length(4),
});

type FormValues = z.infer<typeof schema>;

function PinOtpInput({
  label,
  onChange,
  error,
}: {
  label: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    inputsRef.current[index].value = value;

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    const pin = inputsRef.current.map((i) => i?.value ?? "").join("");
    onChange(pin);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !inputsRef.current[index].value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <input
            key={i}
            type="password"
            inputMode="numeric"
            maxLength={1}
            ref={(el) => {
              if (el) inputsRef.current[i] = el;
            }}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={clsx(
              "h-12 w-12 rounded-md border text-center text-lg font-semibold",
              "focus:outline-none focus:ring-2 focus:ring-primary",
              error && "border-destructive"
            )}
          />
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function WithdrawDialog({ open, onOpenChange, bank }: any) {
  const form = useForm<FormValues>({
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
      toast.success("Withdrawal successful");
      onOpenChange(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="space-y-6 flex flex-col"
        >
          <input
            type="number"
            placeholder="Amount"
            {...form.register("amount", { valueAsNumber: true })}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <PinOtpInput
            label="Transaction PIN"
            onChange={(v) => form.setValue("pin", v)}
            error={form.formState.errors.pin?.message}
          />

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            Withdraw
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
