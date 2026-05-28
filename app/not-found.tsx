import Link from "next/link";
import { Container } from "@/components/marketing/Container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-sm uppercase tracking-wider text-muted-foreground">
        404
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back to home</Link>
      </Button>
    </Container>
  );
}
