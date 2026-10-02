import { pageMetadata } from "@/lib/seo";
import VerifyAccountClient from "./_client";

export const metadata = pageMetadata({
  title: "Forgot Password",
  description:
    "Reset your account and regain access",
  path: "/forgot-password",
  noIndex: true,
});

export default function SignInPage() {
  return <VerifyAccountClient />;
}