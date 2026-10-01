"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Entrance animation wrapper. Children stay server-rendered; only the
 * animation runs on the client.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 20,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "article";
}) {
  const Component = motion[as];
  return (
    <Component
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </Component>
  );
}
