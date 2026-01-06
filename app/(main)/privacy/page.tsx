// app/privacy/page.tsx
import { Metadata } from "next";
import PrivacyPolicyClient from "./_client";

export const metadata: Metadata = {
  title: "Privacy Policy - iGospel",
  description: "Learn how iGospel collects, uses, and protects your personal information on our digital gospel platform.",
};

export default function PrivacyPage() {
  return <PrivacyPolicyClient />;
}