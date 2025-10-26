import { NextRequest, NextResponse } from "next/server";
import { verifyPrivyToken } from "../auth/_lib/privy";
import {
  findAccountByPrivyId,
  listOrganizationsForAccount,
  saveOrganization,
} from "../auth/_lib/store";
import { createProblemDetail, extractBearerToken } from "../auth/_lib/utils";
import type { Organization } from "@/types/interfaces/Organization";
import { randomUUID } from "crypto";

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
    const currentAccount = await findAccountByPrivyId(
      privyPayload.claims.userId
    );

    if (!currentAccount) {
      return NextResponse.json(
        createProblemDetail(401, "Unauthorized", "Account not found"),
        { status: 401 }
      );
    }

    // Get all organizations the user belongs to
    const organizations = await listOrganizationsForAccount(
      currentAccount.accountId
    );

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

/**
 * POST /api/orgs
 * Create a new organization
 */
export async function POST(request: NextRequest) {
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
    const currentAccount = await findAccountByPrivyId(
      privyPayload.claims.userId
    );

    if (!currentAccount) {
      return NextResponse.json(
        createProblemDetail(401, "Unauthorized", "Account not found"),
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, slug, primaryCurrency } = body;

    // Validate required fields
    if (!name || !slug || !primaryCurrency) {
      return NextResponse.json(
        createProblemDetail(
          400,
          "Bad Request",
          "Missing required fields: name, slug, primaryCurrency"
        ),
        { status: 400 }
      );
    }

    // Create organization
    const organization: Organization = {
      orgId: randomUUID(),
      name,
      slug,
      primaryCurrency,
    };

    await saveOrganization(organization, currentAccount.accountId);

    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    console.error("POST /api/orgs error:", error);
    return NextResponse.json(
      createProblemDetail(
        500,
        "Internal Server Error",
        "Failed to create organization"
      ),
      { status: 500 }
    );
  }
}
