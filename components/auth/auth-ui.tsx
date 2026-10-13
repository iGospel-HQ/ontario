"use client";

import { forwardRef, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** The white card every auth page (login, sign-up, verify...) sits in. */
export function AuthCard({
  title,
  subtitle,
  icon,
  children,
  footer,
}: {
  title: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] sm:p-8">
        {icon && (
          <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">{icon}</div>
        )}
        <h1 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{subtitle}</p>}
        <div className="mt-7">{children}</div>
      </div>
      {footer && <div className="mt-6 text-center text-sm text-gray-600">{footer}</div>}
    </div>
  );
}

/** A message box for the whole form: errors, notices and successes. */
export function FormNotice({
  tone = "error",
  title,
  children,
  action,
}: {
  tone?: "error" | "info" | "success";
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
}) {
  const Icon = tone === "error" ? AlertCircle : tone === "success" ? CheckCircle2 : Info;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "mb-5 flex gap-3 rounded-2xl border px-4 py-3 text-sm",
        tone === "error" && "border-red-200 bg-red-50 text-red-800",
        tone === "info" && "border-sky-200 bg-sky-50 text-sky-900",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-900",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        {children && <div className="mt-1 leading-relaxed opacity-90">{children}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}

/** Password field with a show/hide toggle. */
export const PasswordInput = forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  function PasswordInput({ className, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    return (
      <div className="relative">
        <Input ref={ref} type={visible ? "text" : "password"} className={cn("h-12 pr-11", className)} {...props} />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition hover:text-gray-800"
        >
          {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>
    );
  },
);

/** Classes for the main submit button (iGospel pink). */
export const primaryButton =
  "h-12 w-full rounded-full bg-accent text-base font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent/90 disabled:opacity-70";
