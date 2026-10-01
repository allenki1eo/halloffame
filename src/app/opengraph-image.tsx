import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Shukran TZ, a living tribute. The work is the tribute.";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4efe6",
          color: "#1b1814",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 5, color: "#1c5c44" }}>
          SHUKRAN TZ · A LIVING TRIBUTE
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, lineHeight: 0.95, maxWidth: 900 }}>
            The work is the tribute.
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#514b43", maxWidth: 820 }}>
            Pages for Tanzanians whose work is shaping the country. Published by editors.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#1c5c44" }}>Working title</div>
      </div>
    ),
    { ...size },
  );
}
