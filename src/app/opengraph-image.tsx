import { ImageResponse } from "next/og";

export const alt = "Wedding Planner Marrakesh — independent planners, venues and real costs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f2f4f1",
          padding: "64px 72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#0d6b5c", fontSize: 22, letterSpacing: 4 }}>
          WPM
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, color: "#14221e", fontWeight: 600, maxWidth: 980 }}>
            Wedding Planner Marrakesh
          </div>
          <div style={{ fontSize: 28, color: "#2f433c", maxWidth: 860, lineHeight: 1.35 }}>
            Independent planners, venues and real costs for a Marrakesh wedding.
          </div>
        </div>
        <div style={{ fontSize: 20, color: "#6e7d76" }}>No commission · Real budgets · Marrakesh</div>
      </div>
    ),
    { ...size },
  );
}
