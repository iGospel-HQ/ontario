"use client";

import {
  Wallet,
  ArrowDownCircle,
  TrendingUp,
  Gift,
  BarChart,
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { useQuery } from "@tanstack/react-query";
// import { getDashboardStats } from "@/lib/api"

export function DashboardStats() {
  const stats: any = {};
  const isLoading = false;
  // const { data: stats, isLoading } = useQuery({
  //   queryKey: ["dashboard-stats"],
  //   queryFn: getDashboardStats,
  // })

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Available Balance"
        value={formatCurrency(stats?.availableBalance ?? 0)}
        icon={Wallet}
        accented
      />
      <StatCard
        title="Total Withdrawn"
        value={formatCurrency(stats?.totalWithdrawn ?? 0)}
        icon={ArrowDownCircle}
      />
      <StatCard
        title="Total Earnings"
        value={formatCurrency(stats?.totalEarnings ?? 0)}
        icon={TrendingUp}
      />
      <StatCard
        title="Supports / Gifts Received"
        value={stats?.totalGifts ?? 0}
        icon={Gift}
      />
      <StatCard
        title="Average Gift Amount"
        value={formatCurrency(stats?.averageGift ?? 0)}
        icon={BarChart}
      />
    </div>
  );
}
