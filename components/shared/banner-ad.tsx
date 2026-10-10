import Image from "next/image";
import type { AdBanner } from "@/types/api";
import { cn } from "@/lib/utils";

/** Full-width sponsored banner: header/footer ads (admin: Blog → Ad banners). */
export function BannerAd({ ad, className }: { ad: AdBanner; className?: string }) {
  return (
    <a
      href={ad.link}
      title={ad.title}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={cn("relative block h-24 w-full md:h-32", className)}
    >
      <Image src={ad.image} alt={ad.title} fill sizes="(min-width: 1200px) 1200px, 100vw" className="object-cover" />
    </a>
  );
}
