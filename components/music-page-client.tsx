"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Music, Disc3, Album, Users } from "lucide-react"

const musicCategories = [
  {
    title: "Top Songs",
    description: "Currently trending tracks",
    href: "/music/songs",
    icon: Music,
    color: "from-accent",
  },
  {
    title: "Playlists",
    description: "Curated collections",
    href: "/music/playlists",
    icon: Disc3,
    color: "from-blue-500",
  },
  {
    title: "Albums",
    description: "Full releases",
    href: "/music/albums",
    icon: Album,
    color: "from-purple-500",
  },
  {
    title: "Artists",
    description: "Discover creators",
    href: "/music/artists",
    icon: Users,
    color: "from-pink-500",
  },
]

export function MusicPageClient() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:dark:bg-zinc-800/30">
            <p className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0">
              Sync your music
            </p>
          </div>
          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            <Link
              className="pointer-events-auto flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
              href="/"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{" "}
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                src="/vercel.svg"
                alt="Vercel Logo"
                className="dark:invert"
                width={100}
                height={24}
              />
            </Link>
          </div>
        </div>

        <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
          {musicCategories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className={`group rounded-lg border px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 ${category.color}`}
            >
              <h2 className={`mb-3 text-2xl font-semibold`}>
                {category.title}{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{category.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
