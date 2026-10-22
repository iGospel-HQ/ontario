import "./globals.css";
import type React from "react";
import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ReactQueryProvider } from "@/lib/react-query";
import { AudioProvider } from "@/providers/audio-provider";
import { FloatingAudioButtons } from "@/components/layout/floating-audio-button";
import { NavigationProgress } from "@/components/layout/navigation-progress";
import { PageTracker } from "@/components/layout/page-tracker";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site";

// Classic blog typography, self-hosted (latin, variable weight):
// Open Sans for body text and menus, Lora (serif) for headings and post titles.
const openSans = localFont({
  src: "./fonts/OpenSans-Variable.woff2",
  weight: "300 800",
  variable: "--font-open-sans",
  display: "swap",
});
const lora = localFont({
  src: [
    { path: "./fonts/Lora-Variable.woff2", weight: "400 700", style: "normal" },
    { path: "./fonts/Lora-Italic-Variable.woff2", weight: "400 700", style: "italic" },
  ],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  // Google shows the site icon next to results only if it's at least 48x48 (a multiple of 48).
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48 32x32 16x16" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
  alternates: {
    types: { "application/rss+xml": [{ url: "/feed.xml", title: `${siteConfig.name} RSS` }] },
  },
  openGraph: {
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [{ ...siteConfig.ogImage, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  // Draw under the notch / home indicator; the app bars pad with safe-area insets.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${openSans.variable} ${lora.variable}`}
    >
      <body className="font-sans antialiased">
        <Suspense>
          <NavigationProgress />
        </Suspense>
        <PageTracker />
        <Toaster position="top-center"/>
        <ReactQueryProvider>
          <AudioProvider />
          <FloatingAudioButtons />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
