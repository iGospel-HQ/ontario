"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Tag = "div" | "section" | "article" | "ol" | "ul" | "li" | "p" | "h2" | "h3";

/**
 * Scroll-triggered entrance animation. Children are server-rendered; only the
 * animation is client-side. With `stagger`, it acts as a variants container
 * for nested `RevealItem`s.
 */
export function Reveal({
  children,
  className,
  as = "div",
  x = 0,
  y = 20,
  scale = 1,
  delay = 0,
  duration,
  stagger,
  delayChildren,
  inView = true,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  x?: number;
  y?: number;
  scale?: number;
  delay?: number;
  duration?: number;
  stagger?: number;
  delayChildren?: number;
  /** Animate when scrolled into view (default) or immediately on mount. */
  inView?: boolean;
}) {
  const Component = motion[as];
  const trigger = inView
    ? { whileInView: "visible", viewport: { once: true } }
    : { animate: "visible" };

  if (stagger !== undefined) {
    return (
      <Component
        className={className}
        initial="hidden"
        {...trigger}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: stagger, delayChildren } },
        }}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={className}
      initial="hidden"
      {...trigger}
      variants={{
        hidden: { opacity: 0, x, y, scale },
        visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { delay, duration } },
      }}
    >
      {children}
    </Component>
  );
}

/** Child of a staggered `Reveal`; inherits its hidden/visible state. */
export function RevealItem({
  children,
  className,
  as = "div",
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  y?: number;
}) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={{ hidden: { opacity: 0, y }, visible: { opacity: 1, y: 0 } }}
    >
      {children}
    </Component>
  );
}
