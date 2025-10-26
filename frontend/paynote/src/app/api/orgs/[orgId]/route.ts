import { NextRequest, NextResponse } from "next/server";
import type { UUID } from "@/types/primitives/UUID";
import { verifyPrivyToken } from "../../auth/_lib/privy";
import {
  findAccountByPrivyId,
  findOrganizationById,
} from "../../auth/_lib/store";
import { createProblemDetail, extractBearerToken } from "../../auth/_lib/utils";

/**
 * GET /api/orgs/[orgId]
 * Get organization details by ID
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await context.params;

    // Authenticate user
    const token = extractBearerToken(request);
    if (!token) {
      return NextResponse.json(
        createProblemDetail(
          401,
          "Unauthorized",
          "Missing authentication token"
        ),
        { status: 401 }
      );
    }

    const privyPayload = await verifyPrivyToken(token);
    const currentAccount = await findAccountByPrivyId(
      privyPayload.claims.userId
    );

    if (!currentAccount) {
      return NextResponse.json(
        createProblemDetail(401, "Unauthorized", "Account not found"),
        { status: 401 }
      );
    }

    // Find the organization
    const organization = await findOrganizationById(orgId as UUID);
    if (!organization) {
      return NextResponse.json(
        createProblemDetail(404, "Not Found", "Organization not found"),
        { status: 404 }
      );
    }

    // Verify user has access to this organization
    if (currentAccount.orgId !== orgId) {
      return NextResponse.json(
        createProblemDetail(
          403,
          "Forbidden",
          "You don't have access to this organization"
        ),
        { status: 403 }
      );
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.error("GET /api/orgs/[orgId] error:", error);
    return NextResponse.json(
      createProblemDetail(
        500,
        "Internal Server Error",
        "Failed to get organization"
      ),
      { status: 500 }
    );
  }
}
