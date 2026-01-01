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
import { apiService } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/use-auth-store";
import { toast } from "sonner";

const schema = z
  .object({
    pin: z.string().length(4),
    confirm_pin: z.string().length(4),
  })
  .refine((d) => d.pin === d.confirm_pin, {
    message: "PINs do not match",
    path: ["confirm_pin"],
  });

export function PinSetupDialog({ open, onOpenChange }: any) {
  const form = useForm({
    resolver: zodResolver(schema),
  });
  const updatePinState = useAuthStore((state) => state.updatePinState);

  const mutation = useMutation({
    mutationFn: apiService.setupTransactionPin,
    onSuccess: () => {
      updatePinState(true);
      onOpenChange(false);
      toast("PIN set successfully");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Transaction PIN</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="space-y-4"
        >
          <Input
            type="password"
            placeholder="4-digit PIN"
            {...form.register("pin")}
          />
          <Input
            type="password"
            placeholder="Confirm PIN"
            {...form.register("confirm_pin")}
          />

          <Button className="w-full" disabled={mutation.isPending}>
            Set PIN
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
