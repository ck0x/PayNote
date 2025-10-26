import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createProblemDetail } from "../auth/_lib/utils";

/**
 * GET /api/categories?orgId={orgId}
 * Get all categories for an organization
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orgId = searchParams.get("orgId");

    if (!orgId) {
      return NextResponse.json(
        createProblemDetail(400, "Bad Request", "orgId is required"),
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.orgId, orgId))
      .orderBy(categories.name);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      createProblemDetail(
        500,
        "Internal Server Error",
        "Failed to fetch categories"
      ),
      { status: 500 }
    );
  }
}
