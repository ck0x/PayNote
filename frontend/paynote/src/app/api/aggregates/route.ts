import { NextResponse } from "next/server";
import aggregates from "@/tests/example-data/aggregates";

/**
 * GET /api/aggregates
 * Returns pre-computed aggregated mock data for public tables.
 */
export async function GET() {
  return NextResponse.json(aggregates, { status: 200 });
}
