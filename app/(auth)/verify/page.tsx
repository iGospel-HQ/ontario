// app/verify/page.tsx
import { Metadata } from "next";
import VerifyAccountClient from "./_client";
export const metadata: Metadata = {
  title: "Verify Account - iGospel",
  description: "Enter the 4-digit verification code sent to your email to complete your iGospel account setup.",
};

export default function VerifyPage() {
  return <VerifyAccountClient />;
}