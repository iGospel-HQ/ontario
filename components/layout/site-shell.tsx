import type React from "react";
import { getBackground } from "@/lib/api/queries";
import type { BlogBackground } from "@/types/api";
import { AudioPlayer } from "@/components/layout/audio-player";
import { BackToTop } from "@/components/layout/back-to-top";
import { Footer } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/site-header";

// Widths the Next image optimizer accepts (default deviceSizes).
const OPTIMIZER_WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

/** Image optimizer URL at the smallest allowed width covering `minWidth` px. */
function optimized(src: string, minWidth: number) {
  const width = OPTIMIZER_WIDTHS.find((w) => w >= minWidth) ?? 3840;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

/**
 * Inline styles for an admin-scheduled background. Scaled images ("cover" and
 * tiles with a column count) go through the Next image optimizer (resized,
 * WebP/AVIF); "natural" and plain tiles keep the original pixels because their
 * size on screen is the image's own size.
 */
function backgroundStyle(bg: BlogBackground): React.CSSProperties {
  const color = bg.background_color || undefined;
  if (bg.display === "tile" && bg.tile_columns) {
    // N copies across the screen; height follows the image's proportions, so
    // every copy shows the whole image (never cropped or stretched).
    const columns = Math.min(Math.max(bg.tile_columns, 1), 12);
    return {
      backgroundColor: color,
      backgroundImage: `url("${optimized(bg.image, Math.ceil(2560 / columns))}")`,
      backgroundRepeat: "repeat",
      backgroundSize: `${100 / columns}% auto`,
      backgroundPosition: "0 0",
      backgroundAttachment: "fixed",
    };
  }
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
  return {
    backgroundColor: color,
    backgroundImage: `url("${optimized(bg.image, 1920)}")`,
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
