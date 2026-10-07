import { getHomepage } from "@/lib/api/queries";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { HeroSection } from "@/components/home/hero-section";
import { HomeInfoSection } from "@/components/home/home-info-section";
import { QuickLinks } from "@/components/home/quick-links";
import { JsonLd } from "@/components/shared/json-ld";

// Rebuilt in the background at most every 5 minutes.
export const revalidate = 60;

export const metadata = pageMetadata({
  title: "iGospel - Blog & Music Platform",
  absoluteTitle: true,
  description: "Discover curated music, artists, and editorial content all in one place",
  path: "/",
});

export default async function HomePage() {
  const data = await getHomepage();

  return (
    <div className="min-h-screen">
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
      <HeroSection post={data?.featured_posts[0]} />
      <QuickLinks />
      <HomeInfoSection
        latestPosts={data?.latest_posts ?? []}
        featuredPosts={data?.featured_posts ?? []}
        randomPosts={data?.random_posts ?? []}
        playlist={data?.igospel_playlist ?? []}
      />
    </div>
  );
}
