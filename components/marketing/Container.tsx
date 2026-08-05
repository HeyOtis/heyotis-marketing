import { cn } from "@/lib/utils";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * `default` widens on large displays: 1152 -> 1280 at xl -> 1440 at 2xl.
   * `reading` stays at 768 and never widens. Long-form pages use it so a
   * 68ch prose column is not stranded as a ribbon in a wide shell.
   */
  width?: "default" | "reading";
};

/* Container is the sole owner of page-level max-width. Components should
   not set their own shell width - pass `width` or wrap in a Section. */
const widthClass = {
  default: "max-w-6xl xl:max-w-7xl 2xl:max-w-shell",
  reading: "max-w-3xl",
} as const;

export function Container({
  className,
  width = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12",
        widthClass[width],
        className,
      )}
      {...props}
    />
  );
}
