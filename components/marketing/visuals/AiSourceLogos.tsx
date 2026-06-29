import { OpenAI, Claude, Gemini, Perplexity } from "@lobehub/icons";
import { cn } from "@/lib/utils";

type LobeIcon = React.ComponentType<{ size?: number }>;

/** The four AI engines HeyOtis actually monitors. Order is intentional. */
export const AI_SOURCES: Array<{
  key: string;
  name: string;
  Icon: LobeIcon;
}> = [
  { key: "chatgpt", name: "ChatGPT", Icon: OpenAI as unknown as LobeIcon },
  { key: "claude", name: "Claude", Icon: Claude as unknown as LobeIcon },
  { key: "gemini", name: "Gemini", Icon: Gemini as unknown as LobeIcon },
  {
    key: "perplexity",
    name: "Perplexity",
    Icon: Perplexity as unknown as LobeIcon,
  },
];

export function AiSourceLogos({
  className,
  size = 26,
  withText = true,
  tone = "muted",
}: {
  className?: string;
  size?: number;
  withText?: boolean;
  tone?: "muted" | "cream";
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-8 gap-y-4",
        tone === "cream" ? "text-surface-dark-foreground/80" : "text-foreground/75",
        className,
      )}
    >
      {AI_SOURCES.map(({ key, name, Icon }) => (
        <div key={key} className="flex items-center gap-2">
          <Icon size={size} />
          {withText ? (
            <span className="text-sm font-medium tracking-tight">{name}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
