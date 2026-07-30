import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

/*
 * Cache-buster for the generated OG card. Slack, LinkedIn and X cache the
 * rendered bitmap against its image URL, independently of the page metadata -
 * so once a link has been shared, changing what /api/og returns is not enough:
 * they keep serving the old picture from their own proxies. Versioning the
 * image URL is the only reliable way to force a refetch.
 *
 * BUMP THIS whenever the card design in app/api/og/route.tsx changes.
 * v2 = brand fonts + real wordmark (2026-07-30).
 */
const OG_VERSION = "2";

type BuildMetadataInput = {
  title?: string;
  // Exact <title> text, bypassing the root layout's "%s - HeyOtis" template.
  // Used by the homepage for a brand-first title (e.g. "HeyOtis - AI Search
  // Intelligence"); interior pages should use `title` and let the template
  // append the brand.
  titleAbsolute?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  noindex?: boolean;
};

export function buildMetadata({
  title,
  titleAbsolute,
  description = siteConfig.description,
  path = "/",
  image = siteConfig.defaultOgImage,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  tags,
  noindex = false,
}: BuildMetadataInput = {}): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  // OG/Twitter card title - the bare page title (brand for the default). No
  // brand suffix here; the "- HeyOtis" suffix lives only in the <title> tag,
  // added once by the root layout's title template.
  const resolvedTitle = title ?? siteConfig.name;
  // Per-route OG card: when using the default generator, bake the page's title
  // and description into it so each shared link gets a distinct, titled image.
  const ogImage =
    image === siteConfig.defaultOgImage
      ? `/api/og?title=${encodeURIComponent(resolvedTitle)}&subtitle=${encodeURIComponent(description)}&v=${OG_VERSION}`
      : image;
  const imageUrl = new URL(ogImage, siteConfig.url).toString();

  return {
    // <title> tag. Interior pages pass `title`; the root layout's
    // `%s - HeyOtis` template appends the brand once (page-first). The homepage
    // passes `titleAbsolute` for a brand-first title that skips the template.
    title: titleAbsolute ? { absolute: titleAbsolute } : title,
    description,
    metadataBase: new URL(siteConfig.url),
    // A noindex page must not declare a canonical: the canonical would ask
    // crawlers to consolidate signals onto that URL while robots asks them to
    // drop the page - contradictory, and on error pages (which have no real
    // URL of their own) actively harmful.
    ...(noindex ? {} : { alternates: { canonical: url } }),
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type,
      url,
      title: resolvedTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: resolvedTitle }],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors,
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [imageUrl],
    },
  };
}
