import { pageMetadata } from "@/lib/seo";
import PrivacyPolicyClient from "./_client";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "Learn how iGospel collects, uses, and protects your personal information on our digital gospel platform.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <PrivacyPolicyClient />;
}