import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NotFoundContent() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-24">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">404</p>
      <h1 className="mt-3 text-4xl md:text-5xl font-black text-gray-900">Page not found</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/">Go to the homepage</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/blog">Read the latest posts</Link>
        </Button>
      </div>
    </section>
  );
}

export const notFoundMetadata = {
  title: { absolute: "Page not found - iGospel" },
  robots: { index: false, follow: true },
};
