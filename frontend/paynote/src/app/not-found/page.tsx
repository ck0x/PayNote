import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Home, LifeBuoy, RefreshCw } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageSearchParams = Record<string, string | string[] | undefined>;

type NotFoundPageProps = {
  searchParams?: PageSearchParams;
};

const FALLBACK = {
  code: "404",
  title: "Page not found",
  message:
    "We couldn't find what you were looking for. It might have been moved or removed.",
};

function getParam(params: PageSearchParams | undefined, key: string) {
  const value = params?.[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export function generateMetadata({
  searchParams,
}: NotFoundPageProps): Metadata {
  const code = getParam(searchParams, "code") ?? FALLBACK.code;
  const title = getParam(searchParams, "title") ?? FALLBACK.title;

  return {
    title: `${code} · ${title} | PayNote`,
    description: getParam(searchParams, "message") ?? FALLBACK.message,
  };
}

export default function NotFoundPage({ searchParams }: NotFoundPageProps) {
  const code = getParam(searchParams, "code") ?? FALLBACK.code;
  const title = getParam(searchParams, "title") ?? FALLBACK.title;
  const message = getParam(searchParams, "message") ?? FALLBACK.message;
  const hint = getParam(searchParams, "hint");
  const traceId = getParam(searchParams, "traceId");
  const origin = getParam(searchParams, "from");

  const metadata = [
    traceId ? { label: "Trace ID", value: traceId } : null,
    origin ? { label: "Origin", value: origin } : null,
    hint ? { label: "Details", value: hint } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      <section className="w-full max-w-2xl rounded-2xl border border-border/60 bg-card/80 p-10 shadow-card backdrop-blur">
        <div className="flex items-start gap-4">
          <span className="rounded-2xl bg-warning/10 p-3 text-warning">
            <AlertTriangle className="size-7" aria-hidden />
          </span>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Error {code}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-3 text-base text-muted-foreground">{message}</p>
          </div>
        </div>

        {metadata.length > 0 && (
          <dl className="mt-8 grid gap-3 rounded-xl border border-border bg-background/60 p-4 text-sm">
            {metadata.map((item) => (
              <div key={item.label}>
                <dt className="text-muted-foreground">{item.label}</dt>
                <dd className="break-words font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-10 flex flex-col gap-3 justify-between sm:flex-row">
          <Link
            href={origin ?? "/"}
            prefetch={false}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full sm:w-auto"
            )}
          >
            <RefreshCw className="size-4" aria-hidden />
            Try again
          </Link>
          <Link
            href="/"
            className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
          >
            <Home className="size-4" aria-hidden />
            Go back home
          </Link>
          <Link
            href="mailto:support@paynote.xyz"
            className={cn(
              buttonVariants({ variant: "destructive", size: "lg" }),
              "w-full sm:w-auto"
            )}
          >
            <LifeBuoy className="size-4" aria-hidden />
            Contact support
          </Link>
        </div>
      </section>
    </main>
  );
}
