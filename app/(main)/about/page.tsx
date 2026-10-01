import { pageMetadata } from "@/lib/seo";
import AboutPageClient from "./client";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Learn more about iGospel's mission and team",
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageClient />;
}
