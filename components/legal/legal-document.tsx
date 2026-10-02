import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, ChevronDown, Info, Mail } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";
import { LegalToc } from "./legal-toc";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

const LEGAL_PAGES = [
  { href: "/terms", label: "Terms of Use" },
  { href: "/privacy", label: "Privacy Policy" },
];

export const SUPPORT_EMAIL = "support@igospel.ng";

/** Shared layout for the Terms and Privacy pages: header, contents list, numbered sections. */
export function LegalDocument({
  title,
  description,
  path,
  updated,
  intro,
  sections,
  closing,
}: {
  title: string;
  description: string;
  path: string;
  /** Human-readable date the text last changed. */
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
  closing: ReactNode;
}) {
  const toc = sections.map(({ id, title }) => ({ id, title }));

  return (
    <>
      <PageHeader title={title} description={description} />

      <div className="px-4 py-10 md:px-6 md:py-12">
        {/* Meta row: last updated + switch between the two documents */}
        <div className="mb-10 flex flex-col gap-4 border-b border-rule pb-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="entry-meta flex items-center gap-2 uppercase">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            Last updated {updated}
          </p>
          <nav aria-label="Legal documents" className="inline-flex rounded-full bg-shade p-1 text-sm">
            {LEGAL_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                aria-current={page.href === path ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-1.5 font-semibold transition-colors",
                  page.href === path ? "bg-text text-white shadow-sm" : "text-meta hover:text-text",
                )}
              >
                {page.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
          {/* Contents: sticky sidebar on desktop, collapsible on mobile */}
          <aside>
            <div className="lg:sticky lg:top-20">
              <details className="group rounded-lg border border-rule lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold">
                  On this page
                  <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="px-2 pb-3">
                  <LegalToc entries={toc} />
                </div>
              </details>
              <div className="hidden lg:block">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-meta">On this page</p>
                <LegalToc entries={toc} />
              </div>
            </div>
          </aside>

          <article className="min-w-0 max-w-3xl">
            <div className="legal-body text-[17px]">{intro}</div>

            <div className="mt-12 space-y-12">
              {sections.map((section, idx) => (
                <section key={section.id} aria-labelledby={section.id} className="border-t border-rule pt-10 first:border-t-0 first:pt-0">
                  <h2 id={section.id} className="mb-4 flex scroll-mt-24 items-baseline gap-3 text-xl font-bold text-text md:text-2xl">
                    <span className="text-sm font-bold tabular-nums text-accent">{String(idx + 1).padStart(2, "0")}</span>
                    {section.title}
                  </h2>
                  <div className="legal-body">{section.body}</div>
                </section>
              ))}
            </div>

            {/* Contact card */}
            <div className="mt-14 flex flex-col gap-5 rounded-2xl bg-neutral-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between md:p-8">
              <div>
                <p className="text-lg font-bold">Questions about this {title.toLowerCase()}?</p>
                <p className="mt-1 text-sm text-white/70">Our team will get back to you as soon as possible.</p>
              </div>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                <Mail className="size-4" aria-hidden="true" />
                {SUPPORT_EMAIL}
              </a>
            </div>

            <div className="mt-10 text-center text-sm text-meta">
              {closing}
              <p className="mt-3 font-heading text-lg italic text-text">To God be the glory!</p>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

/** Highlighted statement inside a section (e.g. "We do not sell your data"). */
export function LegalCallout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 text-[15px] text-text">
      <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

/** Email link styled for the legal body. */
export function SupportEmail() {
  return <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;
}
