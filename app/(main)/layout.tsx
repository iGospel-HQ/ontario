import type React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { SiteShell } from "@/components/layout/site-shell";

export const metadata: Metadata = {
  title: {
    default: "iGospel - Blog & Music Platform",
    template: `%s - ${siteConfig.name}`,
  },
  description:
    "Discover curated music, artists, and editorial content all in one place",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteShell>{children}</SiteShell>;
}
