import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title =
    searchParams.get("title") ?? "See how AI recommends your brand";
  const subtitle =
    searchParams.get("subtitle") ??
    "AI recommendation share across ChatGPT, Gemini, Perplexity, Claude, Meta AI & Mistral";

  const bars = [
    { h: 150, c: "#aa9fe2" },
    { h: 240, c: "#8b6fd0" },
    { h: 338, c: "#6a47c2" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#f7f4ed",
          color: "#221f28",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* soft purple glow */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(122,90,220,0.22), rgba(122,90,220,0))",
            display: "flex",
          }}
        />

        {/* brand lockup */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-end", height: 56, gap: 7 }}>
            {bars.map((b, i) => (
              <div
                key={i}
                style={{
                  width: 16,
                  height: (b.h / 338) * 56,
                  borderRadius: 6,
                  background: b.c,
                  display: "flex",
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            HeyOtis
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 940,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#5b5566",
              maxWidth: 880,
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
