import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

/** Square cover with a title and a line under it (sermon series and playlists grids). */
export function CoverCard({
  href,
  title,
  subtitle,
  image,
}: {
  href: string;
  title: string;
  subtitle: string;
  image: string | null;
}) {
  return (
    <Link href={href} className="group block min-w-0">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-shade shadow-sm ring-1 ring-black/5 transition group-hover:shadow-lg">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <BookOpen className="absolute inset-0 m-auto h-10 w-10 text-accent" aria-hidden="true" />
        )}
      </div>
      <h2 className="mt-2.5 line-clamp-2 text-[15px] font-semibold leading-snug text-text group-hover:text-accent">
        {title}
      </h2>
      <p className="mt-0.5 truncate text-xs text-meta sm:text-[13px]">{subtitle}</p>
    </Link>
  );
}
