import "./globals.css";
import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactQueryProvider } from "@/lib/react-query";
import { AudioProvider } from "@/providers/audio-provider";
import { FloatingAudioButtons } from "@/components/floating-audio-button";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "iGospel - Blog & Music Platform",
  description: "Discover curated music, artists, and editorial content",
  icons: {
    icon: [{ url: "/icon-32x32.png" }],
    apple: "/icon.png",
  },
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
        <ReactQueryProvider>
          <AudioProvider />
          <FloatingAudioButtons />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
