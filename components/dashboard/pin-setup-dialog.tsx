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
import { useAuthStore } from "@/store/use-auth-store";
import { toast } from "sonner";
import { useRef } from "react";
import clsx from "clsx";

const schema = z
  .object({
    pin: z.string().length(4),
    confirm_pin: z.string().length(4),
  })
  .refine((d) => d.pin === d.confirm_pin, {
    message: "PINs do not match",
    path: ["confirm_pin"],
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

export function PinSetupDialog({ open, onOpenChange }: any) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const updatePinState = useAuthStore((state) => state.updatePinState);

  const mutation = useMutation({
    mutationFn: apiService.setupTransactionPin,
    onSuccess: () => {
      updatePinState(true);
      onOpenChange(false);
      form.reset();
      toast.success("PIN set successfully");
    },
     onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail || "Failed to set PIN. Please try again."
      );
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>Set Transaction PIN</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((values) =>
            mutation.mutate(values)
          )}
          className="space-y-6 flex flex-col items-center"
        >
          <PinOtpInput
            label="4-digit PIN"
            onChange={(v) => form.setValue("pin", v)}
            error={form.formState.errors.pin?.message}
          />

          <PinOtpInput
            label="Confirm PIN"
            onChange={(v) => form.setValue("confirm_pin", v)}
            error={form.formState.errors.confirm_pin?.message}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            Set PIN
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
