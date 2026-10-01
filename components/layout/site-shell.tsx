import type React from "react";
import { getBackground } from "@/lib/api/queries";
import type { BlogBackground } from "@/types/api";
import { AudioPlayer } from "@/components/layout/audio-player";
import { BackToTop } from "@/components/layout/back-to-top";
import { Footer } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/site-header";

/**
 * Inline styles for an admin-scheduled background. "cover" images go through
 * the Next image optimizer (resized, WebP/AVIF); "natural" and "tile" keep the
 * original pixels because their size on screen is the image's own size.
 */
function backgroundStyle(bg: BlogBackground): React.CSSProperties {
  const color = bg.background_color || undefined;
  if (bg.display === "tile") {
    return { backgroundColor: color, backgroundImage: `url("${bg.image}")`, backgroundRepeat: "repeat" };
  }
  if (bg.display === "natural") {
    return {
      backgroundColor: color,
      backgroundImage: `url("${bg.image}")`,
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
    };
  }
  const optimized = `/_next/image?url=${encodeURIComponent(bg.image)}&w=1920&q=75`;
  return {
    backgroundColor: color,
    backgroundImage: `url("${optimized}")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };
}

/** Public page frame: a boxed blog layout on the site background. */
export async function SiteShell({ children }: { children: React.ReactNode }) {
  // Scheduled background from the admin; none -> the built-in .site-bg default.
  const background = await getBackground();

  return (
    <div
      className={background ? "min-h-screen md:px-6 md:py-6" : "site-bg min-h-screen md:px-6 md:py-6"}
      style={background ? backgroundStyle(background) : undefined}
    >
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
