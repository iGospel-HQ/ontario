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
import { toast } from "sonner";

const schema = z
  .object({
    old_pin: z.string().length(4),
    new_pin: z.string().length(4),
    confirm_pin: z.string().length(4),
  })
  .refine((d) => d.new_pin === d.confirm_pin, {
    message: "PINs do not match",
    path: ["confirm_pin"],
  });

export function PinChangeDialog({ open, onOpenChange }: any) {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: apiService.changeTransactionPin,
    onSuccess: () => {
      toast("PIN changed successfully");
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Transaction PIN</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="space-y-4"
        >
          <Input
            type="password"
            placeholder="Old PIN"
            {...form.register("old_pin")}
          />
          <Input
            type="password"
            placeholder="New PIN"
            {...form.register("new_pin")}
          />
          <Input
            type="password"
            placeholder="Confirm New PIN"
            {...form.register("confirm_pin")}
          />

          <Button className="w-full" disabled={mutation.isPending}>
            Change PIN
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
