import type { NextConfig } from "next";

const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL ?? "https://api.igospels.com.ng/v1");
// Local Django (http://127.0.0.1:8000) serves uploads from /media/ instead of S3.
const isLocalApi = ["127.0.0.1", "localhost"].includes(apiUrl.hostname);

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Media is uploaded to S3 with unique keys (file_overwrite = False),
    // so optimized variants can be cached for a long time.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      {
        protocol: apiUrl.protocol === "http:" ? "http" : "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
      },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
    // Next blocks optimizing images from private IPs; allow it only for a local API.
    dangerouslyAllowLocalIP: isLocalApi,
  },
};

export default nextConfig;
