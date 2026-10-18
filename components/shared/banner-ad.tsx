import Image from "next/image";
import type { AdBanner } from "@/types/api";
import { cn } from "@/lib/utils";

/**
 * A sponsored banner (admin: Blog → Ad banners), shown whole at its own shape:
 * a wide 1200x200 banner stays wide, a square one stays square (no cropping).
 */
export function BannerAd({ ad, className, sizes = "(min-width: 1200px) 1200px, 100vw" }: { ad: AdBanner; className?: string; sizes?: string }) {
  return (
    <a
      href={ad.link}
      title={ad.title}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={cn("block w-full overflow-hidden", className)}
    >
      <Image src={ad.image} alt={ad.title} width={0} height={0} sizes={sizes} className="h-auto w-full" />
    </a>
  );
}

/** Every ad for one spot on the page, stacked (nothing when there are none). */
export function AdSlot({ ads, className }: { ads: AdBanner[]; className?: string }) {
  if (!ads.length) return null;
  return (
    <div className={cn("space-y-4", className)}>
      {ads.map((ad) => (
        <BannerAd
          key={ad.id}
          ad={ad}
          className="rounded-xl"
          sizes="(min-width: 1280px) 820px, (min-width: 1024px) 66vw, 100vw"
        />
      ))}
    </div>
  );
}
