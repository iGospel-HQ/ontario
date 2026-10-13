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
  title: "iGospel - Blog & Music Platform",
  absoluteTitle: true,
  description: "Discover curated music, artists, and editorial content all in one place",
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
  const newest = unique(latest, heroSlugs).slice(0, 10);
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
      <div className="mb-8 px-4 md:px-6 lg:hidden">
        <VerseOfTheDay verse={verse} />
      </div>

      {/* Newest posts + sidebar (verse of the day, chart, playlist) */}
      <div className="grid gap-10 px-4 md:px-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <SectionHeading title="Newest Posts" href="/blog" />
          <NewestList stories={newest} musicSlugs={musicSlugs} />
        </section>
        <aside className="space-y-8">
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
