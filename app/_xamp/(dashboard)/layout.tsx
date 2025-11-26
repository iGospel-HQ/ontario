"use client"

import type React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Music, FileText, Disc3, Users, LayoutDashboard, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Blog Posts",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    title: "Songs",
    href: "/admin/music/songs",
    icon: Music,
  },
  {
    title: "Playlists",
    href: "/admin/music/playlists",
    icon: Disc3,
  },
  {
    title: "Artists",
    href: "/admin/music/artists",
    icon: Users,
  },
]

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-border">
          <div className="px-4 py-6">
            <h1 className="text-xl font-bold">SYNC Admin</h1>
            <p className="text-xs text-muted-foreground">Content Management</p>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {adminNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href} className={cn("flex items-center gap-2")}>
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>
        <div className="border-t border-border p-4">
          <Link href="/">
            <button className="w-full flex items-center gap-2 px-4 py-2 rounded hover:bg-secondary transition-colors text-sm">
              <LogOut className="h-4 w-4" />
              Exit Admin
            </button>
          </Link>
        </div>
      </Sidebar>
      <main className="flex-1 bg-background">{children}</main>
    </SidebarProvider>
  )
}
