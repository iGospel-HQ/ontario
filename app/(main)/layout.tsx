import type React from "react";
import ClientLayout from "./ClientLayout";

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
