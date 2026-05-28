import { siteConfig } from "@/lib/site";

type WithContext<T> = T & { "@context": "https://schema.org" };

export function organizationSchema(): WithContext<Record<string, unknown>> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
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
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
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
    image: article.image
      ? new URL(article.image, siteConfig.url).toString()
      : new URL(siteConfig.defaultOgImage, siteConfig.url).toString(),
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    author: (article.authors ?? siteConfig.founders).map((name) => ({
      "@type": "Person",
      name,
    })),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: new URL("/logo.png", siteConfig.url).toString(),
      },
    },
    keywords: article.tags?.join(", "),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "[data-speakable]"],
    },
  };
}

export function localBusinessSchema(): WithContext<Record<string, unknown>> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.contactEmail,
    sameAs: Object.values(siteConfig.socials),
  };
}
