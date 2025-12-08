import type React from "react";
import ClientLayout from "./ClientLayout";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "iGospel - Blog & Music Platform",
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
