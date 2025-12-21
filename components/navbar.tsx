"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./theme-toggler";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = [
    { name: "Music", href: "/music" },
    { name: "Explore", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between  max-w-5xl mx-auto px-4 py-4 md:px-10">
        <Link
          href="/"
          className="text-xl font-bold tracking-wider bg-black p-2 rounded-md"
        >
          <img src="/logo.png" alt="logo" className="w-full h-5" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                pathname === item.href ? "text-accent" : "hover:text-accent",
                "text-sm font-medium transition-colors"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Search */}
        <div className="hidden w-64 md:flex">
          {/* <ModeToggle /> */}
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery) {
                  router.push(`/search?q=${searchQuery}`);
                }
              }}
              className="bg-secondary"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-border px-4 py-4 md:hidden">
          <div className="mb-4">
            <Input
              type="search"
              placeholder="Search..."
              className="bg-secondary"
            />
          </div>
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  pathname === item.href ? "text-accent" : "hover:text-accent",
                  "block py-2 text-sm font-medium transition-colors"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
