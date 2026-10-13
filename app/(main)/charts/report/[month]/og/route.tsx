import { ImageResponse } from "next/og";
import { getChartReport } from "@/lib/api/queries";

/**
 * GET /charts/report/<month>/og: the picture shown when the report is shared
 * on WhatsApp, X, Facebook... (the top 5). Linked from the page metadata.
 */
const size = { width: 1200, height: 630 };

/** Shortens long titles (the image renderer has no reliable "..." for one-line text). */
const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);
export const revalidate = 3600;

export async function GET(_request: Request, { params }: { params: Promise<{ month: string }> }) {
  const { month } = await params;
  const report = await getChartReport(month);
  const top = report?.top_tracks.slice(0, 5) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0c0c0c 0%, #1a0a10 60%, #3a0d1c 100%)",
          color: "white",
          padding: "56px 64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 44, height: 44, borderRadius: 999, background: "rgba(255,55,95,0.35)", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", width: 22, height: 22, borderRadius: 999, background: "#ff375f" }} />
          </div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>iGospel</div>
          <div style={{ marginLeft: "auto", fontSize: 26, color: "#ff375f", fontWeight: 700 }}>
            {report?.label ?? "This month"}
          </div>
        </div>

        <div style={{ marginTop: 28, fontSize: 52, fontWeight: 800, lineHeight: 1.1 }}>Top Gospel Songs in Nigeria</div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 26, gap: 12 }}>
          {top.map((track) => (
            <div key={track.id} style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 30 }}>
              <div style={{ width: 44, color: track.rank === 1 ? "#ff375f" : "rgba(255,255,255,0.55)", fontWeight: 800 }}>
                {String(track.rank)}
              </div>
              <div style={{ display: "flex", flex: 1 }}>
                <span style={{ fontWeight: 700 }}>{clip(track.title, 34)}</span>
                <span style={{ color: "rgba(255,255,255,0.6)", marginLeft: 14 }}>{clip(track.artist_name, 24)}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "auto", fontSize: 24, color: "rgba(255,255,255,0.6)" }}>
          Full chart, cities and more at igospel.ng/charts
        </div>
      </div>
    ),
    size,
  );
}
