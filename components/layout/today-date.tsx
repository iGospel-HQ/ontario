"use client";

import { useSyncExternalStore } from "react";

const format = () =>
  new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  });

const noop = () => () => {};

/** Today's date in Nigeria time. Rendered in the browser so cached pages never show a stale date. */
export function TodayDate() {
  const today = useSyncExternalStore(noop, format, () => "");
  return <span suppressHydrationWarning>{today}</span>;
}
