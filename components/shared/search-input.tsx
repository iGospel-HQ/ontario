"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Search-as-you-type box that keeps the query in the URL (`?q=`), so results
 * are server-rendered and shareable. Resets pagination on every change.
 * Falls back to a plain GET form without JavaScript.
 */
export function SearchInput({
  placeholder,
  className,
  inputClassName,
  showIcon = true,
  paramName = "q",
}: {
  placeholder: string;
  className?: string;
  inputClassName?: string;
  showIcon?: boolean;
  paramName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(paramName) ?? "");
  const [, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const update = (next: string) => {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.trim()) params.set(paramName, next.trim());
      else params.delete(paramName);
      params.delete("page");
      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    }, 300);
  };

  return (
    <form role="search" action={pathname} className={cn("relative", className)}>
      {showIcon && (
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
      )}
      <Input
        type="search"
        name={paramName}
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => update(e.target.value)}
        className={inputClassName}
      />
    </form>
  );
}
