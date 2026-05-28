import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Image, { type ImageProps } from "next/image";
import type { AnchorHTMLAttributes } from "react";

export const mdxComponents: MDXComponents = {
    h1: ({ children }) => (
      <h1 className="mt-12 mb-6 text-4xl font-semibold tracking-tight first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-2xl font-semibold tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-xl font-semibold tracking-tight">
        {children}
      </h3>
    ),
    p: ({ children }) => <p className="my-4 leading-7">{children}</p>,
    ul: ({ children }) => (
      <ul className="my-4 ml-6 list-disc [&>li]:mt-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-zinc-300 pl-4 italic text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
        {children}
      </blockquote>
    ),
    a: ({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
      const target = href ?? "#";
      const isInternal = target.startsWith("/") || target.startsWith("#");
      if (isInternal) {
        return (
          <Link href={target} className="text-primary underline-offset-4 hover:underline">
            {children}
          </Link>
        );
      }
      return (
        <a
          href={target}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-4 hover:underline"
          {...rest}
        >
          {children}
        </a>
      );
    },
    img: (props) => (
      <Image
        {...(props as ImageProps)}
        width={800}
        height={450}
        className="my-6 rounded-lg"
        alt={props.alt ?? ""}
      />
    ),
    code: ({ children }) => (
      <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-800">
        {children}
      </code>
    ),
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components };
}
