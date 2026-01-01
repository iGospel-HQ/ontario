// app/verify/VerifyAccountClient.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/api-client";
import { useRouter, useSearchParams } from "next/navigation";

const verifySchema = z.object({
  otp: z
    .string()
    .length(4, "Verification code must be exactly 4 digits")
    .regex(/^\d{4}$/, "Code must contain only numbers"),
});

type VerifyFormData = z.infer<typeof verifySchema>;

export default function VerifyAccountClient() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";


  const form = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: "",
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: VerifyFormData) => {
      // Replace with your actual verification endpoint
      const res = await api.post("/account/verify-otp/", {
        ...data,
        email,
        purpose: "email",
      });
      return res.data;
    },
    onSuccess: () => {
      // Redirect to dashboard or home
      router.push("/signin");
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.detail ||
        "Invalid or expired code. Please try again.";
      form.setError("otp", { message: msg });
    },
  });

  const onSubmit = (data: VerifyFormData) => {
    verifyMutation.mutate(data);
  };

  const resendCode = async () => {
    setLoading(true);
    try {
      await api.post("/auth/resend-verification/");
      alert("Verification code resent! Check your email.");
    } catch (err) {
      alert("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Verify Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-2 md:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Mail className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-md md:text-2xl font-bold text-gray-900 mb-2">
              Verify account
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              A four digit pin has been sent to your email account,
              <br />
              input it and verify your email.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 4-Digit Code Input */}
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center gap-3">
                        {[0, 1, 2, 3].map((index) => (
                          <Input
                            key={index}
                            type="text"
                            maxLength={1}
                            className="w-10 h-10 text-sm text-center md:text-2xl font-bold border-gray-300 focus:border-red-500"
                            value={field.value[index] || ""}
                            onChange={(e) => {
                              const newCode = field.value.split("");
                              if(isNaN(Number(e.target.value))) return; // Only allow numbers
                              newCode[index] = e.target.value;
                              const code = newCode.join("");
                              field.onChange(code);

                              // Auto-focus next input
                              if (e.target.value && index < 3) {
                                const next =
                                  e.target.nextElementSibling as HTMLInputElement;
                                next?.focus();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Backspace" &&
                                !field.value[index] &&
                                index > 0
                              ) {
                                const prev =
                                  e.target.previousElementSibling as HTMLInputElement;
                                prev?.focus();
                              }
                            }}

                            onPaste={(e) => {
                              e.preventDefault();
                              const pasteData = e.clipboardData
                                .getData("text")
                                .slice(0, 4);
                              field.onChange(pasteData);
                            }}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-lg rounded-full"
                disabled={verifyMutation.isPending}
              >
                {verifyMutation.isPending ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </Form>

          {/* Resend Link */}
          {/* <div className="mt-6 text-center">
            <button
              onClick={resendCode}
              disabled={loading}
              className="text-sm text-gray-600 hover:text-red-600 underline"
            >
              {loading ? "Sending..." : "Didn't receive code? Resend"}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
