import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { dictionaries } from "@/i18n/dictionaries";

const d = dictionaries.tr;

export const alt = d.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#060709",
          color: "#ecebe6",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 8, color: "#8b8f98" }}>
          INTERAKTİF 3D PORTFÖY
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 128, fontWeight: 700, letterSpacing: -6, lineHeight: 0.95 }}>
            {site.nameUpper}
          </div>
          <div style={{ display: "flex", fontSize: 40, marginTop: 28, color: "#ecebe6" }}>
            {d.profile.headline.join(" ")}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 22, letterSpacing: 6, color: "#ff5b2e" }}>
          <div style={{ width: 56, height: 2, background: "#ff5b2e" }} />
          {d.profile.tagline.join(" ")}
        </div>
      </div>
    ),
    size,
  );
}
