import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  subClassName?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "left",
  as = "h2",
  className,
  eyebrowClassName,
  titleClassName,
  subClassName,
}: SectionHeadingProps) {
  const Heading = as;
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow className={eyebrowClassName}>{eyebrow}</Eyebrow>
      ) : null}
      <Heading
        className={cn(
          as === "h1" ? "display-lg" : "display-md",
          "text-balance",
          titleClassName,
        )}
      >
        {title}
      </Heading>
      {sub ? (
        <p
          className={cn(
            "max-w-2xl text-lg leading-relaxed text-muted-foreground",
            align === "center" && "mx-auto",
            subClassName,
          )}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );
}
