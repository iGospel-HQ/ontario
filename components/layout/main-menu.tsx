"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Home, LayoutDashboard, Menu, Search, Upload, X } from "lucide-react";
import { isActive, mainMenu } from "@/lib/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { cn } from "@/lib/utils";

/**
 * WordPress-style primary menu: a sticky brand-coloured bar with uppercase
 * items, hover/active highlight and a Music dropdown; a hamburger panel on mobile.
 */
export function MainMenu() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const cta = isAuthenticated
    ? { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }
    : { name: "Upload Music", href: "/upload", icon: Upload };

  return (
    <nav aria-label="Main" className="sticky top-0 z-40 bg-menu text-white shadow-md">
      <div className="flex items-stretch justify-between">
        {/* Desktop menu */}
        <ul className="hidden md:flex items-stretch">
          {mainMenu.map((item) => {
            const active = isActive(pathname, item.href);
            const linkClass = cn(
              "flex items-center gap-1 px-4 h-12 text-[13px] font-bold uppercase tracking-wider transition-colors",
              active ? "bg-black/25" : "hover:bg-black/20",
            );
            return (
              <li key={item.href} className="group relative">
                <Link href={item.href} className={linkClass} aria-current={active ? "page" : undefined}>
                  {item.href === "/" && <Home className="h-4 w-4" aria-hidden="true" />}
                  <span className={item.href === "/" ? "sr-only lg:not-sr-only" : undefined}>{item.name}</span>
                  {item.children && <ChevronDown className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />}
                </Link>
                {item.children && (
                  <ul className="invisible absolute left-0 top-full z-50 min-w-52 translate-y-1 border-t-2 border-black/30 bg-white py-1 text-text opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={cn(
                            "block px-4 py-2.5 text-[13px] font-semibold border-b border-rule last:border-0 hover:bg-shade hover:text-accent hover:pl-5 transition-all",
                            pathname === child.href && "text-accent",
                          )}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden flex items-center gap-2 px-4 h-12 text-[13px] font-bold uppercase tracking-wider"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          Menu
        </button>

        <div className="flex items-stretch">
          <Link
            href="/search"
            aria-label="Search"
            className="flex items-center px-4 h-12 hover:bg-black/20 md:hidden"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href={cta.href}
            className="flex items-center gap-2 px-4 h-12 bg-black/30 hover:bg-black/50 text-[13px] font-bold uppercase tracking-wider"
          >
            <cta.icon className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{cta.name}</span>
          </Link>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <ul id="mobile-menu" className="md:hidden border-t border-white/15 bg-white text-text shadow-lg">
          {mainMenu.map((item) => (
            <li key={item.href} className="border-b border-rule">
              <Link
                href={item.href}
                onClick={close}
                className={cn(
                  "block px-5 py-3 text-[13px] font-bold uppercase tracking-wider hover:text-accent",
                  isActive(pathname, item.href) && "text-accent",
                )}
              >
                {item.name}
              </Link>
              {item.children && (
                <ul className="pb-2">
                  {item.children
                    .filter((child) => child.href !== item.href)
                    .map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={close}
                          className={cn(
                            "block pl-9 pr-5 py-2 text-sm hover:text-accent",
                            pathname === child.href && "text-accent",
                          )}
                        >
                          — {child.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
