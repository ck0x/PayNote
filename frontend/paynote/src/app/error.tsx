"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const MAX_MESSAGE_LENGTH = 240;

function formatMessage(value: unknown) {
  if (typeof value === "string" && value.trim().length > 0) {
    const collapsed = value.replace(/\s+/g, " ").trim();
    if (collapsed.length > MAX_MESSAGE_LENGTH) {
      return `${collapsed.slice(0, MAX_MESSAGE_LENGTH - 1)}...`;
    }
    return collapsed;
  }
  return "Something unexpected happened.";
}

export default function GlobalError({ error }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams({
      code: "500",
      title: "Something went wrong",
      message: formatMessage(error?.message),
    });

    if (error?.name && error.name !== "Error") {
      params.set("hint", error.name);
    }
    if (error?.digest) {
      params.set("traceId", error.digest);
    }
    if (typeof window !== "undefined" && window.location.pathname) {
      params.set("from", window.location.pathname);
    }

    router.replace(`/not-found?${params.toString()}`);
  }, [error, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 py-16 text-center">
      <span className="rounded-full bg-warning/10 p-4 text-warning">
        <AlertTriangle className="size-8" aria-hidden />
      </span>
      <h1 className="text-xl font-semibold">Redirecting...</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        We ran into an unexpected error. Hang tight while we collect the
        details.
      </p>
    </div>
  );
}
