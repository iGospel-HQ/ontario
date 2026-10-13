import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink, Headphones, Play, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ChartTrack, HomepagePost, PostSummary } from "@/types/api";

/** One shape for posts from the homepage API and the post lists. */
export interface HomeStory {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  date: string;
  author: string;
  label: string;
}

export const fromHomepage = (p: HomepagePost): HomeStory => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  image: p.featured_image,
  date: p.publish_date,
  author: p.author,
  label: p.category || "Gospel",
});

export const fromSummary = (p: PostSummary): HomeStory => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  image: p.featured_image,
  date: p.publish_date,
  author: p.author_name,
  label: p.genres?.[0]?.name || "Gospel",
});

const shortDate = (iso: string) => formatDate(iso, "MMM d, yyyy");

/** Section heading with an accent underline and an optional "see all" link. */
export function SectionHeading({ title, href, dark }: { title: string; href?: string; dark?: boolean }) {
  return (
    <div className={cn("mb-5 flex items-end justify-between gap-4 border-b pb-2", dark ? "border-white/15" : "border-rule")}>
      <h2 className={cn("relative font-sans text-lg font-extrabold uppercase tracking-wide", dark ? "text-white" : "text-text")}>
        {title}
        <span className="absolute -bottom-[9px] left-0 h-[3px] w-12 rounded-full bg-accent" aria-hidden="true" />
      </h2>
      {href && (
        <Link href={href} className={cn("inline-flex items-center gap-1 text-sm font-semibold hover:text-accent", dark ? "text-white/70" : "text-meta")}>
          See all <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

/** Image with the title over it (hero tiles). */
function OverlayTile({ story, className, large, priority }: { story: HomeStory; className?: string; large?: boolean; priority?: boolean }) {
  return (
    <Link href={`/blog/${story.slug}`} className={cn("group relative block overflow-hidden rounded-2xl bg-[#0c0c0c]", className)}>
      <Image
        src={story.image || "/placeholder.svg"}
        alt=""
        fill
        priority={priority}
        sizes={large ? "(min-width: 1024px) 760px, 100vw" : "(min-width: 1024px) 380px, 100vw"}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
      <div className={cn("absolute inset-x-0 bottom-0 text-white", large ? "p-6 md:p-8" : "p-4 md:p-5")}>
        <span className="inline-block rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
          {story.label}
        </span>
        <h3
          className={cn(
            "mt-2 font-serif font-bold leading-tight transition-colors group-hover:text-white/90",
            large ? "text-2xl md:text-4xl" : "text-lg line-clamp-2",
          )}
        >
          {story.title}
        </h3>
        {large && story.excerpt && <p className="mt-2 hidden max-w-2xl text-[15px] text-white/75 line-clamp-2 md:block">{story.excerpt}</p>}
        <p className="mt-2 text-xs text-white/70">
          {story.author} · {shortDate(story.date)}
        </p>
      </div>
    </Link>
  );
}

/** GMusicPlus-style hero: one big story beside two stacked ones. */
export function HomeHero({ stories }: { stories: HomeStory[] }) {
  const [lead, ...rest] = stories;
  if (!lead) return null;
  const side = rest.slice(0, 2);
  return (
    <section className="grid gap-3 px-4 pt-6 md:px-6 lg:grid-cols-3" aria-label="Top stories">
      <OverlayTile story={lead} large priority className={cn("h-80 md:h-[460px]", side.length ? "lg:col-span-2" : "lg:col-span-3")} />
      {side.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {side.map((s) => (
            <OverlayTile key={s.id} story={s} className="h-56 md:h-[224px]" />
          ))}
        </div>
      )}
    </section>
  );
}

/** Small list row: thumbnail, title, date. */
function ListRow({ story, dark }: { story: HomeStory; dark?: boolean }) {
  return (
    <Link href={`/blog/${story.slug}`} className="group flex gap-3">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-shade">
        <Image src={story.image || "/placeholder.svg"} alt="" fill sizes="80px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="min-w-0">
        <h3 className={cn("font-semibold leading-snug line-clamp-2 group-hover:text-accent", dark ? "text-white" : "text-text")}>
          {story.title}
        </h3>
        <p className={cn("mt-1 text-xs", dark ? "text-white/50" : "text-meta")}>{shortDate(story.date)}</p>
      </div>
    </Link>
  );
}

/**
 * CeeNaija-style list: two columns of square thumbnails with the title beside
 * them; posts with songs get a play icon on the thumbnail.
 */
export function NewestList({ stories, musicSlugs }: { stories: HomeStory[]; musicSlugs: Set<string> }) {
  return (
    <ul className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
      {stories.map((story) => (
        <li key={story.id}>
          <Link href={`/blog/${story.slug}`} className="group flex items-start gap-4">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-shade sm:size-[104px]">
              <Image
                src={story.image || "/placeholder.svg"}
                alt=""
                fill
                sizes="104px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {musicSlugs.has(story.slug) && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex size-9 items-center justify-center rounded-full bg-black/55 text-white ring-2 ring-white/80 backdrop-blur-sm transition group-hover:bg-accent group-hover:ring-accent">
                    <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
                  </span>
                </span>
              )}
            </div>
            <div className="min-w-0 pt-1">
              <h3 className="font-semibold leading-snug text-text line-clamp-3 group-hover:text-accent">{story.title}</h3>
              <p className="mt-1.5 text-xs text-meta">
                {story.label} · {shortDate(story.date)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Card: image, label, title, excerpt. */
export function StoryCard({ story }: { story: HomeStory }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-shade">
        <Image src={story.image || "/placeholder.svg"} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
          {story.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg font-bold leading-snug line-clamp-2">
          <Link href={`/blog/${story.slug}`} className="after:absolute after:inset-0">
            {story.title}
          </Link>
        </h3>
        {story.excerpt && <p className="mt-1.5 text-sm text-[#555] line-clamp-2">{story.excerpt}</p>}
        <p className="mt-auto pt-3 text-xs text-meta">
          {story.author} · {shortDate(story.date)}
        </p>
      </div>
    </article>
  );
}

/** GMusicPlus-style dark "New Music" block: big cover + list. */
export function NewMusicBlock({ stories }: { stories: HomeStory[] }) {
  const [lead, ...rest] = stories;
  if (!lead) return null;
  return (
    <section className="mx-4 rounded-3xl bg-[#0c0c0c] p-5 text-white md:mx-6 md:p-8">
      <SectionHeading title="New Music" href="/music" dark />
      <div className="grid gap-6 lg:grid-cols-2">
        <Link href={`/blog/${lead.slug}`} className="group block">
          <div className="relative aspect-square overflow-hidden rounded-2xl sm:aspect-[16/10]">
            <Image src={lead.image || "/placeholder.svg"} alt="" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-bold">
              <Headphones className="size-3.5" aria-hidden="true" /> Listen &amp; download
            </span>
          </div>
          <h3 className="mt-4 font-serif text-2xl font-bold leading-tight group-hover:text-accent">{lead.title}</h3>
          {lead.excerpt && <p className="mt-2 text-sm text-white/65 line-clamp-2">{lead.excerpt}</p>}
        </Link>
        <div className="flex flex-col gap-4">
          {rest.slice(0, 5).map((s) => (
            <ListRow key={s.id} story={s} dark />
          ))}
        </div>
      </div>
    </section>
  );
}

/** CeeNaija-style sections, one per genre: a card and a list. */
export function GenreSections({ stories }: { stories: HomeStory[] }) {
  const byGenre = new Map<string, HomeStory[]>();
  for (const s of stories) byGenre.set(s.label, [...(byGenre.get(s.label) ?? []), s]);
  const sections = [...byGenre.entries()].filter(([, list]) => list.length >= 2).sort((a, b) => b[1].length - a[1].length).slice(0, 4);
  if (!sections.length) return null;
  return (
    <div className="grid gap-10 px-4 md:px-6 lg:grid-cols-2">
      {sections.map(([genre, list]) => (
        <section key={genre}>
          <SectionHeading title={genre} href={`/search?q=${encodeURIComponent(genre)}`} />
          <div className="grid gap-4 sm:grid-cols-2">
            <StoryCard story={list[0]} />
            <div className="flex flex-col gap-4">
              {list.slice(1, 4).map((s) => (
                <ListRow key={s.id} story={s} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export interface Verse {
  reference: string;
  text: string;
  url: string;
  version: string;
}

/** Today's verse (BibleGateway, KJV). */
export function VerseOfTheDay({ verse }: { verse: Verse | null }) {
  if (!verse) return null;
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a0a10] via-[#0c0c0c] to-[#3a0d1c] p-6 text-white">
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-accent/25 blur-3xl" />
      <p className="relative flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
        <BookOpen className="size-4" aria-hidden="true" /> Verse of the day
      </p>
      <blockquote className="relative mt-4 font-serif text-xl italic leading-relaxed">&ldquo;{verse.text}&rdquo;</blockquote>
      <a href={verse.url} target="_blank" rel="noopener noreferrer" className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white">
        {verse.reference} ({verse.version}) <ExternalLink className="size-3.5" aria-hidden="true" />
      </a>
    </section>
  );
}

/** This month's top 5 with a link to the full chart. */
export function ChartTop5({ tracks }: { tracks: ChartTrack[] }) {
  if (!tracks.length) return null;
  return (
    <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <SectionHeading title="Top 5 this month" href="/charts" />
      <ol className="space-y-3">
        {tracks.slice(0, 5).map((t) => {
          const row = (
            <>
              <span className={cn("w-5 text-center text-lg font-extrabold", t.rank === 1 ? "text-accent" : "text-meta")}>{t.rank}</span>
              <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-shade">
                {t.image && <Image src={t.image} alt="" fill sizes="44px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{t.title}</p>
                <p className="truncate text-xs text-meta">{t.artist_name}</p>
              </div>
            </>
          );
          return (
            <li key={t.id}>
              {t.post_slug ? (
                <Link href={`/blog/${t.post_slug}`} className="flex items-center gap-3 hover:text-accent">
                  {row}
                </Link>
              ) : (
                <div className="flex items-center gap-3">{row}</div>
              )}
            </li>
          );
        })}
      </ol>
      <Link href="/charts/report" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
        <TrendingUp className="size-4" aria-hidden="true" /> Monthly chart report
      </Link>
    </section>
  );
}
