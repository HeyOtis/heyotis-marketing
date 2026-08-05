import { cn } from "@/lib/utils";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  /** "reading" narrows the column for long-form prose; default matches the
   *  standard marketing section width. */
  width?: "default" | "reading";
};

export function Container({ className, width = "default", ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        width === "reading" ? "max-w-3xl" : "max-w-6xl",
        className,
      )}
      {...props}
    />
  );
}
