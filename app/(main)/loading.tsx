import { Skeleton } from "@/components/ui/skeleton";

/**
 * Fallback for any public page without its own loading.tsx (post pages, home,
 * charts, artist/playlist pages, ...): shown the moment a link is clicked
 * while the server renders the page, so navigation never looks frozen.
 */
export default function Loading() {
  return (
    <div className="px-4 py-8 md:px-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-4 h-9 w-3/4 max-w-xl" />
      <Skeleton className="mt-3 h-4 w-56" />
      <Skeleton className="mt-8 aspect-[16/9] w-full max-w-3xl rounded-xl" />
      <div className="mt-8 max-w-3xl space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
