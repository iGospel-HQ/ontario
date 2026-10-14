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
import { VisitsTable } from "./visits-table";

const RANGES = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7", label: "Last 7 days" },
  { key: "30", label: "Last 30 days" },
  { key: "90", label: "Last 90 days" },
] as const;
type RangeKey = (typeof RANGES)[number]["key"];
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
function Delta({ current, previous, versus }: { current: number; previous: number; versus: string }) {
  if (previous === 0) {
    return <p className="text-xs text-[var(--viz-muted)]">{current > 0 ? `No data for ${versus}` : "—"}</p>;
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
      <span className="text-[var(--viz-muted)]">vs {versus}</span>
    </p>
  );
}

function KpiTile({
  label,
  value,
  windowed,
  versus,
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
  /** What the change is measured against, e.g. "the previous 7 days". */
  versus: string;
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
        <Delta current={cur} previous={prev} versus={versus} />
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
  const [period, setPeriod] = useState<RangeKey>("30");
  const { data, error, isFetching, isPending, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["admin-overview", period],
    queryFn: async () => (await api.get<AdminOverview>("/stats/overview/", { params: { period } })).data,
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
        <div role="radiogroup" aria-label="Time range" className="inline-flex max-w-full overflow-x-auto rounded-lg border border-[var(--viz-border)] p-0.5 text-sm">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              role="radio"
              aria-checked={period === r.key}
              onClick={() => setPeriod(r.key)}
              className={cn(
                "rounded-md px-3 py-1.5 font-medium transition-colors",
                period === r.key ? "bg-[var(--viz-ink)] text-white" : "text-[var(--viz-ink-2)] hover:bg-black/[0.04]",
              )}
            >
              {r.label}
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
  const { days, traffic, plays, downloads, shares, users, artists, music, content, money } = data;
  // "today" / "yesterday" / "last 7 days" (older APIs only send days).
  const span = data.label ?? `last ${days} days`;
  const versus = data.previous_label ?? `the previous ${days} days`;
  const per = data.bucket === "hour" ? "hour" : "day";
  const within = data.bucket === "hour" ? span : `in the ${span}`;
  // Older APIs send one "sponsor" (on all songs) instead of the "sponsors" list.
  const sponsors =
    shares?.sponsors ??
    (shares?.sponsor ? [{ ...shares.sponsor, videos: null as number | null, songs: "All songs" }] : []);
  const s1 = "var(--viz-series-1)";
  const s2 = "var(--viz-series-2)";

  return (
    <>
      {/* Headline numbers for the selected period */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <KpiTile label="Page views" value={compact(traffic.views.period)} windowed={traffic.views} versus={versus} icon={Eye} trend={traffic.series.map((d) => d.views)} />
        <KpiTile label="Unique visitors" value={compact(traffic.visitors.period)} windowed={traffic.visitors} versus={versus} icon={Users} trend={traffic.series.map((d) => d.visitors)} />
        <KpiTile label="Song plays" value={compact(plays.period)} windowed={plays} versus={versus} icon={Music2} trend={plays.series.map((d) => d.plays)} />
        <KpiTile label="Downloads" value={compact(downloads.period)} windowed={downloads} versus={versus} icon={Download} trend={downloads.series.map((d) => d.downloads)} />
        <KpiTile label="New users" value={compact(users.period)} windowed={users} versus={versus} icon={UserPlus} trend={users.series.map((d) => d.signups)} />
        <KpiTile
          label="Donations"
          value={nairaCompact(money.donations_period)}
          current={money.donations_period}
          previous={money.donations_previous}
          versus={versus}
          icon={HandCoins}
          trend={money.series.map((d) => d.donations)}
        />
      </div>

      {/* Traffic */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Traffic" subtitle={`Page views and unique visitors per day, whole site except the dashboard, ${span}`} className="xl:col-span-2">
          <LineChart
            label={`Traffic: views and unique visitors per ${per}, ${span}`}
            data={traffic.series}
            series={[
              { key: "views", label: "Views", color: s1 },
              { key: "visitors", label: "Unique visitors", color: s2 },
            ]}
          />
        </Card>
        <Card title="Top posts" subtitle={`By views, ${span}`}>
          <BarList
            rows={traffic.top_posts.map((p) => ({ label: p.title, value: p.views, href: `/blog/${p.slug}` }))}
          />
        </Card>
      </div>

      {/* Where the traffic goes and comes from */}
      {traffic.top_pages && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="Top pages" subtitle={`Every page of the site, ${span}`}>
            <BarList rows={traffic.top_pages.map((p) => ({ label: p.label, sublabel: p.label === p.path ? undefined : p.path, value: p.views, href: p.path }))} />
          </Card>
          <Card title="Where visitors come from" subtitle={`The site or app they came from, ${span}`}>
            <BarList rows={(traffic.sources ?? []).map((s) => ({ label: s.source, value: s.views }))} />
            <p className="mt-3 text-xs text-[var(--viz-muted)]">
              &quot;Direct &amp; apps&quot; includes typed-in links, bookmarks and most links opened from WhatsApp.
            </p>
          </Card>
          <Card title="Devices & countries" subtitle={`Page views, ${span}`}>
            <SplitBar
              empty="No device data for this period yet."
              parts={[
                { key: "phones", label: "Phones & tablets", color: s1, value: (traffic.devices?.mobile ?? 0) + (traffic.devices?.tablet ?? 0) },
                { key: "computers", label: "Computers", color: s2, value: traffic.devices?.desktop ?? 0 },
              ]}
            />
            <div className="mt-6">
              <BarList rows={(traffic.top_countries ?? []).map((c) => ({ label: c.country, value: c.views }))} empty="No locations for this period yet." />
            </div>
          </Card>
        </div>
      )}

      {/* Every visit, with filters */}
      <VisitsTable period={data.period ?? String(days)} span={span} />

      {/* Plays */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Song plays" subtitle={`Plays per ${per}, ${span} · ${compact(plays.all_time)} all time`} className="xl:col-span-2">
          <ColumnChart label={`Song plays per ${per}, ${span}`} data={plays.series} series={{ key: "plays", label: "Plays", color: s1 }} />
          <div className="mt-6 border-t border-[var(--viz-grid)] pt-5">
            <h3 className="font-sans text-sm font-semibold text-[var(--viz-ink)]">Listeners by country</h3>
            <p className="mb-4 mt-0.5 text-xs text-[var(--viz-muted)]">
              Plays, {span}{plays.unknown_country ? ` · ${full(plays.unknown_country)} with unknown location` : ""}
            </p>
            <BarList rows={plays.top_countries.map((c) => ({ label: c.country, value: c.plays }))} />
          </div>
        </Card>
        <div className="grid min-w-0 content-start gap-4">
          <Card title="Top songs" subtitle={`By plays (30s+ listens), ${span}`}>
            <BarList rows={plays.top_tracks.map((t) => ({ label: t.title, sublabel: t.artist, value: t.plays }))} />
          </Card>
          <Card title="Top downloads" subtitle={`${span.charAt(0).toUpperCase() + span.slice(1)} · ${compact(downloads.all_time)} all time`}>
            <BarList rows={downloads.top_tracks.map((t) => ({ label: t.title, sublabel: t.artist, value: t.downloads }))} />
          </Card>
        </div>
      </div>

      {/* Song video shares (the share row on post pages) */}
      {shares && (
        <div className="grid gap-4 xl:grid-cols-3">
          <Card
            title="Song video shares"
            subtitle={`Videos shared to Status, Stories, TikTok... per ${per}, ${span} · ${compact(shares.all_time)} all time`}
            className="xl:col-span-2"
          >
            <ColumnChart label={`Song video shares per ${per}, ${span}`} data={shares.series} series={{ key: "shares", label: "Shares", color: s2 }} />
            <div className="mt-6 border-t border-[var(--viz-grid)] pt-5">
              <h3 className="font-sans text-sm font-semibold text-[var(--viz-ink)]">Shared to</h3>
              <p className="mb-4 mt-0.5 text-xs text-[var(--viz-muted)]">The app picked on the post page, {span}</p>
              <BarList rows={shares.by_platform.map((p) => ({ label: p.platform, value: p.shares }))} />
            </div>
          </Card>
          <div className="grid min-w-0 content-start gap-4">
            <Card title="Clip sponsors" subtitle="Running on the song videos now">
              {sponsors.length > 0 ? (
                <ul className="space-y-4">
                  {sponsors.map((s) => (
                    <li key={s.name} className="grid grid-cols-2 gap-4">
                      <Stat label={s.songs} value={s.name} hint={s.videos != null ? `On ${full(s.videos)} videos` : undefined} />
                      <Stat
                        label="Video shares"
                        value={s.shares}
                        hint={`Since ${new Date(s.since).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}`}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--viz-muted)]">
                  No sponsor running. Add one in the{" "}
                  <a href={`${DJANGO_ADMIN}music/clipsponsor/`} target="_blank" rel="noopener noreferrer" className="underline">
                    admin
                  </a>
                  .
                </p>
              )}
            </Card>
            <Card title="Most shared songs" subtitle={span.charAt(0).toUpperCase() + span.slice(1)}>
              <BarList rows={shares.top_tracks.map((t) => ({ label: t.title, sublabel: t.artist, value: t.shares }))} />
            </Card>
          </div>
        </div>
      )}

      {/* Catalogue, community, money */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Catalogue" subtitle="Artists and music on iGospel">
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Artists" value={artists.total} hint={`${full(artists.active)} active · ${full(artists.new_period)} new`} />
            <Stat label="Artists with accounts" value={artists.with_account} hint="Can receive support" />
            <Stat label="Songs" value={music.tracks} hint={`${full(music.new_tracks_period)} added ${within}`} />
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
            <Stat label="New users" value={users.period} hint={span} />
            <Stat label="Published posts" value={content.published} hint={`${full(content.published_period)} ${within}`} />
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
              hint={`${full(content.contact_messages_period)} ${within}`}
              href={content.contact_messages ? `${DJANGO_ADMIN}support/contact/` : undefined}
            />
          </div>
        </Card>

        <Card title="Money" subtitle="Donations and payouts (NGN)">
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Donations, all time" value={naira(money.donations_total)} />
            <Stat label={`Donations, ${span}`} value={naira(money.donations_period)} hint={`${full(money.donations_count_period)} donations`} />
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
              <p className="text-sm text-[var(--viz-muted)]">No donations {within}.</p>
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
