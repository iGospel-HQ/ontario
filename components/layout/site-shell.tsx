import type React from "react";
import { getBackground, getSiteWideAds } from "@/lib/api/queries";
import { BannerAd } from "@/components/shared/banner-ad";
import type { BlogBackground } from "@/types/api";
import { AudioPlayer } from "@/components/layout/audio-player";
import { BackToTop } from "@/components/layout/back-to-top";
import { Footer } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MobileAppBar } from "@/components/layout/mobile/mobile-app-bar";
import { MobileTabBar } from "@/components/layout/mobile/mobile-tab-bar";

/**
 * The background image as uploaded. It used to go through Vercel's image
 * optimizer (/_next/image), which answers 402 once the plan's allowance is
 * used up (see images.unoptimized in next.config.ts), so the file is served
 * straight from the API's media instead.
 */
function optimized(src: string, _minWidth: number) {
  return src;
}

/**
 * Inline styles for an admin-scheduled background ("cover", "natural", or
 * tiles, optionally a set number of columns across the screen).
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
  const [background, siteAds] = await Promise.all([getBackground(), getSiteWideAds()]);
  // "Whole site" ads: one header banner under the menu and one above the footer, on every page.
  const headerAd = siteAds.find((ad) => ad.position === "header");
  const footerAd = siteAds.find((ad) => ad.position === "footer");

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
      {/* Phones: the white page fills the screen (no background peeking below short pages). */}
      <div className="mx-auto flex min-h-dvh max-w-[1200px] flex-col bg-white shadow-[0_0_25px_rgba(0,0,0,0.08)] md:block md:min-h-0">
        <MobileAppBar />
        <SiteHeader />
        {headerAd && <BannerAd ad={headerAd} />}
        <main id="main-content" className="min-h-[60vh] flex-1">
          {children}
        </main>
        {footerAd && <BannerAd ad={footerAd} />}
        <Footer />
        <MobileTabBar />
      </div>
      <AudioPlayer />
      <BackToTop />
    </div>
  );
}
