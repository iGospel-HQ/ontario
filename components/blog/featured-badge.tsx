"use client";

import { useState } from "react";
import { Award, Check, Copy } from "lucide-react";
import { absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

const STYLES = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
] as const;

/**
 * "Are you the artist?" box under a music post: a "Featured on iGospel"
 * badge with ready-to-paste code that links back to this post. Artists add it
 * to their websites, which sends visitors (and search engines) to iGospel.
 */
export function FeaturedBadge({ slug, title }: { slug: string; title: string }) {
  const [style, setStyle] = useState<(typeof STYLES)[number]["id"]>("dark");
  const [copied, setCopied] = useState(false);
  const postUrl = absoluteUrl(`/blog/${slug}`);
  const badgeUrl = absoluteUrl(`/badges/featured-on-igospel-${style}.svg`);
  const code = `<a href="${postUrl}" target="_blank" rel="noopener" title="${title.replace(/"/g, "&quot;")} on iGospel"><img src="${badgeUrl}" alt="Featured on iGospel" width="200" height="56" style="border:0" /></a>`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked: the code is selectable in the box.
    }
  };

  return (
    <details className="group my-8 rounded-2xl border border-border bg-secondary/40 p-5 open:bg-secondary/60">
      <summary className="flex cursor-pointer list-none items-center gap-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        <Award className="size-5 shrink-0 text-accent" aria-hidden="true" />
        <span className="flex-1">Are you the artist? Add a &ldquo;Featured on iGospel&rdquo; badge to your website</span>
        <span className="text-xs font-normal text-muted-foreground group-open:hidden">Show</span>
      </summary>

      <div className="mt-5 space-y-4">
        <p className="text-sm text-muted-foreground">
          Put this badge on your website or link page. It links your fans straight to this song on iGospel.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <div className={cn("rounded-xl p-4", style === "dark" ? "bg-white" : "bg-neutral-900")}>
            {/* eslint-disable-next-line @next/next/no-img-element -- the exact file artists will embed */}
            <img src={`/badges/featured-on-igospel-${style}.svg`} alt="Featured on iGospel" width={200} height={56} />
          </div>
          <div className="flex gap-2" role="radiogroup" aria-label="Badge colour">
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={style === s.id}
                onClick={() => setStyle(s.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition",
                  style === s.id ? "border-accent bg-accent text-white" : "border-border hover:border-accent",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            readOnly
            value={code}
            rows={3}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Badge code"
            className="w-full resize-none rounded-xl border border-border bg-background p-3 pr-24 font-mono text-xs text-muted-foreground"
          />
          <button
            type="button"
            onClick={copy}
            className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent/90"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy code"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Paste it into your website&apos;s HTML (on WordPress, use a &ldquo;Custom HTML&rdquo; block). On Linktree or
          social bios, just add the song link: <span className="break-all font-medium">{postUrl}</span>
        </p>
      </div>
    </details>
  );
}
