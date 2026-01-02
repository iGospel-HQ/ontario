"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const navigation = [
    { name: "Music", href: "/music" },
    { name: "Explore", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
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

        {/* Upload Dropdown (Desktop) */}
        <div className="hidden md:flex items-center">
          {isAuthenticated ? (
            <Button variant="default" className="w-full text-accent">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Button
                    variant="outline"
                    className="w-full border-accent text-accent"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Button variant="default" className="w-full text-accent">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
        <div className="border-t border-border px-4 py-4 md:hidden space-y-4">
          <Input
            type="search"
            placeholder="Search..."
            className="bg-secondary"
          />

          <div className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  pathname === item.href ? "text-accent" : "hover:text-accent",
                  "block py-2 text-sm font-medium transition-colors"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Upload Actions */}
          {isAuthenticated ? (
            <Button variant="default" className="w-full text-accent">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <div className="pt-2 space-y-2">
              <Button
                className="w-full bg-accent text-accent-foreground"
                asChild
              >
                <Link href="/login">Login to Upload</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/signup">Create an Account</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
