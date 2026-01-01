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
import { apiService } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRef } from "react";
import clsx from "clsx";

const pinSchema = z
  .object({
    old_pin: z.string().length(4),
    new_pin: z.string().length(4),
    confirm_pin: z.string().length(4),
  })
  .refine((d) => d.new_pin === d.confirm_pin, {
    message: "PINs do not match",
    path: ["confirm_pin"],
  });

type FormValues = z.infer<typeof pinSchema>;

function PinInput({
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

    const pin = inputsRef.current.map((i) => i?.value || "").join("");
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

export function PinChangeDialog({ open, onOpenChange }: any) {
  const form = useForm<FormValues>({
    resolver: zodResolver(pinSchema),
  });

  const mutation = useMutation({
    mutationFn: apiService.changeTransactionPin,
    onSuccess: () => {
      toast.success("PIN changed successfully");
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
     console.log(error)
      toast.error(
        error?.response?.data?.detail || "Failed to change PIN. Please try again."
      );
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>Change Transaction PIN</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((values) =>
            mutation.mutate(values)
          )}
          className="space-y-6 flex flex-col items-center"
        >
          <PinInput
            label="Old PIN"
            onChange={(v) => form.setValue("old_pin", v)}
            error={form.formState.errors.old_pin?.message}
          />

          <PinInput
            label="New PIN"
            onChange={(v) => form.setValue("new_pin", v)}
            error={form.formState.errors.new_pin?.message}
          />

          <PinInput
            label="Confirm New PIN"
            onChange={(v) => form.setValue("confirm_pin", v)}
            error={form.formState.errors.confirm_pin?.message}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            Change PIN
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
