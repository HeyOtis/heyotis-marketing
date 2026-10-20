/*
 * CSP violation sink. Unauthenticated by design: browsers post reports
 * anonymously, so there is nothing to authenticate with. A 16 KB body cap and
 * no storage keep it cheap; the worst case is log spam, one line per violation.
 * Accepts legacy report-uri (application/csp-report) and the Reporting API
 * (application/reports+json). Never echoes input.
 */
export const dynamic = "force-dynamic";

const MAX_BYTES = 16 * 1024;
const NOISE = /^(chrome|moz|safari)-extension:/i;

type Raw = Record<string, unknown>;

function str(v: unknown, max = 300): string | undefined {
  return typeof v === "string" ? v.slice(0, max) : undefined;
}

function pathOnly(v: unknown): string | undefined {
  const s = str(v, 2000);
  if (!s) return undefined;
  try {
    return new URL(s).pathname;
  } catch {
    return undefined;
  }
}

function log(body: unknown) {
  if (!body || typeof body !== "object") return;
  const b = body as Raw;
  // Legacy uses dashed keys, the Reporting API camelCase.
  const blocked = str(b["blocked-uri"] ?? b.blockedURL ?? b.blockedURI);
  if (blocked && NOISE.test(blocked)) return;
  console.warn(
    JSON.stringify({
      csp: "violation",
      effective: str(b["effective-directive"] ?? b.effectiveDirective),
      violated: str(b["violated-directive"] ?? b.violatedDirective),
      blocked,
      doc: pathOnly(b["document-uri"] ?? b.documentURL ?? b.documentURI),
      disposition: str(b.disposition),
      source: str(b["source-file"] ?? b.sourceFile),
      line:
        typeof (b["line-number"] ?? b.lineNumber) === "number"
          ? (b["line-number"] ?? b.lineNumber)
          : undefined,
    }),
  );
}

export async function POST(request: Request) {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BYTES) return new Response(null, { status: 413 });

  // Read at most MAX_BYTES + 1 so a missing/lying Content-Length cannot bypass the cap.
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  if (reader) {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BYTES) {
        await reader.cancel();
        return new Response(null, { status: 413 });
      }
      chunks.push(value);
    }
  }
  const text = new TextDecoder().decode(
    Buffer.concat(chunks.map((c) => Buffer.from(c))),
  );

  try {
    const json: unknown = JSON.parse(text);
    const type = (request.headers.get("content-type") ?? "").toLowerCase();
    if (type.includes("application/reports+json") && Array.isArray(json)) {
      for (const r of json.slice(0, 20)) {
        if (r && (r as Raw).type === "csp-violation") log((r as Raw).body);
      }
    } else if (type.includes("application/csp-report")) {
      log((json as Raw)?.["csp-report"]);
    }
  } catch {
    // Malformed body: nothing to log.
  }
  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}
