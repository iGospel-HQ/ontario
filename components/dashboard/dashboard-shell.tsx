"use client";

import type React from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/use-auth-store";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/withdrawals": "Wallets",
  "/dashboard/transactions": "Transactions",
  "/dashboard/publish": "Publish Content",
  "/dashboard/gifts": "Gifts",
};

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    setShowLogoutDialog(false);
    logout();
    window.location.href = "/";
  };

  const pageTitle = pageTitles[pathname] || "Dashboard";

  return (
    <SidebarProvider>
      <DashboardSidebar onLogoutClick={() => setShowLogoutDialog(true)} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
          </div>
          <NotificationBell />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to sign in again to
              access your dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
