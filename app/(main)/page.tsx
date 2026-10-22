import { getChart, getHomepage, getMusicPosts, getPosts, getVerseOfTheDay } from "@/lib/api/queries";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { QuickLinks } from "@/components/home/quick-links";
import { HomePlaylist } from "@/components/home/home-playlist";
import {
  ChartTop5,
  GenreSections,
  HomeHero,
  NewMusicBlock,
  SectionHeading,
  NewestList,
  VerseOfTheDay,
  fromHomepage,
  fromSummary,
  type HomeStory,
} from "@/components/home/home-magazine";
import { JsonLd } from "@/components/shared/json-ld";

// Rebuilt in the background at most every minute.
export const revalidate = 60;

export const metadata = pageMetadata({
  // What Google shows for "iGospel": say plainly what the site is, in the words people search with.
  title: "iGospel | Download Latest Nigerian Gospel Songs & Music",
  absoluteTitle: true,
  description:
    "Listen to and download the latest Nigerian gospel songs, praise and worship music free on iGospel. New songs daily, artists, charts and gospel news.",
  path: "/",
});

/** Keeps the first of each post (the same post can come from several lists). */
function unique(stories: HomeStory[], skip = new Set<string>()) {
  const seen = new Set(skip);
  return stories.filter((s) => (seen.has(s.slug) ? false : (seen.add(s.slug), true)));
}

export default async function HomePage() {
  const [data, posts, musicPosts, chart, verse] = await Promise.all([
    getHomepage().catch(() => null),
    getPosts({ page: 1 }).catch(() => null),
    getMusicPosts({ page: 1 }).catch(() => null),
    getChart().catch(() => null),
    getVerseOfTheDay().catch(() => null),
  ]);

  const latest = (posts?.results ?? []).map(fromSummary);
  // Hero: the featured posts first, topped up with the newest ones.
  const hero = unique([...(data?.featured_posts ?? []).map(fromHomepage), ...latest]).slice(0, 3);
  const heroSlugs = new Set(hero.map((s) => s.slug));
  // Phones have no hero, so their list starts with the hero's posts (hidden on larger screens).
  const newest = [...hero, ...unique(latest, heroSlugs).slice(0, 10)];
  const music = unique((musicPosts?.results ?? []).map(fromSummary)).slice(0, 6);
  const musicSlugs = new Set((musicPosts?.results ?? []).map((p) => p.slug));

  return (
    <div className="min-h-screen pb-14">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": absoluteUrl("/#organization"),
            name: siteConfig.legalName,
            alternateName: siteConfig.name,
            url: absoluteUrl("/"),
            logo: absoluteUrl(siteConfig.logo),
            email: siteConfig.emails.contact,
            sameAs: Object.values(siteConfig.social),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": absoluteUrl("/#website"),
            name: siteConfig.name,
            url: absoluteUrl("/"),
            description: siteConfig.description,
            publisher: { "@id": absoluteUrl("/#organization") },
            potentialAction: {
              "@type": "SearchAction",
              target: `${absoluteUrl("/search")}?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
        ]}
      />
      <h1 className="sr-only">
        {siteConfig.name} — {siteConfig.tagline}
      </h1>

      <HomeHero stories={hero} />
      <QuickLinks />

      {/* Newest posts + sidebar (verse of the day, chart, playlist) */}
      <div className="grid grid-cols-1 gap-10 px-4 md:px-6 lg:grid-cols-3">
        <section className="min-w-0 lg:col-span-2">
          <SectionHeading title="Newest Posts" href="/blog" />
          <NewestList stories={newest} musicSlugs={musicSlugs} phoneOnly={heroSlugs} />
          <div className="mt-8 lg:hidden">
            <VerseOfTheDay verse={verse} />
          </div>
        </section>
        <aside className="min-w-0 space-y-8">
          <div className="hidden lg:block">
            <VerseOfTheDay verse={verse} />
          </div>
          <ChartTop5 tracks={chart?.tracks ?? []} />
          {(data?.igospel_playlist?.length ?? 0) > 0 && <HomePlaylist tracks={data?.igospel_playlist ?? []} />}
        </aside>
      </div>

      <div className="mt-14">
        <NewMusicBlock stories={music} />
      </div>

      <div className="mt-14">
        <GenreSections stories={latest} />
      </div>
    </div>
  );
}
