"use client";

import type React from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { Spinner } from "@/components/ui/spinner";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, isAuthenticated, refreshAccessToken } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      console.log(" Initializing authentication");
      await refreshAccessToken();
    };

    initAuth();
  }, [refreshAccessToken]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname.startsWith("/dashboard")) {
      console.log(" Redirecting unauthenticated user to login");
      router.push("/signin");
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-12" />
          <p className="text-sm text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
