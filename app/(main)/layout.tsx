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
  // AdSense site verification (alternative to the script tag and ads.txt).
  other: { "google-adsense-account": siteConfig.adsenseClient },
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Google AdSense: public pages only (not login, dashboard or payment
          screens, which have no publisher content). React places async
          scripts in <head>, where AdSense expects it. */}
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseClient}`}
        crossOrigin="anonymous"
      />
      <SiteShell>{children}</SiteShell>
    </>
  );
}
