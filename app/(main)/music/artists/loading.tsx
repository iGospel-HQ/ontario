import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen px-4 md:px-10 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="text-center space-y-4">
            <Skeleton className="w-40 h-40 rounded-full mx-auto" />
            <Skeleton className="h-5 w-32 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
