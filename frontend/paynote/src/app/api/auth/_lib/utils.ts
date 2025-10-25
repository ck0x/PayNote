import type { NextRequest } from "next/server";
import type { ProblemDetail } from "@/types/interfaces/ProblemDetail";

export function extractBearerToken(request: NextRequest) {
  const header = request.headers.get("Authorization") ?? request.headers.get("authorization");
  if (!header) {
    return null;
  }

  const matches = header.match(/^Bearer\s+(.+)$/i);
  return matches ? matches[1].trim() : header.trim();
}

export function createProblemDetail(
  status: number,
  title: string,
  detail: string,
  extras: Partial<ProblemDetail> = {}
): ProblemDetail {
  return {
    type: "about:blank",
    title,
    status,
    detail,
    ...extras,
  };
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}
