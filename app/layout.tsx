import "./globals.css";
import type React from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ReactQueryProvider } from "@/lib/react-query";
import { AudioProvider } from "@/providers/audio-provider";
import { FloatingAudioButtons } from "@/components/layout/floating-audio-button";
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
  icons: {
    icon: [{ url: "/icon-32x32.png" }],
    apple: "/icon.png",
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
