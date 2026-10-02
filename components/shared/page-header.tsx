import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** WordPress-style archive/page header: breadcrumb, title and optional description. */
export function PageHeader({
  title,
  description,
  crumbs = [],
}: {
  title: string;
  description?: string;
  /** Intermediate breadcrumb links between Home and the current page. */
  crumbs?: { name: string; href: string }[];
}) {
  return (
    <div className="border-b border-rule bg-shade px-4 md:px-6 py-8">
      <nav aria-label="Breadcrumb" className="entry-meta mb-3">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
          </li>
          {crumbs.map((crumb) => (
            <li key={crumb.href} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              <Link href={crumb.href} className="hover:text-accent">
                {crumb.name}
              </Link>
            </li>
          ))}
          <li className="flex items-center gap-1.5" aria-current="page">
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <span className="text-text">{title}</span>
          </li>
        </ol>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
      {description && <p className="mt-2 text-[15px] text-meta">{description}</p>}
    </div>
  );
}
