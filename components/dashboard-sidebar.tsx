"use client";

import {
  LayoutDashboard,
  LogOut,
  CreditCard,
  ArrowRightLeft,
  Gift,
  Upload,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

// <CHANGE> Added more navigation menu items including Withdrawals, Transactions, and Gifts
const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    route: "/dashboard",
  },
  {
    label: "Transactions",
    icon: ArrowRightLeft,
    route: "/dashboard/transactions",
  },
  {
    label: "Wallet",
    icon: CreditCard,
    route: "/dashboard/withdrawals",
  },
  {
    label: "Publish Content",
    icon: Upload,
    route: "/dashboard/publish",
  },
  {
    label: "Profile",
    icon: User,
    route: "/dashboard/profile",
  },
  // {
  //   label: "Gifts",
  //   icon: Gift,
  //   route: "/dashboard/gifts",
  // },
  {
    label: "Logout",
    icon: LogOut,
    action: "logout",
  },
];

interface DashboardSidebarProps {
  onLogoutClick: () => void;
}

export function DashboardSidebar({ onLogoutClick }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      {/* <CHANGE> Added SidebarHeader with IGospel logo and text */}
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 py-1">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <img src="/icon.png" alt="logo" />
          </div>
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            IGospel
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  {item.route ? (
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.route}
                    >
                      <Link onClick={handleClick} href={item.route}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    // <CHANGE> Updated logout to call onLogoutClick prop for dialog
                    <SidebarMenuButton onClick={onLogoutClick}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
