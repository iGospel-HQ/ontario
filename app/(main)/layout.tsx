import type React from "react";
import ClientLayout from "./ClientLayout";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "iGospel - Blog & Music Platform",
    template: `%s - ${siteConfig.name}`,
  },
  description:
    "Discover curated music, artists, and editorial content all in one place",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      style={{
        backgroundImage: "url(/bg-back.jpg)",
        backgroundRepeat: "no-repeat",
        // backgroundSize: "cover",
        backgroundAttachment: "fixed"
      }}
    >
      <ClientLayout>{children}</ClientLayout>
    </main>
  );
}
