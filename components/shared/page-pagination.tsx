import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Builds `basePath?…&page=N`, dropping page=1 so the first page keeps a clean URL. */
export function pageHref(basePath: string, params: Record<string, string | undefined>, page: number) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) search.set(key, value);
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}

/** Previous / "Page X of Y" / Next controls as crawlable links. */
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

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-4 mt-12">
      {page > 1 ? (
        <Button variant="outline" size="icon" asChild>
          <Link href={pageHref(basePath, params, page - 1)} rel="prev" aria-label="Previous page">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled aria-label="Previous page">
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}

      <span className="text-sm font-medium">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Button variant="outline" size="icon" asChild>
          <Link href={pageHref(basePath, params, page + 1)} rel="next" aria-label="Next page">
            <ChevronRight className="h-5 w-5" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled aria-label="Next page">
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </nav>
  );
}

/** Parses `?page=` into a positive integer. */
export function parsePage(value: string | string[] | undefined) {
  const page = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
