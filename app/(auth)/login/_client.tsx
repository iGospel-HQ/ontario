"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { AuthCard, FormNotice, PasswordInput, primaryButton } from "@/components/auth/auth-ui";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api from "@/lib/api-client";
import { readApiError } from "@/lib/api-errors";
import { useAuthStore } from "@/store/use-auth-store";

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInClient() {
  const { setTokens, setUser } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justVerified = searchParams.get("verified") === "1";

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: searchParams.get("email") ?? "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: SignInFormData) => {
      const res = await api.post("/account/login/", data);
      return res.data.data;
    },
    onSuccess: (data) => {
      setTokens(data.access, data.refresh);
      setUser({
        user_id: data.user_id,
        email: data.email,
        has_pin: data.has_pin,
        is_admin: Boolean(data.is_admin),
      });
      router.push(data.is_admin ? "/dashboard/overview" : "/dashboard");
    },
    onError: (error, variables) => {
      const info = readApiError(error, "We couldn't sign you in. Please try again.");
      // Signed up but never verified: a new code was just emailed, go enter it.
      if (info.code === "email_not_verified") {
        const email = String(info.data.email ?? variables.email);
        router.push(`/verify?email=${encodeURIComponent(email)}&sent=1`);
        return;
      }
      for (const [field, message] of Object.entries(info.fields)) {
        if (field === "email" || field === "password") form.setError(field, { message });
      }
      if (info.message) form.setError("root", { message: info.message });
    },
  });

  const rootError = form.formState.errors.root?.message;

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your iGospel account."
      footer={
        <>
          New to iGospel?{" "}
          <Link href="/signup" className="font-semibold text-accent hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {justVerified && !rootError && (
        <FormNotice tone="success" title="Your email is verified">
          You can now log in to your account.
        </FormNotice>
      )}
      {rootError && (
        <FormNotice title={rootError}>
          Check your email and password, or{" "}
          <Link href="/forgot-password" className="font-semibold underline">
            reset your password
          </Link>
          .
        </FormNotice>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-5" noValidate>
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link href="/forgot-password" className="text-sm font-medium text-accent hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput autoComplete="current-password" placeholder="Your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className={primaryButton} disabled={loginMutation.isPending}>
            {loginMutation.isPending ? (
              <>
                <Loader2 className="size-5 animate-spin" /> Logging in…
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
