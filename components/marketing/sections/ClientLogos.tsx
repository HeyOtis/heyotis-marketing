import Image from "next/image";
import { Container } from "@/components/marketing/Container";
import { Marquee } from "@/components/ui/marquee";
import hallensteins from "@/public/clients/hallensteins.png";
import hatch from "@/public/clients/hatch.svg";
import ziwi from "@/public/clients/ziwi.svg";
import ajhackett from "@/public/clients/ajhackett.svg";
import daylyte from "@/public/clients/daylyte.png";
import motorhub from "@/public/clients/motorhub.png";

/* Client wordmarks, rendered as ink silhouettes (brightness-0 + opacity)
   so mixed source files sit quietly in the blueprint palette. Heights are
   tuned per mark so wordmarks and emblems carry even visual weight -
   don't normalize them to one value. To add a client: drop the file in
   public/clients/ and add a row. */
const CLIENTS: { name: string; src: typeof hallensteins; height: number }[] = [
  { name: "Hallensteins", src: hallensteins, height: 18 },
  { name: "Hatch", src: hatch, height: 22 },
  { name: "Ziwi", src: ziwi, height: 30 },
  { name: "AJ Hackett Bungy", src: ajhackett, height: 42 },
  { name: "Daylyte", src: daylyte, height: 20 },
  { name: "Motorhub", src: motorhub, height: 20 },
];

/** A quiet "Trusted by" strip on white: mono label, ink-silhouette client
    logos drifting past in a slow marquee (paused on hover, and by the
    prefers-reduced-motion rule in globals.css). */
export function ClientLogos() {
  return (
    <section className="surface-card border-y border-border py-10 md:py-12">
      <Container>
        <p className="label-mono text-center text-[0.65rem] text-muted-foreground">
          Trusted by
        </p>
        {/* Held inside the container so marks fade in and out exactly on the
            content margin line, not at the viewport edge. */}
        <Marquee
          pauseOnHover
          className="mt-8 px-0 py-0 [--duration:60s] [--gap:4rem] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [&>div]:items-center md:[--gap:6rem]"
        >
          {CLIENTS.map((client) => (
            <Image
              key={client.name}
              src={client.src}
              alt={client.name}
              unoptimized
              className="w-auto max-w-none shrink-0 brightness-0 opacity-45"
              style={{ height: client.height }}
            />
          ))}
        </Marquee>
      </Container>
    </section>
  );
}
