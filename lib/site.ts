const trimSlash = (value: string) => value.replace(/\/+$/, "");

export const siteConfig = {
  name: "iGospel",
  legalName: "iGospel Media Connect",
  tagline: "Listen. Share. Support Gospel Voices.",
  description:
    "Discover curated gospel music, artists, and editorial content all in one place.",
  url: trimSlash(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.igospel.com.ng"),
  apiUrl: trimSlash(process.env.NEXT_PUBLIC_API_URL ?? "https://api.igospels.com.ng/v1"),
  locale: "en_US",
  logo: "/logo.png",
  ogImage: { url: "/og-image.png", width: 1200, height: 630 },
  twitterHandle: "@igospel",
  emails: {
    contact: "igospelmediaconnect@gmail.com",
    support: "support@igospel.ng",
  },
  whatsapp: { href: "https://wa.me/+2348068535646", display: "+234 806 853 5646" },
  location: "Lagos, Nigeria",
  social: {
    facebook: "https://www.facebook.com/igospelmediaconnect",
    linkedin: "https://www.linkedin.com/company/igospelmediaconnect",
    telegram: "https://t.me/igospelministry",
    twitter: "https://x.com/igospel",
  },
} as const;

export const absoluteUrl = (path = "/") =>
  `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
