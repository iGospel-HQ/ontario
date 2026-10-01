import { pageMetadata } from "@/lib/seo";
import VerifyAccountClient from "./_client";
export const metadata = pageMetadata({
  title: "Verify Account",
  description:
    "Enter the 4-digit verification code sent to your email to complete your iGospel account setup.",
  path: "/verify",
  noIndex: true,
});

export default function VerifyPage() {
  return <VerifyAccountClient />;
}