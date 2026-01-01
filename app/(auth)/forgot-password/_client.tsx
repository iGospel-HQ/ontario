// app/verify/VerifyAccountClient.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/api-client";
import { useRouter } from "next/navigation";

export default function VerifyAccountClient() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const router = useRouter();
  // Zod Schemas for each step
  const emailSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
  });

  const otpSchema = z.object({
    code: z
      .string()
      .length(4, "OTP must be exactly 4 digits")
      .regex(/^\d{4}$/, "OTP must contain only numbers"),
  });

  const passwordSchema = z
    .object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  // Forms for each step
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Mutations
  const sendOtpMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const res = await api.post("/account/forgot-password/", {
        ...data,
        purpose: "password",
      }); // Adjust endpoint
      return res.data;
    },
    onSuccess: () => {
      setEmail(emailForm.getValues("email"));
      setStep(2);
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.detail || "Failed to send OTP. Please try again.";
      emailForm.setError("email", { message: msg });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: { code: string }) => {
      const payload = { email, otp: data.code, purpose: "password" };
      const res = await api.post("/account/verify-otp/", payload); // Adjust endpoint
      return res.data;
    },
    onSuccess: () => {
      setOtp(otpForm.getValues("code"));
      setStep(3);
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.detail || "Invalid OTP. Please try again.";
      otpForm.setError("code", { message: msg });
    },
  });

  const completeVerificationMutation = useMutation({
    mutationFn: async (data: { password: string; confirmPassword: string }) => {
      const payload = {
        email,
        otp,
        new_password: data.password,
        purpose: "password",
      };
      const res = await api.post("/account/reset-password/", payload); // Adjust endpoint
      return res.data;
    },
    onSuccess: () => {
      // Redirect to login or dashboard
      router.push("/sign-in");
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.detail ||
        "Failed to complete verification. Please try again.";
      passwordForm.setError("root", { message: msg });
    },
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="w-full max-w-md">
      {/* Verify Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Reset Your password
          </h2>
          <p className="text-gray-600 text-base text-center mb-8">
            Follow the steps to change your password
          </p>

          {step === 1 && (
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit((data) =>
                  sendOtpMutation.mutate(data)
                )}
                className="space-y-6"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full"
                  disabled={sendOtpMutation.isPending}
                >
                  {sendOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            </Form>
          )}

          {step === 2 && (
            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit((data) =>
                  verifyOtpMutation.mutate(data)
                )}
                className="space-y-6"
              >
                <p className="text-center text-gray-600">
                  A four digit pin has been sent to your email,
                  <br />
                  input it to verify your account.
                </p>
                <FormField
                  control={otpForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex justify-center gap-3">
                          {[0, 1, 2, 3].map((index) => (
                            <Input
                              key={index}
                              type="text"
                              maxLength={1}
                              className="w-10 h-10 text-md md:w-16 md:h-16 text-center md:text-2xl font-bold border-gray-300 focus:border-red-500"
                              value={field.value[index] || ""}
                              onChange={(e) => {
                                const newCode = field.value.split("");
                                if(isNaN(Number(e.target.value))) return;
                                newCode[index] = e.target.value;
                                field.onChange(newCode.join(""));

                                if (e.target.value && index < 3) {
                                  const nextInput = e.target
                                    .nextElementSibling as HTMLInputElement;
                                  nextInput?.focus();
                                }
                              }}
                              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (
                                  e.key === "Backspace" &&
                                  !field.value[index] &&
                                  index > 0
                                ) {
                                  const prevInput = e.target
                                    .previousElementSibling;
                                  prevInput?.focus();
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
                <Button
                  type="submit"
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full"
                  disabled={verifyOtpMutation.isPending}
                >
                  {verifyOtpMutation.isPending ? "Verifying..." : "Verify"}
                </Button>
              </form>
            </Form>
          )}

          {step === 3 && (
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit((data) =>
                  completeVerificationMutation.mutate(data)
                )}
                className="space-y-6"
              >
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="h-12 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="h-12 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full"
                  disabled={completeVerificationMutation.isPending}
                >
                  {completeVerificationMutation.isPending
                    ? "Completing..."
                    : "Set Password & Verify"}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
