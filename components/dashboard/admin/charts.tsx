"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/*
 * Small SVG charts for the admin dashboard. Colours come from the .viz-root
 * tokens in globals.css (validated palette: slot 1 blue, slot 2 orange).
 * Marks: 2px lines, bars <= 24px with a 4px rounded end, hairline grid,
 * 2px surface gaps/rings. Every chart has a hover/keyboard tooltip and a
 * data-table twin, so no value depends on hovering or on colour alone.
 */

export interface Series {
  key: string;
  label: string;
  /** CSS colour, e.g. var(--viz-series-1) */
  color: string;
}
type Row = { date: string } & Record<string, number | string>;

const compactFormat = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
export const compact = (n: number) => compactFormat.format(n);
export const full = (n: number) => n.toLocaleString("en");

/** "2026-10-03" -> Date at local midnight (no timezone shift); hourly rows are full ISO datetimes. */
function parseDay(iso: string) {
  if (iso.includes("T")) return new Date(iso);
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
const hour = (iso: string) => parseDay(iso).toLocaleTimeString("en", { hour: "numeric", hour12: true });
/** Axis label: "Oct 3", or "3 PM" for hourly rows. */
export const shortDate = (iso: string) =>
  iso.includes("T") ? hour(iso) : parseDay(iso).toLocaleDateString("en", { month: "short", day: "numeric" });
/** Tooltip/table label: "Sat, Oct 3", or "Sat, Oct 3, 3 PM" for hourly rows. */
const longDate = (iso: string) =>
  parseDay(iso).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" }) +
  (iso.includes("T") ? `, ${hour(iso)}` : "");

/** Clean axis: ticks 0..top in round steps (counts: whole-number steps). */
function niceScale(maxValue: number, count = 4) {
  if (maxValue <= 0) return { top: count, ticks: Array.from({ length: count + 1 }, (_, i) => i) };
  const raw = maxValue / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  let step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw;
  step = Math.max(1, step);
  const top = Math.ceil(maxValue / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= top + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100);
  return { top, ticks };
}

/** Indices for ~5 evenly spaced x labels (last one only if it has room). */
function xTickIndices(n: number, maxTicks = 5) {
  if (n <= 1) return [0];
  const step = Math.ceil(n / maxTicks);
  const ticks = [];
  for (let i = 0; i < n; i += step) ticks.push(i);
  if (n - 1 - ticks[ticks.length - 1] >= step / 2) ticks.push(n - 1);
  return ticks;
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

function LineKey({ color }: { color: string }) {
  return <span aria-hidden="true" className="inline-block h-0.5 w-3 shrink-0 rounded-full" style={{ background: color }} />;
}

/** Legend for 2+ series (one series: the card title names it). */
export function Legend({ series, shape = "line" }: { series: Series[]; shape?: "line" | "rect" }) {
  if (series.length < 2) return null;
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--viz-ink-2)]">
      {series.map((s) => (
        <li key={s.key} className="flex items-center gap-1.5">
          {shape === "line" ? (
            <LineKey color={s.color} />
          ) : (
            <span aria-hidden="true" className="size-2.5 rounded-[2px]" style={{ background: s.color }} />
          )}
          {s.label}
        </li>
      ))}
    </ul>
  );
}

function Tooltip({ left, width, title, rows }: { left: number; width: number; title: string; rows: { color: string; label: string; value: string }[] }) {
  const boxWidth = 168;
  const x = Math.min(Math.max(left + 12, 0), Math.max(width - boxWidth, 0));
  const flipped = left + 12 + boxWidth > width;
  return (
    <div
      role="status"
      className="pointer-events-none absolute top-1 z-10 rounded-md border border-[var(--viz-border)] bg-[var(--viz-surface)] px-3 py-2 text-xs shadow-md"
      style={{ left: flipped ? Math.max(left - 12 - boxWidth, 0) : x, width: boxWidth }}
    >
      <p className="mb-1 text-[var(--viz-ink-2)]">{title}</p>
      {rows.map((r) => (
        <p key={r.label} className="flex items-center gap-2">
          <LineKey color={r.color} />
          <span className="font-semibold text-[var(--viz-ink)]">{r.value}</span>
          <span className="truncate text-[var(--viz-ink-2)]">{r.label}</span>
        </p>
      ))}
    </div>
  );
}

/** Collapsible table with the same numbers as the chart. */
export function DataTable({ data, series, format = full }: { data: Row[]; series: Series[]; format?: (n: number) => string }) {
  return (
    <details className="mt-3 text-sm">
      <summary className="cursor-pointer select-none text-xs text-[var(--viz-muted)] hover:text-[var(--viz-ink-2)]">
        Show data table
      </summary>
      <div className="mt-2 max-h-64 overflow-y-auto">
        <table className="w-full text-left text-xs tabular-nums">
          <thead className="sticky top-0 bg-[var(--viz-surface)] text-[var(--viz-ink-2)]">
            <tr>
              <th className="py-1 pr-4 font-medium">Date</th>
              {series.map((s) => (
                <th key={s.key} className="py-1 pr-4 text-right font-medium">{s.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.date} className="border-t border-[var(--viz-grid)]">
                <td className="py-1 pr-4">{longDate(row.date)}</td>
                {series.map((s) => (
                  <td key={s.key} className="py-1 pr-4 text-right">{format(Number(row[s.key]) || 0)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

const MARGIN = { top: 12, right: 56, bottom: 26, left: 40 };

/** Trend over time: 1-2 lines on one axis (area wash when single), crosshair tooltip. */
export function LineChart({
  data,
  series,
  height = 240,
  format = full,
  label,
}: {
  data: Row[];
  series: Series[];
  height?: number;
  format?: (n: number) => string;
  label: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const n = data.length;
  const w = Math.max(width - MARGIN.left - MARGIN.right, 10);
  const h = height - MARGIN.top - MARGIN.bottom;
  const values = data.flatMap((d) => series.map((s) => Number(d[s.key]) || 0));
  const { top, ticks } = niceScale(Math.max(0, ...values));
  const x = (i: number) => MARGIN.left + (n <= 1 ? w / 2 : (i * w) / (n - 1));
  const y = (v: number) => MARGIN.top + h - (v / top) * h;
  const base = MARGIN.top + h;
  const value = (i: number, key: string) => Number(data[i]?.[key]) || 0;

  const lines = series.map((s) => data.map((_, i) => `${i ? "L" : "M"}${x(i)},${y(value(i, s.key))}`).join(""));
  const last = n - 1;
  const endYs = series.map((s) => y(value(last, s.key)));
  // End labels only when they don't collide; otherwise the legend + tooltip carry it.
  const showEndLabels = series.length === 1 || Math.abs(endYs[0] - endYs[1]) >= 14;

  const onPointer = (e: PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    setHover(Math.min(last, Math.max(0, Math.round((px / rect.width) * last))));
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === "ArrowLeft") setHover((i) => Math.max(0, (i ?? last) - 1));
    if (e.key === "ArrowRight") setHover((i) => Math.min(last, (i ?? last) + 1));
  };

  return (
    <div className="space-y-2">
      <Legend series={series} />
      <div ref={ref} className="relative" style={{ height }}>
        {width > 0 && n > 0 && (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={`${label}. Use left and right arrow keys to read each day.`}
            tabIndex={0}
            onKeyDown={onKey}
            onFocus={() => setHover(last)}
            onBlur={() => setHover(null)}
            className="overflow-visible outline-none focus-visible:ring-2 focus-visible:ring-[var(--viz-series-1)] focus-visible:ring-offset-2"
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={MARGIN.left} x2={MARGIN.left + w} y1={y(t)} y2={y(t)} stroke={t === 0 ? "var(--viz-axis)" : "var(--viz-grid)"} strokeWidth={1} />
                <text x={MARGIN.left - 8} y={y(t) + 4} textAnchor="end" className="fill-[var(--viz-muted)] text-[11px] tabular-nums">
                  {compact(t)}
                </text>
              </g>
            ))}
            {xTickIndices(n).map((i) => (
              <text key={i} x={x(i)} y={height - 6} textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"} className="fill-[var(--viz-muted)] text-[11px]">
                {shortDate(data[i].date)}
              </text>
            ))}
            {series.length === 1 && (
              <path d={`${lines[0]}L${x(last)},${base}L${x(0)},${base}Z`} fill={series[0].color} opacity={0.1} />
            )}
            {series.map((s, si) => (
              <path key={s.key} d={lines[si]} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            ))}
            {/* End dots + selective end labels (latest value). */}
            {series.map((s, si) => (
              <g key={s.key}>
                <circle cx={x(last)} cy={endYs[si]} r={4} fill={s.color} stroke="var(--viz-surface)" strokeWidth={2} />
                {showEndLabels && (
                  <text x={x(last) + 8} y={endYs[si] + 4} className="fill-[var(--viz-ink-2)] text-[11px] font-medium">
                    {compact(value(last, s.key))}
                  </text>
                )}
              </g>
            ))}
            {hover !== null && (
              <g pointerEvents="none">
                <line x1={x(hover)} x2={x(hover)} y1={MARGIN.top} y2={base} stroke="var(--viz-axis)" strokeWidth={1} />
                {series.map((s) => (
                  <circle key={s.key} cx={x(hover)} cy={y(value(hover, s.key))} r={4} fill={s.color} stroke="var(--viz-surface)" strokeWidth={2} />
                ))}
              </g>
            )}
            <rect
              x={MARGIN.left}
              y={MARGIN.top}
              width={w}
              height={h}
              fill="transparent"
              onPointerMove={onPointer}
              onPointerLeave={() => setHover(null)}
            />
          </svg>
        )}
        {hover !== null && data[hover] && (
          <Tooltip
            left={x(hover)}
            width={width}
            title={longDate(data[hover].date)}
            rows={series.map((s) => ({ color: s.color, label: s.label, value: format(value(hover, s.key)) }))}
          />
        )}
      </div>
      <DataTable data={data} series={series} format={format} />
    </div>
  );
}

/**
 * One value per day (or hour) as columns, per-column hover tooltip. With
 * several series, each day gets a group of side-by-side columns and a legend.
 */
export function ColumnChart({
  data,
  series,
  height = 220,
  format = full,
  label,
}: {
  data: Row[];
  series: Series | Series[];
  height?: number;
  format?: (n: number) => string;
  label: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const list = Array.isArray(series) ? series : [series];
  const m = list.length;
  const n = data.length;
  const margin = { ...MARGIN, right: 12 };
  const w = Math.max(width - margin.left - margin.right, 10);
  const h = height - margin.top - margin.bottom;
  const valsOf = (s: Series) => data.map((d) => Number(d[s.key]) || 0);
  const all = list.map(valsOf);
  const vals = all[0];
  const { top, ticks } = niceScale(Math.max(0, ...all.flat()));
  const y = (v: number) => margin.top + h - (v / top) * h;
  const base = margin.top + h;
  const band = w / Math.max(n, 1);
  const gap = m > 1 ? 2 : 0; // between the columns of one group
  const groupW = Math.max(m, Math.min(24 * m, band - 2)); // 2px surface gap between groups
  const barW = Math.max(1, (groupW - gap * (m - 1)) / m);
  const groupX = (i: number) => margin.left + i * band + (band - groupW) / 2;
  const barX = (i: number, j = 0) => groupX(i) + j * (barW + gap);
  const peak = vals.indexOf(Math.max(...vals));
  const last = n - 1;

  const column = (i: number, j: number) => {
    const bh = base - y(all[j][i]);
    if (bh <= 0) return null;
    const r = Math.min(4, barW / 2, bh);
    const x0 = barX(i, j);
    const yt = base - bh;
    return `M${x0},${base}V${yt + r}Q${x0},${yt} ${x0 + r},${yt}H${x0 + barW - r}Q${x0 + barW},${yt} ${x0 + barW},${yt + r}V${base}Z`;
  };

  return (
    <div className="space-y-2">
      {m > 1 && <Legend series={list} shape="rect" />}
      <div ref={ref} className="relative" style={{ height }}>
        {width > 0 && n > 0 && (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={`${label}. Use left and right arrow keys to read each day.`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setHover((i) => Math.max(0, (i ?? last) - 1));
              if (e.key === "ArrowRight") setHover((i) => Math.min(last, (i ?? last) + 1));
            }}
            onFocus={() => setHover(last)}
            onBlur={() => setHover(null)}
            onPointerLeave={() => setHover(null)}
            className="overflow-visible outline-none focus-visible:ring-2 focus-visible:ring-[var(--viz-series-1)] focus-visible:ring-offset-2"
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={margin.left} x2={margin.left + w} y1={y(t)} y2={y(t)} stroke={t === 0 ? "var(--viz-axis)" : "var(--viz-grid)"} strokeWidth={1} />
                <text x={margin.left - 8} y={y(t) + 4} textAnchor="end" className="fill-[var(--viz-muted)] text-[11px] tabular-nums">
                  {compact(t)}
                </text>
              </g>
            ))}
            {xTickIndices(n).map((i) => (
              <text key={i} x={groupX(i) + groupW / 2} y={height - 6} textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"} className="fill-[var(--viz-muted)] text-[11px]">
                {shortDate(data[i].date)}
              </text>
            ))}
            {data.map((d, i) => {
              return (
                <g key={d.date}>
                  {list.map((s, j) => {
                    const path = column(i, j);
                    return path && <path key={s.key} d={path} fill={s.color} opacity={hover === null || hover === i ? 1 : 0.55} />;
                  })}
                  {/* Hit target: the whole band, taller than the mark. */}
                  <rect x={margin.left + i * band} y={margin.top} width={band} height={h} fill="transparent" onPointerMove={() => setHover(i)} />
                </g>
              );
            })}
            {vals[peak] > 0 && (
              <text x={barX(peak) + barW / 2} y={y(vals[peak]) - 6} textAnchor="middle" className="fill-[var(--viz-ink-2)] text-[11px] font-medium">
                {compact(vals[peak])}
              </text>
            )}
          </svg>
        )}
        {hover !== null && data[hover] && (
          <Tooltip
            left={groupX(hover) + groupW / 2}
            width={width}
            title={longDate(data[hover].date)}
            rows={list.map((s, j) => ({ color: s.color, label: s.label, value: format(all[j][hover]) }))}
          />
        )}
      </div>
      <DataTable data={data} series={list} format={format} />
    </div>
  );
}

/** Ranked list with a bar per row; every value is printed (no hover needed). */
export function BarList({
  rows,
  empty = "No data for this period yet.",
  format = full,
}: {
  rows: { label: ReactNode; sublabel?: string; value: number; href?: string }[];
  empty?: string;
  format?: (n: number) => string;
}) {
  if (rows.length === 0) return <p className="py-6 text-center text-sm text-[var(--viz-muted)]">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ol className="space-y-3">
      {rows.map((row, i) => {
        const text = (
          <span className="min-w-0 flex-1 truncate">
            <span className="text-[var(--viz-ink)]">{row.label}</span>
            {row.sublabel && <span className="text-[var(--viz-muted)]"> · {row.sublabel}</span>}
          </span>
        );
        return (
          <li key={i} className="space-y-1">
            <div className="flex items-baseline gap-3 text-sm">
              {row.href ? (
                <Link href={row.href} target="_blank" className="min-w-0 flex-1 truncate hover:underline">
                  {text}
                </Link>
              ) : (
                text
              )}
              <span className="shrink-0 font-semibold tabular-nums text-[var(--viz-ink)]">{format(row.value)}</span>
            </div>
            <div className="h-2.5 w-full">
              <div
                className="h-full rounded-r-[4px]"
                style={{ width: `${Math.max((row.value / max) * 100, 1.5)}%`, background: "var(--viz-series-1)" }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Part-to-whole of two parts as one bar with a 2px gap, legend with counts. */
export function SplitBar({
  parts,
  empty = "No songs yet.",
}: {
  parts: [Series & { value: number }, Series & { value: number }];
  empty?: string;
}) {
  const total = parts[0].value + parts[1].value;
  if (total === 0) return <p className="text-sm text-[var(--viz-muted)]">{empty}</p>;
  const pct = (v: number) => Math.round((v / total) * 100);
  return (
    <div className="space-y-2">
      <div className="flex h-3 w-full gap-[2px]" role="img" aria-label={parts.map((p) => `${p.label}: ${p.value}`).join(", ")}>
        {parts.map((p, i) =>
          p.value > 0 ? (
            <div
              key={p.key}
              className={cn("h-full", i === 0 ? "rounded-l-[4px]" : "rounded-r-[4px]", parts[1 - i].value === 0 && "rounded-[4px]")}
              style={{ width: `${(p.value / total) * 100}%`, background: p.color }}
            />
          ) : null,
        )}
      </div>
      <Legend series={parts} shape="rect" />
      <p className="text-xs text-[var(--viz-ink-2)]">
        {parts.map((p) => `${full(p.value)} ${p.label.toLowerCase()} (${pct(p.value)}%)`).join(" · ")}
      </p>
    </div>
  );
}

/** Tiny trend line for stat tiles: de-emphasis grey, latest point in the accent. */
export function Sparkline({ values, label }: { values: number[]; label: string }) {
  const width = 96;
  const height = 28;
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const x = (i: number) => 2 + (i * (width - 4)) / (values.length - 1);
  const y = (v: number) => height - 3 - (v / max) * (height - 6);
  const d = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join("");
  const last = values.length - 1;
  return (
    <svg width={width} height={height} role="img" aria-label={label} className="overflow-visible">
      <path d={d} fill="none" stroke="var(--viz-axis)" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(last)} cy={y(values[last])} r={3} fill="var(--viz-series-1)" stroke="var(--viz-surface)" strokeWidth={1.5} />
    </svg>
  );
}
