"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { isAxiosError } from "axios";
import api from "@/lib/api-client";
import { Spinner } from "@/components/ui/spinner";
import { PAYMENT_MESSAGE } from "@/components/blog/support-button";

type Result =
  | { state: "verifying" }
  | { state: "success"; amount?: string }
  | { state: "pending" | "failed"; message: string };

/**
 * Paystack sends the payer here after checkout (?reference=...). We ask the
 * API to verify the payment, which also credits the creator's wallet.
 */
export function SupportCallback() {
  const params = useSearchParams();
  const reference = params.get("reference") || params.get("trxref");
  const [result, setResult] = useState<Result>(() =>
    reference ? { state: "verifying" } : { state: "failed", message: "No payment reference was found in the link." },
  );
  const started = useRef(false);

  useEffect(() => {
    if (!reference || started.current) return; // StrictMode runs effects twice in dev
    started.current = true;

    api
      .get("/transaction/payment/verify/", { params: { reference } })
      .then((res) => {
        const data = res.data as { status: string; amount?: string; message?: string };
        if (data.status === "success") setResult({ state: "success", amount: data.amount });
        else setResult({ state: "pending", message: data.message || "Your payment is still being processed." });
      })
      .catch((error) => {
        const message = isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;
        setResult({ state: "failed", message: message || "We couldn't confirm your payment." });
      });
  }, [reference]);

  // Opened as a popup from the support dialog: tell the post page, then close.
  useEffect(() => {
    if (result.state === "verifying" || !window.opener) return;
    try {
      window.opener.postMessage({ type: PAYMENT_MESSAGE, status: result.state }, window.location.origin);
    } catch {
      /* opener navigated away */
    }
    if (result.state === "success") {
      const timer = setTimeout(() => window.close(), 3000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-shade px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
        {result.state === "verifying" && (
          <>
            <Spinner className="mx-auto size-10 text-accent" />
            <h1 className="mt-5 text-xl font-bold">Confirming your payment…</h1>
            <p className="mt-2 text-sm text-meta">This only takes a moment. Please don&apos;t close this window.</p>
          </>
        )}

        {result.state === "success" && (
          <>
            <CheckCircle2 className="mx-auto size-14 text-emerald-500" aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-bold">Thank you!</h1>
            <p className="mt-2 text-sm text-meta">
              Your support{result.amount ? ` of ₦${Number(result.amount).toLocaleString()}` : ""} was received. God bless
              you for sowing into gospel ministry.
            </p>
          </>
        )}

        {result.state === "pending" && (
          <>
            <Clock className="mx-auto size-14 text-amber-500" aria-hidden="true" />
            <h1 className="mt-4 text-xl font-bold">Payment not completed yet</h1>
            <p className="mt-2 text-sm text-meta">{result.message}</p>
          </>
        )}

        {result.state === "failed" && (
          <>
            <XCircle className="mx-auto size-14 text-destructive" aria-hidden="true" />
            <h1 className="mt-4 text-xl font-bold">Payment not confirmed</h1>
            <p className="mt-2 text-sm text-meta">{result.message}</p>
            {reference && <p className="mt-3 text-xs text-meta">Reference: {reference}</p>}
          </>
        )}

        {result.state !== "verifying" && (
          <div className="mt-6">
            {typeof window !== "undefined" && window.opener ? (
              <button
                type="button"
                onClick={() => window.close()}
                className="rounded-full bg-text px-6 py-2.5 text-sm font-semibold text-white hover:bg-black"
              >
                Close window
              </button>
            ) : (
              <Link href="/" className="rounded-full bg-text px-6 py-2.5 text-sm font-semibold text-white hover:bg-black">
                Back to iGospel
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
