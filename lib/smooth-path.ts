/* Smooth curves through data, for the chart vignettes.

   Hand-authored `C` paths were the previous approach and they kink: getting
   every joint's incoming and outgoing control points to agree is fiddly, and
   one tangent that disagrees with its neighbouring chords reads as a corner in
   the middle of what should be a continuous climb. Generating the path from
   the points instead makes that class of mistake impossible. */

export type Point = { x: number; y: number };

const round = (v: number) => Math.round(v * 100) / 100;

/**
 * A monotone cubic (Fritsch-Carlson) through `points`, emitted as an SVG cubic
 * Bézier path.
 *
 * Tangents come from the surrounding chord slopes - so the curve is C1 smooth
 * and no joint can kink - and are then clamped so each segment stays monotone,
 * which is what stops a plain Catmull-Rom from dipping below a rising series
 * between two close points. Points must be sorted by ascending `x`.
 */
export function smoothPath(points: Point[]): string {
  if (points.length < 2) return "";

  const n = points.length;

  // Secant (chord) slope of each span.
  const dx: number[] = [];
  const secant: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(points[i + 1].x - points[i].x);
    secant.push((points[i + 1].y - points[i].y) / dx[i]);
  }

  // Tangent at each point: the mean of its two chords inside, one-sided at the
  // ends. A sign change between chords means a local extremum - flatten there
  // so the curve turns over cleanly instead of overshooting.
  const m: number[] = new Array(n);
  m[0] = secant[0];
  m[n - 1] = secant[n - 2];
  for (let i = 1; i < n - 1; i++) {
    m[i] =
      secant[i - 1] * secant[i] <= 0 ? 0 : (secant[i - 1] + secant[i]) / 2;
  }

  // Fritsch-Carlson: pull any tangent back inside the circle of radius 3 so the
  // segment can't overshoot its own endpoints.
  for (let i = 0; i < n - 1; i++) {
    if (secant[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / secant[i];
    const b = m[i + 1] / secant[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * secant[i];
      m[i + 1] = t * b * secant[i];
    }
  }

  // Hermite -> Bézier: each control point sits a third of the span along the
  // tangent, which is the exact equivalence, not an approximation.
  let d = `M ${round(points[0].x)} ${round(points[0].y)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    const c1x = points[i].x + h;
    const c1y = points[i].y + h * m[i];
    const c2x = points[i + 1].x - h;
    const c2y = points[i + 1].y - h * m[i + 1];
    d += ` C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${round(points[i + 1].x)} ${round(points[i + 1].y)}`;
  }
  return d;
}

/**
 * Evenly spaces `values` across `[x0, x1]` and maps each into `[yBottom, yTop]`
 * by its position between `min` and `max`, then smooths the result. The series
 * stays readable as numbers in the source; the geometry is derived.
 */
export function smoothSeries(
  values: number[],
  {
    x0,
    x1,
    yTop,
    yBottom,
    min = Math.min(...values),
    max = Math.max(...values),
  }: {
    x0: number;
    x1: number;
    yTop: number;
    yBottom: number;
    min?: number;
    max?: number;
  },
): string {
  const span = max - min || 1;
  return smoothPath(
    values.map((v, i) => ({
      x: x0 + (i * (x1 - x0)) / (values.length - 1),
      y: yBottom - ((v - min) / span) * (yBottom - yTop),
    })),
  );
}
