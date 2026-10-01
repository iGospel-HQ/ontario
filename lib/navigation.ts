import { siteConfig } from "@/lib/site";

export interface MenuItem {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
}

/** Primary menu (header bar and mobile menu). */
export const mainMenu: MenuItem[] = [
  { name: "Home", href: "/" },
  {
    name: "Music",
    href: "/music",
    children: [
      { name: "Music News", href: "/music" },
      { name: "Songs", href: "/music/songs" },
      { name: "Artists", href: "/music/artists" },
      { name: "Playlists", href: "/music/playlists" },
      { name: "Top Charts", href: "/charts" },
    ],
  },
  { name: "Explore", href: "/blog" },
  { name: "Upload", href: "/upload" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

/** Small links in the top bar. */
export const topBarLinks = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
];

export const socialLinks = [
  { id: "twitter", name: "iGospel on X (Twitter)", href: siteConfig.social.twitter },
  { id: "instagram", name: "iGospel on Instagram", href: "#" },
  { id: "facebook", name: "iGospel on Facebook", href: siteConfig.social.facebook },
  { id: "linkedin", name: "iGospel on LinkedIn", href: siteConfig.social.linkedin },
  { id: "email", name: "Email iGospel", href: `mailto:${siteConfig.emails.contact}` },
] as const;

/** A menu item is active on its own page and (except Home) on pages below it. */
export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
