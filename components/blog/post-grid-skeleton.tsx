import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PostGridSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid gap-8 md:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <Skeleton className="h-56 w-full rounded-t-lg bg-muted" />
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-6 w-4/5 bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-3/4 bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
