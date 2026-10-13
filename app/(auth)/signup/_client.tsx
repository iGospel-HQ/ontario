"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Check, Loader2 } from "lucide-react";

import { AuthCard, FormNotice, PasswordInput, primaryButton } from "@/components/auth/auth-ui";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api from "@/lib/api-client";
import { readApiError } from "@/lib/api-errors";
import { cn } from "@/lib/utils";

const PASSWORD_RULES = [
  { label: "8+ characters", test: (v: string) => v.length >= 8 },
  { label: "A capital letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "A small letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "A number", test: (v: string) => /\d/.test(v) },
];

const signUpSchema = z.object({
  first_name: z.string().trim().min(2, "Enter your first name"),
  last_name: z.string().trim().min(2, "Enter your last name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => /^0\d{10}$/.test(v), "Enter an 11-digit phone number, e.g. 08012345678"),
  password: z
    .string()
    .refine((v) => PASSWORD_RULES.every((rule) => rule.test(v)), "Your password needs all four of the items below"),
});

type SignUpFormInput = z.input<typeof signUpSchema>;
type SignUpFormData = z.output<typeof signUpSchema>;
const FIELDS = ["first_name", "last_name", "email", "phone", "password"] as const;

export default function SignUpClient() {
  const router = useRouter();
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const form = useForm<SignUpFormInput, unknown, SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { first_name: "", last_name: "", email: "", phone: "", password: "" },
  });
  const password = useWatch({ control: form.control, name: "password" }) ?? "";

  const registerMutation = useMutation({
    mutationFn: async (data: SignUpFormData) => {
      const res = await api.post("/account/register/", data);
      return res.data;
    },
    onSuccess: (res, variables) => {
      const email = res?.data?.email ?? variables.email;
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    },
    onError: (error, variables) => {
      setUnverifiedEmail(null);
      const info = readApiError(error, "We couldn't create your account. Please try again.");
      // Already signed up but never verified: offer a new code instead of a dead end.
      if (info.code === "email_not_verified") {
        setUnverifiedEmail(variables.email);
        return;
      }
      // Show each problem under its own field (e.g. email or phone already used).
      let placed = 0;
      for (const [field, message] of Object.entries(info.fields)) {
        if ((FIELDS as readonly string[]).includes(field)) {
          form.setError(field as (typeof FIELDS)[number], { message }, { shouldFocus: placed === 0 });
          placed += 1;
        }
      }
      const message =
        info.message ??
        (placed === 0 ? Object.values(info.fields)[0] : null) ??
        (placed > 0 ? null : "We couldn't create your account. Please try again.");
      if (message) form.setError("root", { message });
    },
  });

  const resendCode = async () => {
    if (!unverifiedEmail) return;
    setResending(true);
    try {
      await api.post("/account/resend-verification/", { email: unverifiedEmail });
    } catch {
      // The verify page can resend again if this one didn't go through.
    } finally {
      router.push(`/verify?email=${encodeURIComponent(unverifiedEmail)}&sent=1`);
    }
  };

  const errors = form.formState.errors;
  const emailTaken = /already exists/i.test(errors.email?.message ?? "");

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join iGospel to save your favourite songs, support artists and more. It's free."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Log in
          </Link>
        </>
      }
    >
      {unverifiedEmail && (
        <FormNotice
          tone="info"
          title="You've already signed up with this email"
          action={
            <Button type="button" size="sm" onClick={resendCode} disabled={resending} className="rounded-full">
              {resending ? <Loader2 className="size-4 animate-spin" /> : null}
              Send me a new code
            </Button>
          }
        >
          Your account just needs verifying. We&apos;ll email you a new code to finish signing up.
        </FormNotice>
      )}
      {errors.root?.message && <FormNotice title={errors.root.message} />}
      {emailTaken && (
        <FormNotice tone="info" title="This email already has an account">
          <Link href={`/login?email=${encodeURIComponent(form.getValues("email"))}`} className="font-semibold underline">
            Log in
          </Link>{" "}
          or{" "}
          <Link href="/forgot-password" className="font-semibold underline">
            reset your password
          </Link>
          .
        </FormNotice>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input autoComplete="given-name" placeholder="Ada" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input autoComplete="family-name" placeholder="Okafor" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder="you@example.com" className="h-12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="08012345678"
                    className="h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" placeholder="Create a password" {...field} />
                </FormControl>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1 text-xs" aria-label="Password requirements">
                  {PASSWORD_RULES.map((rule) => {
                    const ok = rule.test(password);
                    return (
                      <li
                        key={rule.label}
                        className={cn("flex items-center gap-1.5", ok ? "text-emerald-600" : "text-gray-500")}
                      >
                        <Check className={cn("size-3.5", ok ? "opacity-100" : "opacity-30")} aria-hidden="true" />
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className={primaryButton} disabled={registerMutation.isPending}>
            {registerMutation.isPending ? (
              <>
                <Loader2 className="size-5 animate-spin" /> Creating your account…
              </>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="text-center text-xs leading-relaxed text-gray-500">
            By creating an account you agree to iGospel&apos;s{" "}
            <Link href="/terms" className="font-medium text-gray-700 underline hover:text-accent">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-gray-700 underline hover:text-accent">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </Form>
    </AuthCard>
  );
}
