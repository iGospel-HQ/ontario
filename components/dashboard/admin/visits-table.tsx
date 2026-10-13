"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, ExternalLink, Monitor, Search, Smartphone, Tablet, X } from "lucide-react";
import api from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface Visit {
  id: string;
  viewed_at: string;
  path: string;
  page: string;
  source: string;
  device: string;
  country: string;
  country_code: string;
  ip: string;
  visitor: string;
  visitor_visits: number;
}

interface VisitsResponse {
  count: number;
  page: number;
  pages: number;
  page_size: number;
  results: Visit[];
  filters: { sources: { value: string; label: string }[]; countries: string[]; devices: string[] };
}

const DEVICE_ICON = { mobile: Smartphone, tablet: Tablet, desktop: Monitor } as const;
const DEVICE_NAME: Record<string, string> = { mobile: "Phone", tablet: "Tablet", desktop: "Computer" };

/** "3 min ago", "Yesterday 14:05", "12 Oct 09:30". */
function when(iso: string) {
  const date = new Date(iso);
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 60 * 6) return `${Math.round(minutes / 60)} h ago`;
  return date.toLocaleString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

/** Country code -> flag emoji ("NG" -> 🇳🇬). */
function flag(code: string) {
  if (!/^[A-Za-z]{2}$/.test(code)) return "";
  return String.fromCodePoint(...code.toUpperCase().split("").map((c) => 0x1f1a5 + c.charCodeAt(0)));
}

/** "id:64f6f8b5-b69c-..." -> "64f6f8b5" */
const shortVisitor = (key: string) => key.replace(/^(id|ip):/, "").slice(0, 8);

const selectClass =
  "h-9 rounded-lg border border-[var(--viz-border)] bg-white px-2.5 text-sm text-[var(--viz-ink)] outline-none focus:border-[var(--viz-series-1)]";

/**
 * Every page visit in the selected period (whole site except the dashboard):
 * when, which page, where the visitor came from, device, country, IP and the
 * visitor (click to see their whole journey). Filters and paging run on the API.
 */
export function VisitsTable({ days }: { days: number }) {
  const [source, setSource] = useState("");
  const [device, setDevice] = useState("");
  const [country, setCountry] = useState("");
  const [visitor, setVisitor] = useState("");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  // Search as you type, without a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setQ(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const filtersKey = [days, source, device, country, visitor, q].join("|");
  const [prevKey, setPrevKey] = useState(filtersKey);
  if (prevKey !== filtersKey) {
    // A filter changed: back to the first page.
    setPrevKey(filtersKey);
    setPage(1);
  }

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["admin-visits", days, source, device, country, visitor, q, page],
    queryFn: async () =>
      (
        await api.get<VisitsResponse>("/stats/visits/", {
          params: { days, source: source || undefined, device: device || undefined, country: country || undefined, visitor: visitor || undefined, q: q || undefined, page, page_size: 25 },
        })
      ).data,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const filtering = Boolean(source || device || country || visitor || q);
  const clear = () => {
    setSource("");
    setDevice("");
    setCountry("");
    setVisitor("");
    setSearch("");
  };

  return (
    <section className="rounded-xl border border-[var(--viz-border)] bg-white p-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-sans text-base font-semibold text-[var(--viz-ink)]">Visits</h2>
          <p className="mt-0.5 text-xs text-[var(--viz-muted)]">
            Every page visit, last {days} days{data ? ` · ${data.count.toLocaleString("en")} ${filtering ? "matching" : "in total"}` : ""}
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="relative min-w-[200px] flex-1">
          <span className="sr-only">Search page or IP</span>
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[var(--viz-muted)]" aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search page (e.g. /charts) or IP"
            className={cn(selectClass, "w-full pl-8")}
          />
        </label>
        <select aria-label="Source" value={source} onChange={(e) => setSource(e.target.value)} className={selectClass}>
          <option value="">All sources</option>
          {data?.filters.sources.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select aria-label="Device" value={device} onChange={(e) => setDevice(e.target.value)} className={selectClass}>
          <option value="">All devices</option>
          {data?.filters.devices.map((d) => (
            <option key={d} value={d}>
              {DEVICE_NAME[d] ?? d}
            </option>
          ))}
        </select>
        <select aria-label="Country" value={country} onChange={(e) => setCountry(e.target.value)} className={selectClass}>
          <option value="">All countries</option>
          {data?.filters.countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {filtering && (
          <button
            type="button"
            onClick={clear}
            className="inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-sm text-[var(--viz-series-1)] hover:bg-black/[0.04]"
          >
            <X className="size-4" aria-hidden="true" /> Clear filters
          </button>
        )}
      </div>

      {visitor && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--viz-series-1)]/10 px-3 py-1 text-xs text-[var(--viz-ink)]">
          Showing one visitor&apos;s journey: <span className="font-mono">{shortVisitor(visitor)}</span>
          <button type="button" onClick={() => setVisitor("")} aria-label="Show all visitors" className="hover:text-[var(--viz-series-1)]">
            <X className="size-3.5" />
          </button>
        </p>
      )}

      {/* Table */}
      <div className={cn("mt-4 overflow-x-auto transition-opacity", isFetching && "opacity-60")}>
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--viz-grid)] text-xs uppercase tracking-wide text-[var(--viz-muted)]">
              <th className="py-2 pr-3 font-medium">When</th>
              <th className="py-2 pr-3 font-medium">Page</th>
              <th className="py-2 pr-3 font-medium">Came from</th>
              <th className="py-2 pr-3 font-medium">Device</th>
              <th className="py-2 pr-3 font-medium">Country</th>
              <th className="py-2 pr-3 font-medium">IP address</th>
              <th className="py-2 font-medium">Visitor</th>
            </tr>
          </thead>
          <tbody>
            {isError ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-[var(--viz-muted)]">
                  Couldn&apos;t load visits.{" "}
                  <button type="button" onClick={() => refetch()} className="font-medium text-[var(--viz-series-1)] hover:underline">
                    Try again
                  </button>
                </td>
              </tr>
            ) : !data ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-[var(--viz-grid)]">
                  <td colSpan={7} className="py-3">
                    <div className="h-4 animate-pulse rounded bg-black/[0.05]" />
                  </td>
                </tr>
              ))
            ) : data.results.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-[var(--viz-muted)]">
                  No visits {filtering ? "match these filters" : "in this period yet"}.
                </td>
              </tr>
            ) : (
              data.results.map((v) => {
                const DeviceIcon = DEVICE_ICON[v.device as keyof typeof DEVICE_ICON];
                return (
                  <tr key={v.id} className="border-b border-[var(--viz-grid)] align-top last:border-0 hover:bg-black/[0.02]">
                    <td className="whitespace-nowrap py-2.5 pr-3 text-[var(--viz-ink-2)]" title={new Date(v.viewed_at).toLocaleString("en-NG")}>
                      {when(v.viewed_at)}
                    </td>
                    <td className="max-w-[260px] py-2.5 pr-3">
                      <a href={v.path} target="_blank" rel="noopener noreferrer" className="group block">
                        <span className="block truncate font-medium text-[var(--viz-ink)] group-hover:text-[var(--viz-series-1)]">
                          {v.page}
                          <ExternalLink className="ml-1 inline size-3 opacity-0 group-hover:opacity-100" aria-hidden="true" />
                        </span>
                        {v.page !== v.path && <span className="block truncate font-mono text-[11px] text-[var(--viz-muted)]">{v.path}</span>}
                      </a>
                    </td>
                    <td className="whitespace-nowrap py-2.5 pr-3">
                      <button
                        type="button"
                        onClick={() => setSource(v.source === "Direct & apps" ? "direct" : v.source)}
                        title="Show only this source"
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          v.source === "Direct & apps" ? "bg-black/[0.05] text-[var(--viz-ink-2)]" : "bg-[var(--viz-series-1)]/10 text-[var(--viz-series-1)]",
                        )}
                      >
                        {v.source}
                      </button>
                    </td>
                    <td className="whitespace-nowrap py-2.5 pr-3 text-[var(--viz-ink-2)]">
                      {DeviceIcon ? (
                        <span className="inline-flex items-center gap-1.5">
                          <DeviceIcon className="size-4" aria-hidden="true" /> {DEVICE_NAME[v.device]}
                        </span>
                      ) : (
                        <span className="text-[var(--viz-muted)]">–</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-2.5 pr-3 text-[var(--viz-ink-2)]">
                      {v.country ? `${flag(v.country_code)} ${v.country}`.trim() : <span className="text-[var(--viz-muted)]">–</span>}
                    </td>
                    <td className="whitespace-nowrap py-2.5 pr-3 font-mono text-xs text-[var(--viz-ink-2)]">
                      {v.ip ? (
                        <button type="button" onClick={() => setSearch(v.ip)} title="Show visits from this IP" className="hover:text-[var(--viz-series-1)]">
                          {v.ip}
                        </button>
                      ) : (
                        "–"
                      )}
                    </td>
                    <td className="whitespace-nowrap py-2.5">
                      <button
                        type="button"
                        onClick={() => setVisitor(v.visitor)}
                        title="Show this visitor's journey"
                        className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs hover:bg-black/[0.04]"
                      >
                        <span className="font-mono text-[var(--viz-ink-2)]">{shortVisitor(v.visitor)}</span>
                        <span className="rounded-full bg-black/[0.05] px-1.5 text-[10px] font-semibold text-[var(--viz-ink-2)]">
                          {v.visitor_visits} {v.visitor_visits === 1 ? "visit" : "visits"}
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paging */}
      {data && data.pages > 1 && (
        <nav aria-label="Visits pages" className="mt-4 flex items-center justify-between gap-3 text-sm text-[var(--viz-ink-2)]">
          <span>
            Page {data.page} of {data.pages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={data.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--viz-border)] px-2.5 hover:bg-black/[0.04] disabled:opacity-40"
            >
              <ChevronLeft className="size-4" aria-hidden="true" /> Newer
            </button>
            <button
              type="button"
              disabled={data.page >= data.pages}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--viz-border)] px-2.5 hover:bg-black/[0.04] disabled:opacity-40"
            >
              Older <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </nav>
      )}
    </section>
  );
}
