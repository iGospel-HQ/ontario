"use client";

import Link from "next/link";
import { Upload, Home, Music, Compass, HelpCircle, Phone, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/use-auth-store";

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  const desktopNavigation = [
    { name: "Music", href: "/music" },
    { name: "Explore", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const mobileTabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Music", href: "/music", icon: Music },
    { name: "Explore", href: "/blog", icon: Compass },
    { name: "Contact", href: "/contact", icon: Phone },
    ...(!isAuthenticated ? [{ name: "Upload", href: "/upload", icon: Upload }] : [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }]),
  ];

  return (
    <>
      {/* ===== TOP NAV (DESKTOP + MOBILE HEADER) ===== */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-10">
          {/* Logo */}
          <Link
            href="/"
            className="rounded-md bg-black p-2 text-xl font-bold tracking-wider"
          >
            <img src="/logo.png" alt="logo" className="h-5 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-8">
            {desktopNavigation.map((item) => (
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

          {/* Desktop Auth / Upload */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <Button variant="default" className="text-accent">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                    <Link href="/upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                    </Link>
                  </Button>
              
            )}
          </div>
        </div>
      </nav>
      {/* ===== MOBILE BOTTOM TAB NAV ===== */}
      <div className="fixed bottom-0 left-0 right-0  z-50 border-t border-border bg-background md:hidden">
        <div className="flex justify-around items-center py-2">
          {mobileTabs.map(({ name, href, icon: Icon }) => {
            const isActive = pathname.split("/")[1] === href.split("/")[1];

            return (
              <Link
                key={name}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 w-14 rounded-lg text-[10px] font-medium transition-colors",
                  isActive
                    ? "text-white bg-red-600"
                    : "text-muted-foreground hover:text-white hover:bg-red-600"
                )}
              >
                <Icon className="h-4 w-4" />
                {name}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
