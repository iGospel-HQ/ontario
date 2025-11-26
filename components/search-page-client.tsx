"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { searchContent } from "@/lib/api-client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Music, Disc3, Users, FileText } from "lucide-react"
import { useSearchParams } from "next/navigation"

const getIcon = (type: string) => {
  switch (type) {
    case "song":
      return <Music className="h-4 w-4" />
    case "playlist":
      return <Disc3 className="h-4 w-4" />
    case "artist":
      return <Users className="h-4 w-4" />
    case "post":
      return <FileText className="h-4 w-4" />
    default:
      return null
  }
}

export function SearchPageClient() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchContent(query),
    enabled: query.length > 0,
  })

  const [searchTerm, setSearchTerm] = useState(query)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <Input
              type="search"
              placeholder="Search for songs, artists, playlists, or articles..."
              className="pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchTerm.length > 0) {
                  window.location.href = `/search?q=${searchTerm}`
                }
              }}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => {
                if (searchTerm.length > 0) {
                  window.location.href = `/search?q=${searchTerm}`
                }
              }}
              disabled={searchTerm.length === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </motion.button>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <p>Loading...</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-1 items-center justify-center">
            <p>Something went wrong. Please try again.</p>
          </div>
        )}

        {data && data.length === 0 && query.length > 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p>No results found for "{query}".</p>
          </div>
        )}

        {data && data.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map((item: any) => (
              <Link
                key={item.id}
                href={
                  item.type === "song"
                    ? `/songs/${item.id}`
                    : item.type === "playlist"
                      ? `/playlists/${item.id}`
                      : item.type === "artist"
                        ? `/artists/${item.id}`
                        : item.type === "post"
                          ? `/articles/${item.id}`
                          : "#"
                }
                className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-accent"
              >
                {getIcon(item.type)}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
