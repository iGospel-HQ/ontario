// app/sign-in/page.tsx
import { Metadata } from "next";
import VerifyAccountClient from "./_client";

export const metadata: Metadata = {
  title: "Forgot Password - iGospel",
  description: "Reset your account and regain access",
};

export default function SignInPage() {
  return <VerifyAccountClient />;
}