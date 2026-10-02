"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Shown inside the site layout when a page fails to render (e.g. the API is down). */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-24">
      <h1 className="text-3xl md:text-4xl font-black text-gray-900">Something went wrong</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        We couldn&apos;t load this page right now. Please try again in a moment.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button onClick={reset} className="bg-accent text-accent-foreground hover:bg-accent/90">
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go to the homepage</Link>
        </Button>
      </div>
    </section>
  );
}
