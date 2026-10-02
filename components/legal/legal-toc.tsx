"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocEntry {
  id: string;
  title: string;
}

/** "On this page" list; highlights the section currently being read. */
export function LegalToc({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState(entries[0]?.id);

  useEffect(() => {
    const headings = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);

    // A section is "current" once its top passes the upper third of the screen.
    const observer = new IntersectionObserver(
      (records) => {
        const visible = records.filter((r) => r.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -66% 0px" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [entries]);

  return (
    <ol className="space-y-0.5 border-l border-rule">
      {entries.map((entry, idx) => (
        <li key={entry.id}>
          <a
            href={`#${entry.id}`}
            onClick={() => setActive(entry.id)}
            aria-current={active === entry.id ? "location" : undefined}
            className={cn(
              "-ml-px flex gap-2 border-l-2 py-1.5 pl-4 pr-2 text-[13px] leading-snug transition-colors",
              active === entry.id
                ? "border-accent font-semibold text-text"
                : "border-transparent text-meta hover:border-rule hover:text-text",
            )}
          >
            <span className="tabular-nums text-accent/80">{String(idx + 1).padStart(2, "0")}</span>
            <span>{entry.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
