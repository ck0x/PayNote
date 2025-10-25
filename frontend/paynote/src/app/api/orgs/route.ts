import { NextRequest, NextResponse } from "next/server";
import { verifyPrivyToken } from "../auth/_lib/privy";
import {
  findAccountByPrivyId,
  listOrganizationsForAccount,
} from "../auth/_lib/store";
import { createProblemDetail, extractBearerToken } from "../auth/_lib/utils";

/**
 * GET /api/orgs
 * List all organizations for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
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
    const currentAccount = findAccountByPrivyId(privyPayload.claims.userId);

    if (!currentAccount) {
      return NextResponse.json(
        createProblemDetail(401, "Unauthorized", "Account not found"),
        { status: 401 }
      );
    }

    // Get all organizations the user belongs to
    const organizations = listOrganizationsForAccount(currentAccount.accountId);

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("GET /api/orgs error:", error);
    return NextResponse.json(
      createProblemDetail(
        500,
        "Internal Server Error",
        "Failed to list organizations"
      ),
      { status: 500 }
    );
  }
}
