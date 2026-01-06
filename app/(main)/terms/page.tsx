// app/terms/page.tsx
import { Metadata } from "next";
import TermsOfUseClient from "./_client";

export const metadata: Metadata = {
  title: "Terms of Use - iGospel",
  description: "Read the Terms of Use for iGospel, the digital gospel platform for music, sermons, devotionals, and faith-based content.",
};

export default function TermsPage() {
  return <TermsOfUseClient />;
}