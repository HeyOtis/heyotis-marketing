import Link from "next/link";
import { ArrowRight } from "lucide-react";

type AnnouncementBarProps = {
  message: string;
  cta: { href: string; label: string };
  flag?: string;
};

export function AnnouncementBar({ message, cta, flag }: AnnouncementBarProps) {
  return (
    <div className="w-full bg-violet text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2.5 text-sm sm:px-6 lg:px-8">
        {flag && <span aria-hidden>{flag}</span>}
        <p className="truncate">
          {message}{" "}
          <Link
            href={cta.href}
            className="ml-1 inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
          >
            {cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </p>
      </div>
    </div>
  );
}
