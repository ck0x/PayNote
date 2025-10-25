import { NextRequest, NextResponse } from "next/server";
import type { UUID } from "@/types/primitives/UUID";
import type { Role } from "@/types/enums/Role";
import { verifyPrivyToken } from "../../auth/_lib/privy";
import {
  findAccountByPrivyId,
  findAccountById,
  updateAccount,
  deleteAccount,
} from "../../auth/_lib/store";
import { createProblemDetail, extractBearerToken } from "../../auth/_lib/utils";

interface UpdateAccountRequest {
  role?: Role;
  displayName?: string;
  defaultWalletId?: UUID | null;
}

/**
 * PATCH /api/accounts/[accountId]
 * Update an account's details (role, display name, default wallet)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { accountId: string } }
) {
  try {
    const { accountId } = params;
    const body: UpdateAccountRequest = await request.json();

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

    // Find the account to update
    const targetAccount = findAccountById(accountId as UUID);
    if (!targetAccount) {
      return NextResponse.json(
        createProblemDetail(404, "Not Found", "Account not found"),
        { status: 404 }
      );
    }

    // Verify same organization
    if (currentAccount.orgId !== targetAccount.orgId) {
      return NextResponse.json(
        createProblemDetail(
          403,
          "Forbidden",
          "You can only update accounts in your organization"
        ),
        { status: 403 }
      );
    }

    // Permission checks for role changes
    if (body.role !== undefined) {
      // Can't change own role
      if (currentAccount.accountId === targetAccount.accountId) {
        return NextResponse.json(
          createProblemDetail(
            403,
            "Forbidden",
            "You cannot change your own role"
          ),
          { status: 403 }
        );
      }

      // Only Owner or Admin can change roles
      if (currentAccount.role !== "Owner" && currentAccount.role !== "Admin") {
        return NextResponse.json(
          createProblemDetail(
            403,
            "Forbidden",
            "Only Owners and Admins can change roles"
          ),
          { status: 403 }
        );
      }

      // Admins cannot modify Owners
      if (targetAccount.role === "Owner" && currentAccount.role !== "Owner") {
        return NextResponse.json(
          createProblemDetail(
            403,
            "Forbidden",
            "Only Owners can modify Owner accounts"
          ),
          { status: 403 }
        );
      }
    }

    // Update the account
    const updatedAccount = updateAccount(accountId as UUID, body);

    if (!updatedAccount) {
      return NextResponse.json(
        createProblemDetail(
          500,
          "Internal Server Error",
          "Failed to update account"
        ),
        { status: 500 }
      );
    }

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("PATCH /api/accounts/[accountId] error:", error);
    return NextResponse.json(
      createProblemDetail(
        500,
        "Internal Server Error",
        "Failed to update account"
      ),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/accounts/[accountId]
 * Remove an account from the organization
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { accountId: string } }
) {
  try {
    const { accountId } = params;

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

    // Find the account to delete
    const targetAccount = findAccountById(accountId as UUID);
    if (!targetAccount) {
      return NextResponse.json(
        createProblemDetail(404, "Not Found", "Account not found"),
        { status: 404 }
      );
    }

    // Verify same organization
    if (currentAccount.orgId !== targetAccount.orgId) {
      return NextResponse.json(
        createProblemDetail(
          403,
          "Forbidden",
          "You can only delete accounts in your organization"
        ),
        { status: 403 }
      );
    }

    // Can't delete yourself
    if (currentAccount.accountId === targetAccount.accountId) {
      return NextResponse.json(
        createProblemDetail(
          403,
          "Forbidden",
          "You cannot delete your own account"
        ),
        { status: 403 }
      );
    }

    // Only Owner or Admin can delete accounts
    if (currentAccount.role !== "Owner" && currentAccount.role !== "Admin") {
      return NextResponse.json(
        createProblemDetail(
          403,
          "Forbidden",
          "Only Owners and Admins can delete accounts"
        ),
        { status: 403 }
      );
    }

    // Admins cannot delete Owners
    if (targetAccount.role === "Owner" && currentAccount.role !== "Owner") {
      return NextResponse.json(
        createProblemDetail(
          403,
          "Forbidden",
          "Only Owners can delete Owner accounts"
        ),
        { status: 403 }
      );
    }

    // Delete the account
    const success = deleteAccount(accountId as UUID);

    if (!success) {
      return NextResponse.json(
        createProblemDetail(
          500,
          "Internal Server Error",
          "Failed to delete account"
        ),
        { status: 500 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/accounts/[accountId] error:", error);
    return NextResponse.json(
      createProblemDetail(
        500,
        "Internal Server Error",
        "Failed to delete account"
      ),
      { status: 500 }
    );
  }
}
