import { pageMetadata } from "@/lib/seo";
import UploadPageClient from "./_client"

export const metadata = pageMetadata({
  title: "Upload Your Gospel Content",
  description:
    "Learn how to submit your gospel music, sermons, and more to iGospel for global reach and direct support.",
  path: "/upload",
});

export default function UploadPage() {
  return <UploadPageClient />;
}