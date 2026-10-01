import "./globals.css";
import type React from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ReactQueryProvider } from "@/lib/react-query";
import { AudioProvider } from "@/providers/audio-provider";
import { FloatingAudioButtons } from "@/components/layout/floating-audio-button";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site";

// Geist (latin, variable weight) self-hosted so builds don't depend on Google Fonts.
const geist = localFont({
  src: "./fonts/Geist-Variable.woff2",
  weight: "100 900",
  variable: "--font-geist",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  weight: "100 900",
  variable: "--font-geist-mono",
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
      className={`${geist.variable} ${geistMono.variable}`}
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
