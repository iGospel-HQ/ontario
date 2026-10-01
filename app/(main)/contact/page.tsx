import { pageMetadata } from "@/lib/seo";
import ContactPageClient from "./client";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with the iGospel team",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageClient />;
}