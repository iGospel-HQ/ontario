import { Metadata } from "next"
import UploadPageClient from "./_client"

export const metadata: Metadata = {
  title: "Upload Your Gospel Content - iGospel",
  description: "Learn how to submit your gospel music, sermons, and more to iGospel for global reach and direct support.",
};

export default function UploadPage() {
  return <UploadPageClient />;
}