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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/lib/api-client";
import { toast } from "sonner";
import { useRef, useState } from "react";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import { number } from "framer-motion";

const schema = z
  .object({
    amount: z
      .number({ message: "Amount is required" })
      .min(1, "Amount must be greater than zero"),
    pin: z.string().length(4),
  })
  .refine((data) => Number(data.amount) >= 5000, {
    message: "Minimum withdrawal amount is ₦5,000",
    path: ["amount"],
  });

type FormValues = z.infer<typeof schema>;
type ResultStatus = "success" | "error" | null;

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
  const queryClient = useQueryClient();
  const [resultStatus, setResultStatus] = useState<ResultStatus>(null);
  const [resultMessage, setResultMessage] = useState("");

  const mutation = useMutation({
    mutationFn: (values: any) =>
      apiService.withdrawFunds({
        ...values,
        account_number: bank.account_number,
        account_name: bank.account_name,
        bank_code: bank.bank_code,
      }),
    onSuccess: () => {
      // toast.success("Withdrawal successful");
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawals-transactions"] });
      setResultStatus("success");
      setResultMessage("Your withdrawal has been processed successfully.");
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      setResultStatus("error");
      setResultMessage(
        error?.response?.data?.message || "Failed to process withdrawal."
      );
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="md:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="space-y-6 flex flex-col"
          >
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Amount"
                {...form.register("amount", { valueAsNumber: true })}
                className={cn(
                  "w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary",
                  form.formState.errors.amount ? "border-destructive" : ""
                )}
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            <PinOtpInput
              label="Transaction PIN"
              onChange={(v) => form.setValue("pin", v)}
              error={form.formState.errors.pin?.message}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              Withdraw
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={resultStatus !== null}
        onOpenChange={() => setResultStatus(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              <img src="/icon.png" alt="icon" className="mx-auto h-20 mb-5 bg-black p-3 rounded-full" />
              {resultStatus === "success"
                ? "Withdrawal Successful 🎉"
                : "Withdrawal Failed"}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">{resultMessage}</p>

          <div className="flex justify-end pt-4">
            <Button onClick={() => setResultStatus(null)}>
              {resultStatus === "success" ? "Done" : "Try Again"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
