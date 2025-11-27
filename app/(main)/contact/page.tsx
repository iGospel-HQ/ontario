import { Metadata } from "next";
import ContactPageClient from "./client";

export const metadata: Metadata = {
  title: "Contact - iGospel",
  description: "Get in touch with the iGospel team",
};

export default function ContactPage() {
  return <ContactPageClient />;
}