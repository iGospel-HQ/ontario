import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fade/slide-up entrance animation in pure CSS (tw-animate-css), so
 * server-rendered content animates on first paint instead of staying hidden
 * until JavaScript hydrates.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  y = 20,
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Seconds. */
  delay?: number;
  /** Seconds. */
  duration?: number;
  /** Starting vertical offset in px. */
  y?: number;
  as?: "div" | "section" | "article" | "h1" | "h2" | "p" | "span";
}) {
  const style = {
    "--tw-enter-opacity": "0",
    "--tw-enter-translate-y": `${y}px`,
    "--tw-animation-duration": `${duration}s`,
    "--tw-animation-delay": `${delay}s`,
    "--tw-animation-fill-mode": "both",
    "--tw-ease": "ease-out",
  } as CSSProperties;

  return (
    <Component className={cn("animate-in motion-reduce:animate-none", className)} style={style}>
      {children}
    </Component>
  );
}
