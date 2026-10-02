import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/** Web app manifest: lets phones install iGospel to the home screen as a standalone app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#000000",
    theme_color: "#000000",
    categories: ["music", "entertainment", "lifestyle"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Charts", url: "/charts", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Songs", url: "/music/songs", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Search", url: "/search", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
