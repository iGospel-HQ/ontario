import type React from "react";
import { AudioPlayer } from "@/components/layout/audio-player";
import { BackToTop } from "@/components/layout/back-to-top";
import { Footer } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/site-header";

/** Public page frame: a boxed blog layout on the site background. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-bg min-h-screen md:px-6 md:py-6">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <div className="mx-auto max-w-[1200px] bg-white shadow-[0_0_25px_rgba(0,0,0,0.08)]">
        <SiteHeader />
        <main id="main-content" className="min-h-[60vh]">
          {children}
        </main>
        <Footer />
      </div>
      <AudioPlayer />
      <BackToTop />
    </div>
  );
}
