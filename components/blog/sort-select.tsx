"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** "Latest First" / "Title A–Z" sort, stored in `?sort=`. */
export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get("sort") === "title" ? "title" : "date";

  const onChange = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "title") params.set("sort", "title");
    else params.delete("sort");
    params.delete("page");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="sm:w-48">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 w-full rounded-none border-rule bg-white" aria-label="Sort by">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-popover text-popover-foreground">
          <SelectItem value="date">Latest First</SelectItem>
          <SelectItem value="title">Title A–Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
