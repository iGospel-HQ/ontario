"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  bank_code: z.string().min(1, "Please select a bank"),
  account_number: z.string().length(10, "Account number must be 10 digits"),
  account_name: z.string().min(1, "Account name is required"),
  bank_name: z.string().min(1, "Bank name is required"),
});

interface BankSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ResultStatus = "success" | "error" | null;

export function BankSetupDialog({ open, onOpenChange }: BankSetupDialogProps) {
  const queryClient = useQueryClient();
  const [isValidating, setIsValidating] = useState(false);
  const [resultStatus, setResultStatus] = useState<ResultStatus>(null);
  const [resultMessage, setResultMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bank_code: "",
      account_number: "",
      account_name: "",
      bank_name: "",
    },
  });

  const { data: banks } = useQuery({
    queryKey: ["banks"],
    queryFn: apiService.getBanks,
    //     enabled: open,
  });

  const addBankMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      apiService.addWalletBankAccount({ ...values, is_default: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-details"] });
      setResultStatus("success");
      setResultMessage("Your bank account has been added successfully.");

      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      setResultStatus("error");
      setResultMessage(
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.message ||
          "Failed to add bank account. Please try again."
      );
    },
  });

  const validateAccount = async () => {
    const bankCode = form.getValues("bank_code");
    const accountNumber = form.getValues("account_number");

    if (bankCode && accountNumber.length === 10) {
      setIsValidating(true);
      try {
        const accountName = await apiService.getBankDetailsByNumber(
          accountNumber,
          bankCode
        );
        form.setValue("account_name", accountName);
        const bank = banks?.find((b: any) => b.code === bankCode);
        if (bank) form.setValue("bank_name", bank.name);
        toast.success("Account validated successfully");
      } catch (error) {
        toast.error("Could not validate account number");
      } finally {
        setIsValidating(false);
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Setup Withdrawal Account</DialogTitle>
            <DialogDescription>
              Enter your bank details to receive payouts.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => addBankMutation.mutate(v))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="bank_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Bank</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        validateAccount();
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {banks?.map((bank: any) => (
                          <SelectItem key={bank.code} value={bank.code}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="account_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1234567890"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value.length === 10) validateAccount();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="account_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="Loading..." {...field} readOnly />
                        {isValidating && (
                          <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={addBankMutation.isPending || isValidating}
                >
                  {addBankMutation.isPending
                    ? "Saving..."
                    : "Save Bank Account"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={resultStatus !== null}
        onOpenChange={() => setResultStatus(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              <img
                src="/icon.png"
                alt="icon"
                className="mx-auto h-20 mb-5 bg-black p-3 rounded-full"
              />

              {resultStatus === "success"
                ? "Success 🎉"
                : "Something went wrong"}
            </DialogTitle>
            <DialogDescription className="text-center">{resultMessage}</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={() => setResultStatus(null)}>
              {resultStatus === "success" ? "Done" : "Try Again"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
