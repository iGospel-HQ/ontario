import { Suspense } from "react";
import type { Metadata } from "next";
import { SupportCallback } from "./_client";

export const metadata: Metadata = {
  title: "Confirming payment",
  robots: { index: false, follow: false },
};

/** Paystack's callback_url (backend PAYSTACK_CALLBACK_URL, default FRONTEND_URL/support/callback). */
export default function SupportCallbackPage() {
  return (
    <Suspense>
      <SupportCallback />
    </Suspense>
  );
}
