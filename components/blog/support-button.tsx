"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import api from "@/lib/api-client";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const supportSchema = z.object({
  amount: z
    .number({ message: "Amount is required" })
    .min(100, "Minimum support amount is ₦100"),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z
    .string({ message: "Email is required for receipt" })
    .email("Please enter a valid email address"),
});

type SupportFormValues = z.infer<typeof supportSchema>;

/** postMessage type the /support/callback popup sends back after verifying. */
export const PAYMENT_MESSAGE = "igospel:support-payment";

/** "Support This Blog/Artist" button and its payment dialog. */
export function SupportButton({
  artistId,
  creatorId,
  label,
}: {
  artistId?: string;
  creatorId?: string | null;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // The checkout popup reports the verified result back to this page.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== PAYMENT_MESSAGE) return;
      if (event.data.status === "success") toast.success("Thank you! Your support was received.");
      else if (event.data.status === "failed") toast.error("Your payment could not be confirmed.");
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportSchema),
    defaultValues: { amount: undefined, name: "", phone: "", email: "" },
  });

  const handleSupport = async (values: SupportFormValues) => {
    setLoading(true);

    try {
      const email = values.email || siteConfig.emails.contact;

      await api.post("/wallet/givings/", {
        artist: artistId,
        name: values.name || "Anonymous",
        amount: values.amount,
        phone: values.phone || "N/A",
        email,
      });

      const res = await api.post("/transaction/payment/initiate/", {
        creator_id: creatorId,
        amount: values.amount,
        email,
      });
      const { payment_url } = res.data;

      if (payment_url) {
        setOpen(false);
        form.reset();

        const width = 600;
        const height = 750;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2 - 50;

        window.open(
          payment_url,
          "SupportPayment",
          `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
        );
      }
    } catch (error) {
      // Show the API's reason (e.g. payments unavailable) when it gives one.
      const message = isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;
      toast.error(message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-none bg-accent text-[13px] font-bold uppercase tracking-wider text-white hover:bg-topbar"
        size="lg"
      >
        <Heart className="w-5 h-5" />
        {label || "Support This Blog"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Support This Blog</DialogTitle>
            <DialogDescription className="text-base">
              Your support helps us continue sharing powerful gospel content.
              <span className="block mt-3 text-sm text-muted-foreground">
                You may remain anonymous.
              </span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleSupport)} className="space-y-5 py-4">
            <div className="space-y-1">
              <Label htmlFor="support-amount">Amount (₦)</Label>
              <Input
                id="support-amount"
                type="number"
                {...form.register("amount", { valueAsNumber: true })}
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="support-name">
                Name <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Input id="support-name" {...form.register("name")} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="support-phone">
                Phone <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Input id="support-phone" {...form.register("phone")} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="support-email">
                Email <span className="text-muted-foreground">(For receipt)</span>
              </Label>
              <Input id="support-email" type="email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
                {loading ? "Processing..." : "Continue to Payment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
