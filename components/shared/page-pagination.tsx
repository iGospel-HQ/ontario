import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Builds `basePath?…&page=N`, dropping page=1 so the first page keeps a clean URL. */
export function pageHref(basePath: string, params: Record<string, string | undefined>, page: number) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) search.set(key, value);
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}

/** Page numbers to show: first, last, current ±1, with gaps as null. */
function pageNumbers(page: number, totalPages: number) {
  const pages: (number | null)[] = [];
  for (let n = 1; n <= totalPages; n++) {
    if (n === 1 || n === totalPages || Math.abs(n - page) <= 1) pages.push(n);
    else if (pages[pages.length - 1] !== null) pages.push(null);
  }
  return pages;
}

const box = "inline-flex h-9 min-w-9 items-center justify-center border px-3 text-[13px] font-bold transition-colors";

/** WordPress-style numbered pagination ("« Prev 1 … 4 5 6 … 12 Next »") as crawlable links. */
export function PagePagination({
  basePath,
  params = {},
  page,
  totalPages,
}: {
  basePath: string;
  params?: Record<string, string | undefined>;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const href = (n: number) => pageHref(basePath, params, n);

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-1.5">
      {page > 1 && (
        <Link href={href(page - 1)} rel="prev" className={`${box} border-rule hover:border-accent hover:bg-accent hover:text-white`}>
          <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
          Prev
        </Link>
      )}

      {pageNumbers(page, totalPages).map((n, i) =>
        n === null ? (
          <span key={`gap-${i}`} className="px-1 text-meta" aria-hidden="true">
            &hellip;
          </span>
        ) : n === page ? (
          <span key={n} aria-current="page" className={`${box} border-accent bg-accent text-white`}>
            {n}
          </span>
        ) : (
          <Link key={n} href={href(n)} aria-label={`Page ${n}`} className={`${box} border-rule hover:border-accent hover:bg-accent hover:text-white`}>
            {n}
          </Link>
        ),
      )}

      {page < totalPages && (
        <Link href={href(page + 1)} rel="next" className={`${box} border-rule hover:border-accent hover:bg-accent hover:text-white`}>
          Next
          <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}

/** Parses `?page=` into a positive integer. */
export function parsePage(value: string | string[] | undefined) {
  const page = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
