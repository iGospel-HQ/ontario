# iGospel Web

Next.js (App Router) frontend for iGospel, deployed on Vercel.

## Development

```bash
pnpm install
pnpm dev        # http://localhost:4000
pnpm build
pnpm lint
```

## Environment variables

| Name | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.igospel.com.ng` | Canonical site origin (metadata, sitemap, RSS, JSON-LD) |
| `NEXT_PUBLIC_API_URL` | `https://api.igospels.com.ng/v1` | Django API base URL |
