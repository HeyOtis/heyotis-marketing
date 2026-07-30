import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

/*
 * Satori (the renderer behind next/og) has no access to the browser's fonts or
 * to next/font's build output, so anything not passed in `fonts` falls back to
 * its bundled default - which is why this card used to render in a generic
 * grotesque with the wrong metrics. The TTFs are colocated and loaded through
 * `new URL(..., import.meta.url)` so Next bundles them into the edge function;
 * they must be TTF/OTF because Satori cannot decode WOFF2.
 */
const assets = Promise.all([
  fetch(new URL("./fonts/Bricolage-ExtraBold.ttf", import.meta.url)).then((r) =>
    r.arrayBuffer(),
  ),
  fetch(new URL("./fonts/Geist-Regular.ttf", import.meta.url)).then((r) =>
    r.arrayBuffer(),
  ),
  fetch(new URL("./wordmark.png", import.meta.url)).then((r) =>
    r.arrayBuffer(),
  ),
]);

/** Chunked so a 40KB logo doesn't blow the argument limit on String.fromCharCode. */
function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

const INK = "#221f28";
const MUTED = "#5b5566";
const FAINT = "#8b8494";
const CREAM = "#f7f4ed";

const ENGINES = ["ChatGPT", "Claude", "Gemini", "Perplexity", "AI Overviews"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title =
    searchParams.get("title") ?? "See how AI recommends your brand";
  const subtitle =
    searchParams.get("subtitle") ??
    "Measure your AI recommendation share, citations and competitive rank - then act on it.";

  const [bricolage, geist, wordmark] = await assets;
  const wordmarkSrc = `data:image/png;base64,${toBase64(wordmark)}`;

  // Long titles would otherwise overflow the card; step the display size down
  // rather than letting Satori clip the last line.
  const titleSize = title.length > 64 ? 60 : title.length > 44 ? 68 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 80px",
          background: CREAM,
          color: INK,
          fontFamily: "Geist",
        }}
      >
        {/* Brand glow - echoes the hero's purple orb, bled off the right edge. */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: -200,
            width: 640,
            height: 640,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(122,90,220,0.26), rgba(122,90,220,0))",
            display: "flex",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={wordmarkSrc} width={205} height={82} alt="HeyOtis" />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Bricolage Grotesque",
              fontSize: titleSize,
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
              maxWidth: 900,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 27,
              lineHeight: 1.35,
              color: MUTED,
              maxWidth: 820,
            }}
          >
            {subtitle}
          </div>

          {/* Engine strip, mirroring the hero's proof row. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: 44,
              fontSize: 19,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: FAINT,
            }}
          >
            {ENGINES.map((engine, i) => (
              <div key={engine} style={{ display: "flex", gap: 14 }}>
                {i > 0 ? <div style={{ display: "flex" }}>·</div> : null}
                <div style={{ display: "flex" }}>{engine}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Bricolage Grotesque",
          data: bricolage,
          weight: 800,
          style: "normal",
        },
        { name: "Geist", data: geist, weight: 400, style: "normal" },
      ],
      headers: {
        // Unfurl caches (Slack, LinkedIn, X) hammer this on every share. Keyed
        // by query string, so a long CDN life is safe; kept revalidatable so a
        // design change isn't frozen at the edge for a year.
        "cache-control":
          "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
