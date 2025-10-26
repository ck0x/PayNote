import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createProblemDetail } from "../../../auth/_lib/utils";

/**
 * GET /api/orgs/{orgId}/categories
 * Get all categories for an organization
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;

    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.orgId, orgId))
      .orderBy(categories.name);

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      `GET /api/orgs/${(await params).orgId}/categories error:`,
      error
    );
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
