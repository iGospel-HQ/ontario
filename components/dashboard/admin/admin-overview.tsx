"use client";

import { useState, type ReactNode } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  ArrowDownRight,
  Download,
  ArrowUpRight,
  ExternalLink,
  Eye,
  HandCoins,
  Music2,
  RefreshCw,
  UserPlus,
  Users,
} from "lucide-react";
import api from "@/lib/api-client";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { AdminOverview, Windowed } from "@/types/api";
import { BarList, ColumnChart, LineChart, Sparkline, SplitBar, compact, full } from "./charts";

const RANGES = [7, 30, 90] as const;
const DJANGO_ADMIN = `${new URL(siteConfig.apiUrl).origin}/admin/`;

const naira = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
const nairaCompact = (n: number) =>
  n >= 100_000
    ? `₦${new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n)}`
    : naira(n);

function Card({ title, subtitle, action, children, className }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("min-w-0 rounded-xl border border-[var(--viz-border)] bg-[var(--viz-surface)] p-5", className)}>
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-sans text-sm font-semibold text-[var(--viz-ink)]">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-[var(--viz-muted)]">{subtitle}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

/** Signed change vs the previous period; arrow + text, never colour alone. */
function Delta({ current, previous, days }: { current: number; previous: number; days: number }) {
  if (previous === 0) {
    return <p className="text-xs text-[var(--viz-muted)]">{current > 0 ? `No data for the ${days} days before` : "—"}</p>;
  }
  const change = ((current - previous) / previous) * 100;
  const up = change >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <p className="flex items-center gap-1 text-xs">
      <span className={cn("flex items-center gap-0.5 font-semibold", up ? "text-[var(--viz-good)]" : "text-[var(--viz-bad)]")}>
        <Icon className="size-3.5" aria-hidden="true" />
        {up ? "+" : "−"}
        {Math.abs(change) >= 100 ? Math.round(Math.abs(change)) : Math.abs(change).toFixed(1)}%
      </span>
      <span className="text-[var(--viz-muted)]">vs previous {days} days</span>
    </p>
  );
}

function KpiTile({
  label,
  value,
  windowed,
  days,
  trend,
  icon: Icon,
  previous,
  current,
}: {
  label: string;
  value: string;
  windowed?: Windowed;
  current?: number;
  previous?: number;
  days: number;
  trend?: number[];
  icon: typeof Eye;
}) {
  const cur = current ?? windowed?.period ?? 0;
  const prev = previous ?? windowed?.previous ?? 0;
  return (
    <div className="min-w-0 rounded-xl border border-[var(--viz-border)] bg-[var(--viz-surface)] p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--viz-ink-2)]">{label}</p>
        <Icon className="size-4 text-[var(--viz-muted)]" aria-hidden="true" />
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold text-[var(--viz-ink)]">{value}</p>
        {trend && <Sparkline values={trend} label={`${label} trend`} />}
      </div>
      <div className="mt-1.5">
        <Delta current={cur} previous={prev} days={days} />
      </div>
      {windowed && (
        <p className="mt-1 text-xs text-[var(--viz-muted)]">
          {full(windowed.today)} today · {compact(windowed.all_time)} all time
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, hint, href }: { label: string; value: string | number; hint?: string; href?: string }) {
  const body = (
    <>
      <p className="text-xs text-[var(--viz-ink-2)]">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-[var(--viz-ink)]">{typeof value === "number" ? full(value) : value}</p>
      {hint && <p className="text-[11px] text-[var(--viz-muted)]">{hint}</p>}
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block rounded-lg p-2 -m-2 hover:bg-black/[0.03]">
      {body}
      <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[var(--viz-series-1)] group-hover:underline">
        Open in admin <ExternalLink className="size-3" aria-hidden="true" />
      </span>
    </a>
  ) : (
    <div>{body}</div>
  );
}

/** Site-wide statistics for staff accounts (API: /stats/overview/, staff only). */
export function AdminOverviewDashboard() {
  const [days, setDays] = useState<(typeof RANGES)[number]>(30);
  const { data, error, isFetching, isPending, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["admin-overview", days],
    queryFn: async () => (await api.get<AdminOverview>("/stats/overview/", { params: { days } })).data,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  if (error && isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 401)) {
    return (
      <div className="viz-root mx-auto max-w-md rounded-xl border border-[var(--viz-border)] p-8 text-center">
        <p className="font-semibold">This page is for iGospel administrators.</p>
        <p className="mt-1 text-sm text-[var(--viz-ink-2)]">Your account doesn&apos;t have access to site-wide statistics.</p>
      </div>
    );
  }

  return (
    <div className="viz-root space-y-6">
      {/* One filter row: scopes every number below it. */}
      <div className="flex flex-wrap items-center gap-3">
        <div role="radiogroup" aria-label="Time range" className="inline-flex rounded-lg border border-[var(--viz-border)] p-0.5 text-sm">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={days === r}
              onClick={() => setDays(r)}
              className={cn(
                "rounded-md px-3 py-1.5 font-medium transition-colors",
                days === r ? "bg-[var(--viz-ink)] text-white" : "text-[var(--viz-ink-2)] hover:bg-black/[0.04]",
              )}
            >
              Last {r} days
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-[var(--viz-ink-2)] hover:bg-black/[0.04]"
        >
          <RefreshCw className={cn("size-3.5", isFetching && "animate-spin")} aria-hidden="true" />
          {dataUpdatedAt ? `Updated ${new Date(dataUpdatedAt).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}` : "Refresh"}
        </button>
        <a href={DJANGO_ADMIN} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 text-xs text-[var(--viz-series-1)] hover:underline">
          Django admin <ExternalLink className="size-3" aria-hidden="true" />
        </a>
      </div>

      {isPending && !data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-xl bg-black/[0.05]" />
          ))}
        </div>
      ) : error || !data ? (
        <div className="rounded-xl border border-[var(--viz-border)] p-6 text-sm">
          Couldn&apos;t load the statistics.{" "}
          <button type="button" className="font-medium text-[var(--viz-series-1)] hover:underline" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : (
        // Refetch keeps the frame: previous numbers dim while the new range loads.
        <div className={cn("space-y-6 transition-opacity", isFetching && "opacity-60")}>
          <Overview data={data} />
        </div>
      )}
    </div>
  );
}

function Overview({ data }: { data: AdminOverview }) {
  const { days, traffic, plays, downloads, users, artists, music, content, money } = data;
  const s1 = "var(--viz-series-1)";
  const s2 = "var(--viz-series-2)";

  return (
    <>
      {/* Headline numbers for the selected period */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <KpiTile label="Post views" value={compact(traffic.views.period)} windowed={traffic.views} days={days} icon={Eye} trend={traffic.series.map((d) => d.views)} />
        <KpiTile label="Unique visitors" value={compact(traffic.visitors.period)} windowed={traffic.visitors} days={days} icon={Users} trend={traffic.series.map((d) => d.visitors)} />
        <KpiTile label="Song plays" value={compact(plays.period)} windowed={plays} days={days} icon={Music2} trend={plays.series.map((d) => d.plays)} />
        <KpiTile label="Downloads" value={compact(downloads.period)} windowed={downloads} days={days} icon={Download} trend={downloads.series.map((d) => d.downloads)} />
        <KpiTile label="New users" value={compact(users.period)} windowed={users} days={days} icon={UserPlus} trend={users.series.map((d) => d.signups)} />
        <KpiTile
          label="Donations"
          value={nairaCompact(money.donations_period)}
          current={money.donations_period}
          previous={money.donations_previous}
          days={days}
          icon={HandCoins}
          trend={money.series.map((d) => d.donations)}
        />
      </div>

      {/* Traffic */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Traffic" subtitle={`Post page views and unique visitors per day, last ${days} days`} className="xl:col-span-2">
          <LineChart
            label={`Traffic: views and unique visitors per day, last ${days} days`}
            data={traffic.series}
            series={[
              { key: "views", label: "Views", color: s1 },
              { key: "visitors", label: "Unique visitors", color: s2 },
            ]}
          />
        </Card>
        <Card title="Top posts" subtitle={`By views, last ${days} days`}>
          <BarList
            rows={traffic.top_posts.map((p) => ({ label: p.title, value: p.views, href: `/blog/${p.slug}` }))}
          />
        </Card>
      </div>

      {/* Plays */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Song plays" subtitle={`Plays per day, last ${days} days · ${compact(plays.all_time)} all time`} className="xl:col-span-2">
          <ColumnChart label={`Song plays per day, last ${days} days`} data={plays.series} series={{ key: "plays", label: "Plays", color: s1 }} />
          <div className="mt-6 border-t border-[var(--viz-grid)] pt-5">
            <h3 className="font-sans text-sm font-semibold text-[var(--viz-ink)]">Listeners by country</h3>
            <p className="mb-4 mt-0.5 text-xs text-[var(--viz-muted)]">
              Plays, last {days} days{plays.unknown_country ? ` · ${full(plays.unknown_country)} with unknown location` : ""}
            </p>
            <BarList rows={plays.top_countries.map((c) => ({ label: c.country, value: c.plays }))} />
          </div>
        </Card>
        <div className="grid min-w-0 content-start gap-4">
          <Card title="Top songs" subtitle={`By plays (30s+ listens), last ${days} days`}>
            <BarList rows={plays.top_tracks.map((t) => ({ label: t.title, sublabel: t.artist, value: t.plays }))} />
          </Card>
          <Card title="Top downloads" subtitle={`Last ${days} days · ${compact(downloads.all_time)} all time`}>
            <BarList rows={downloads.top_tracks.map((t) => ({ label: t.title, sublabel: t.artist, value: t.downloads }))} />
          </Card>
        </div>
      </div>

      {/* Catalogue, community, money */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Catalogue" subtitle="Artists and music on iGospel">
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Artists" value={artists.total} hint={`${full(artists.active)} active · ${full(artists.new_period)} new`} />
            <Stat label="Artists with accounts" value={artists.with_account} hint="Can receive support" />
            <Stat label="Songs" value={music.tracks} hint={`${full(music.new_tracks_period)} added in ${days} days`} />
            <Stat label="Albums" value={music.albums} />
            <Stat label="Downloadable" value={music.downloadable} hint={`of ${full(music.tracks)} songs`} />
            <Stat label="Playlists · Genres" value={`${full(music.playlists)} · ${full(music.genres)}`} />
          </div>
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium text-[var(--viz-ink-2)]">Singles vs album tracks</p>
            <SplitBar
              parts={[
                { key: "singles", label: "Singles", color: s1, value: music.singles },
                { key: "album", label: "Album tracks", color: s2, value: music.album_tracks },
              ]}
            />
          </div>
        </Card>

        <Card title="Community & content" subtitle={`Users, posts and messages`}>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Users" value={users.all_time} hint={`${full(users.active)} active · ${full(users.staff)} staff`} />
            <Stat label="New users" value={users.period} hint={`last ${days} days`} />
            <Stat label="Published posts" value={content.published} hint={`${full(content.published_period)} in ${days} days`} />
            <Stat
              label="Drafts · Scheduled"
              value={`${full(content.drafts)} · ${full(content.scheduled)}`}
              href={content.drafts ? `${DJANGO_ADMIN}blog/post/?status__exact=draft` : undefined}
            />
            <Stat
              label="Comments awaiting approval"
              value={content.comments_pending}
              hint={`${full(content.comments)} comments in total`}
              href={content.comments_pending ? `${DJANGO_ADMIN}blog/comment/?approved__exact=0` : undefined}
            />
            <Stat label="Newsletter subscribers" value={content.newsletter_subscribers} />
            <Stat
              label="Contact messages"
              value={content.contact_messages}
              hint={`${full(content.contact_messages_period)} in ${days} days`}
              href={content.contact_messages ? `${DJANGO_ADMIN}support/contact/` : undefined}
            />
          </div>
        </Card>

        <Card title="Money" subtitle="Donations and payouts (NGN)">
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Donations, all time" value={naira(money.donations_total)} />
            <Stat label={`Donations, ${days} days`} value={naira(money.donations_period)} hint={`${full(money.donations_count_period)} donations`} />
            <Stat label="Platform commission" value={naira(money.commission_total)} hint="all time" />
            <Stat
              label="Pending withdrawals"
              value={money.pending_withdrawals}
              hint={naira(money.pending_withdrawals_amount)}
              href={money.pending_withdrawals ? `${DJANGO_ADMIN}wallet/walletwithdrawal/` : undefined}
            />
          </div>
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium text-[var(--viz-ink-2)]">Recent donations</p>
            {money.recent_donations.length === 0 ? (
              <p className="text-sm text-[var(--viz-muted)]">No donations in the last {days} days.</p>
            ) : (
              <ul className="divide-y divide-[var(--viz-grid)] text-sm">
                {money.recent_donations.map((d, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 py-2">
                    <span className="min-w-0 truncate text-[var(--viz-ink-2)]">
                      {d.creator}
                      <span className="block text-[11px] text-[var(--viz-muted)]">
                        {new Date(d.date).toLocaleDateString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums text-[var(--viz-ink)]">{naira(d.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>

      <p className="text-xs text-[var(--viz-muted)]">
        Traffic counts views of post pages (bots excluded). Days follow Nigeria time. Figures refresh every minute.
      </p>
    </>
  );
}
