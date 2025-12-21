// components/ComingSoonWrapper.tsx
"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LockIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComingSoonWrapperProps {
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  text?: string;
  showLockIcon?: boolean;
  showClockIcon?: boolean;
  blur?: boolean;
  opacity?: number;
}

/**
 * Wraps any section or component with a "Coming Soon" overlay.
 * Great for features under development, locked content, or teasers.
 */
export function ComingSoonWrapper({
  children,
  className,
  overlayClassName,
  text = "Coming Soon",
  showLockIcon = true,
  showClockIcon = false,
  blur = true,
  opacity = 0.9,
}: ComingSoonWrapperProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Main Content */}
      {children}

      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center z-10",
          overlayClassName
        )}
        style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center px-6 py-10 max-w-md"
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            {showLockIcon && (
              <LockIcon className="w-3 h-3 text-black" strokeWidth={1.5} />
            )}
            {showClockIcon && (
              <Clock className="w-3 h-3 text-black" strokeWidth={1.5} />
            )}
          </div>

          <h3 className="text-sm font-bold text-black mb-3">
            {text}
          </h3>

          {/* <p className="text-white/80 text-lg">
            This feature is under development and will be available soon.
          </p>

          <div className="mt-6 text-sm text-white/60">
            Stay tuned for updates!
          </div> */}
        </motion.div>
      </div>

      {/* Optional blur effect on background content */}
      {blur && (
        <div className="absolute inset-0 backdrop-blur-xs z-5 pointer-events-none" />
      )}
    </div>
  );
}