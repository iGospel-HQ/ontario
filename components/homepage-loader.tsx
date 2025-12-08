"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function HomePageSkeleton() {
  return (
    <div className="space-y-10">

      {/* HERO SECTION */}
      <div className="relative w-full h-[350px] rounded-xl overflow-hidden">
        <Skeleton className="w-full h-full" />

        <div className="absolute inset-0 flex flex-col justify-center px-10 space-y-3">
          <Skeleton className="h-4 w-32" /> {/* Brand New Album */}
          <Skeleton className="h-10 w-64" /> {/* Title */}
          <Skeleton className="h-6 w-96" /> {/* Subtitle */}
          <Skeleton className="h-10 w-28 rounded-full" /> {/* Button */}
        </div>
      </div>

      {/* QUICK ACCESS SECTION */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" /> {/* Section title: Quick Access */}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[1,2,3,4,5].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center border rounded-xl p-6 space-y-3"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED POSTS */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" /> {/* Featured Posts title */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" /> {/* Image */}
              <Skeleton className="h-4 w-40" /> {/* Label */}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
