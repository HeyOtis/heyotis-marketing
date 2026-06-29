import { siteConfig } from "@/lib/site";

type WithContext<T> = T & { "@context": "https://schema.org" };

// Stable @id so every Organization reference resolves to one entity (no dupes).
const ORG_ID = `${siteConfig.url}/#organization`;

export function organizationSchema(): WithContext<Record<string, unknown>> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: new URL("/logo.png", siteConfig.url).toString(),
    sameAs: Object.values(siteConfig.socials),
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contactEmail,
      contactType: "customer support",
    },
  };
}

export function websiteSchema(): WithContext<Record<string, unknown>> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@id": ORG_ID },
  };
}

export type BreadcrumbItem = { name: string; href: string };

export function breadcrumbSchema(
  items: BreadcrumbItem[],
): WithContext<Record<string, unknown>> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: new URL(item.href, siteConfig.url).toString(),
    })),
  };
}

export type FaqEntry = { question: string; answer: string };

export function faqPageSchema(
  faqs: FaqEntry[],
): WithContext<Record<string, unknown>> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

type ArticleInput = {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  authors?: string[];
  image?: string;
  tags?: string[];
};

export function articleSchema(
  article: ArticleInput,
): WithContext<Record<string, unknown>> {
  const url = new URL(`/blog/${article.slug}`, siteConfig.url).toString();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: new URL(
      article.image ?? `/api/og?title=${encodeURIComponent(article.title)}`,
      siteConfig.url,
    ).toString(),
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    author: (article.authors ?? siteConfig.founders).map((name) => ({
      "@type": "Person",
      name,
    })),
    publisher: { "@id": ORG_ID },
    keywords: article.tags?.join(", "),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "[data-speakable]"],
    },
  };
}
