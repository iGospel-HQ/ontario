import { pageMetadata } from "@/lib/seo";
import TermsOfUseClient from "./_client";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "Read the Terms of Use for iGospel, the digital gospel platform for music, sermons, devotionals, and faith-based content.",
  path: "/terms",
});

export default function TermsPage() {
  return <TermsOfUseClient />;
}