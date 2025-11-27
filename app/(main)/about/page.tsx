import { Metadata } from "next";
import AboutPageClient from "./client";

export const metadata: Metadata = {
  title: "About - iGospel",
  description: "Learn more about iGospel's mission and team",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
