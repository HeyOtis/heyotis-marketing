import Image from "next/image";
import { Container } from "@/components/marketing/Container";
import hallensteins from "@/public/clients/hallensteins.png";
import hatch from "@/public/clients/hatch.svg";
import ziwi from "@/public/clients/ziwi.svg";
import ajhackett from "@/public/clients/ajhackett.svg";
import daylyte from "@/public/clients/daylyte.png";
import motorhub from "@/public/clients/motorhub.png";

/* Client wordmarks, rendered as ink silhouettes (brightness-0 + opacity)
   so mixed source files sit quietly in the blueprint palette. Heights are
   tuned per mark so wordmarks and emblems carry even visual weight —
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

/** A quiet "Trusted by" strip: mono label, ink-silhouette client logos. */
export function ClientLogos() {
  return (
    <section className="surface-cream border-t border-border py-10 md:py-12">
      <Container>
        <div className="flex flex-col items-center gap-7 lg:flex-row lg:gap-12">
          <p className="label-mono shrink-0 text-[0.65rem] text-muted-foreground">
            Trusted by
          </p>
          <div className="flex flex-1 flex-wrap items-center justify-center gap-x-12 gap-y-7 lg:justify-between">
            {CLIENTS.map((client) => (
              <Image
                key={client.name}
                src={client.src}
                alt={client.name}
                unoptimized
                className="w-auto brightness-0 opacity-45"
                style={{ height: client.height }}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
