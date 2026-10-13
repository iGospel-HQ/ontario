"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, MailCheck } from "lucide-react";

import { AuthCard, FormNotice, primaryButton } from "@/components/auth/auth-ui";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import api from "@/lib/api-client";
import { readApiError } from "@/lib/api-errors";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 4;
const RESEND_SECONDS = 60;

const verifySchema = z.object({
  otp: z.string().regex(new RegExp(`^\\d{${CODE_LENGTH}}$`), `Enter the ${CODE_LENGTH}-digit code from your email`),
});

type VerifyFormData = z.infer<typeof verifySchema>;

export default function VerifyAccountClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [notice, setNotice] = useState<string | null>(
    searchParams.get("sent") === "1" ? "We've sent a new code to your email." : null,
  );
  const [cooldown, setCooldown] = useState(searchParams.get("sent") === "1" ? RESEND_SECONDS : 0);
  const [resending, setResending] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<VerifyFormData>({ resolver: zodResolver(verifySchema), defaultValues: { otp: "" } });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const verifyMutation = useMutation({
    mutationFn: async (data: VerifyFormData) => {
      const res = await api.post("/account/verify-otp/", { ...data, email, purpose: "email" });
      return res.data;
    },
    onSuccess: () => router.push(`/login?verified=1&email=${encodeURIComponent(email)}`),
    onError: (error) => {
      const info = readApiError(error, "That code didn't work. Please try again.");
      form.setError("otp", {
        message: /invalid|expired/i.test(info.message ?? "")
          ? "That code is wrong or has expired. Check your email, or send a new code."
          : (info.message ?? Object.values(info.fields)[0]),
      });
      form.setValue("otp", "");
      inputs.current[0]?.focus();
    },
  });

  const resendCode = async () => {
    if (!email || cooldown > 0) return;
    setResending(true);
    try {
      await api.post("/account/resend-verification/", { email });
      setNotice("We've sent a new code to your email. It can take a minute to arrive; check your spam folder too.");
      setCooldown(RESEND_SECONDS);
    } catch (error) {
      setNotice(null);
      form.setError("root", { message: readApiError(error, "We couldn't send a new code. Please try again.").message ?? "" });
    } finally {
      setResending(false);
    }
  };

  const submit = form.handleSubmit((data) => verifyMutation.mutate(data));

  if (!email) {
    return (
      <AuthCard title="Verify your email" icon={<MailCheck className="size-7" />}>
        <FormNotice tone="info" title="We need your email address">
          Open the link from your sign-up, or{" "}
          <Link href="/login" className="font-semibold underline">
            log in
          </Link>{" "}
          and we&apos;ll send you a new code.
        </FormNotice>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Check your email"
      icon={<MailCheck className="size-7" />}
      subtitle={
        <>
          We sent a {CODE_LENGTH}-digit code to <strong className="text-gray-900">{email}</strong>. Enter it below
          to verify your account.
        </>
      }
      footer={
        <>
          Wrong email?{" "}
          <Link href="/signup" className="font-semibold text-accent hover:underline">
            Sign up again
          </Link>
        </>
      }
    >
      {notice && <FormNotice tone="success" title={notice} />}
      {form.formState.errors.root?.message && <FormNotice title={form.formState.errors.root.message} />}

      <Form {...form}>
        <form onSubmit={submit} className="space-y-6" noValidate>
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => {
              const digits = field.value.split("");
              const setDigits = (next: string) => {
                const code = next.replace(/\D/g, "").slice(0, CODE_LENGTH);
                field.onChange(code);
                if (code.length === CODE_LENGTH) setTimeout(submit, 0); // all digits in: verify straight away
                return code;
              };
              return (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-center gap-3" role="group" aria-label="Verification code">
                      {Array.from({ length: CODE_LENGTH }, (_, i) => (
                        <input
                          key={i}
                          ref={(el) => {
                            inputs.current[i] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          autoComplete={i === 0 ? "one-time-code" : "off"}
                          maxLength={CODE_LENGTH}
                          aria-label={`Digit ${i + 1}`}
                          value={digits[i] ?? ""}
                          autoFocus={i === 0}
                          onChange={(e) => {
                            const typed = e.target.value.replace(/\D/g, "");
                            if (!typed) return;
                            // Typing or autofilling several digits fills the following boxes.
                            const next = [...digits];
                            typed.split("").forEach((d, k) => {
                              if (i + k < CODE_LENGTH) next[i + k] = d;
                            });
                            const code = setDigits(next.join(""));
                            inputs.current[Math.min(i + typed.length, CODE_LENGTH - 1, code.length)]?.focus();
                          }}
                          onKeyDown={(e) => {
                            if (e.key !== "Backspace") return;
                            e.preventDefault();
                            const next = [...digits];
                            if (next[i]) next[i] = "";
                            else if (i > 0) {
                              next[i - 1] = "";
                              inputs.current[i - 1]?.focus();
                            }
                            field.onChange(next.join(""));
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            const code = setDigits(e.clipboardData.getData("text"));
                            inputs.current[Math.min(code.length, CODE_LENGTH - 1)]?.focus();
                          }}
                          className={cn(
                            "size-14 rounded-2xl border bg-white text-center text-2xl font-bold text-gray-900 outline-none transition sm:size-16",
                            "border-gray-300 focus:border-accent focus:ring-4 focus:ring-accent/15",
                            form.formState.errors.otp && "border-red-400",
                          )}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              );
            }}
          />

          <Button type="submit" className={primaryButton} disabled={verifyMutation.isPending}>
            {verifyMutation.isPending ? (
              <>
                <Loader2 className="size-5 animate-spin" /> Verifying…
              </>
            ) : (
              "Verify email"
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Didn&apos;t get the code?{" "}
        <button
          type="button"
          onClick={resendCode}
          disabled={resending || cooldown > 0}
          className="font-semibold text-accent hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
        >
          {resending ? "Sending…" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </p>
    </AuthCard>
  );
}
