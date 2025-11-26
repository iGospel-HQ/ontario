import type { Metadata } from "next"
import ChartsPageClientComponent from "./client"

export const metadata: Metadata = {
  title: "Charts - SYNC",
  description: "The hottest tracks trending right now",
}

export default function ChartsPage() {
  return <ChartsPageClientComponent />
}
