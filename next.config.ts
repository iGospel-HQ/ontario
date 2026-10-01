import type { NextConfig } from "next";

const apiHost = new URL(process.env.NEXT_PUBLIC_API_URL ?? "https://api.igospels.com.ng/v1").hostname;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Media is uploaded to S3 with unique keys (AWS_S3_FILE_OVERWRITE = False),
    // so optimized variants can be cached for a long time.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: apiHost },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
