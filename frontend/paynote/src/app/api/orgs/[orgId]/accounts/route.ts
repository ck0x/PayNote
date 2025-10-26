import { NextRequest, NextResponse } from "next/server";
import type { Account } from "@/types/interfaces/Account";
import type { UUID } from "@/types/primitives/UUID";
import type { Role } from "@/types/enums/Role";
import { verifyPrivyToken } from "../../../auth/_lib/privy";
import {
  findAccountByPrivyId,
  findOrganizationById,
  listAccountsForOrganization,
  saveAccount,
} from "../../../auth/_lib/store";
import {
  createProblemDetail,
  extractBearerToken,
} from "../../../auth/_lib/utils";

interface CreateAccountRequest {
  email: string;
  role: Role;
  displayName?: string;
}

/**
 * GET /api/orgs/[orgId]/accounts
 * List all accounts (members) in an organization
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await context.params;

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

    const organization = await findOrganizationById(orgId as UUID);
    if (!organization) {
      return NextResponse.json(
        createProblemDetail(404, "Not Found", "Organization not found"),
        { status: 404 }
      );
    }

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

    const accounts = await listAccountsForOrganization(orgId as UUID);

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("GET /api/orgs/[orgId]/accounts error:", error);
    return NextResponse.json(
      createProblemDetail(
        500,
        "Internal Server Error",
        "Failed to list accounts"
      ),
      { status: 500 }
    );
  }
}

/**
 * POST /api/orgs/[orgId]/accounts
 * Create a new account (invite member to organization)
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await context.params;
    const body: CreateAccountRequest = await request.json();

    if (!body.email || !body.role) {
      return NextResponse.json(
        createProblemDetail(400, "Bad Request", "Email and role are required"),
        { status: 400 }
      );
    }

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

    // Verify organization exists
    const organization = await findOrganizationById(orgId as UUID);
    if (!organization) {
      return NextResponse.json(
        createProblemDetail(404, "Not Found", "Organization not found"),
        { status: 404 }
      );
    }

    // Verify user has permission (must be Admin or Owner)
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

    if (currentAccount.role !== "Owner" && currentAccount.role !== "Admin") {
      return NextResponse.json(
        createProblemDetail(
          403,
          "Forbidden",
          "Only Owners and Admins can invite members"
        ),
        { status: 403 }
      );
    }

    const existingAccounts = await listAccountsForOrganization(orgId as UUID);
    const emailExists = existingAccounts.some(
      (acc: Account) => acc.email === body.email
    );

    if (emailExists) {
      return NextResponse.json(
        createProblemDetail(
          409,
          "Conflict",
          "An account with this email already exists in this organization"
        ),
        { status: 409 }
      );
    }

    const newAccount: Account = {
      accountId: crypto.randomUUID() as UUID,
      orgId: orgId as UUID,
      email: body.email,
      displayName: body.displayName || body.email.split("@")[0],
      role: body.role,
      defaultWalletId: null,
    };

    const placeholderPrivyId = `pending_${newAccount.accountId}`;
    await saveAccount(newAccount, placeholderPrivyId);

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error) {
    console.error("POST /api/orgs/[orgId]/accounts error:", error);
    return NextResponse.json(
      createProblemDetail(
        500,
        "Internal Server Error",
        "Failed to create account"
      ),
      { status: 500 }
    );
  }
}
