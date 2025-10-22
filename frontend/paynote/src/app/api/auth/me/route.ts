import { NextRequest, NextResponse } from "next/server";
import type { Account } from "@/types/interfaces/Account";
import type { Organization } from "@/types/interfaces/Organization";
import type { Wallet } from "@/types/interfaces/Wallet";

/**
 * Current User Response
 */
interface MeResponse {
  account: Account;
  organizations: Organization[];
  wallets: Wallet[];
}

/**
 * GET /api/auth/me
 * Returns current authenticated user's account and associated data
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Verify Privy JWT token from Authorization header
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          type: "about:blank",
          title: "Authentication Required",
          status: 401,
          detail: "Missing authorization token",
        },
        { status: 401 }
      );
    }

    // TODO: Verify and decode Privy JWT
    // const privyUser = await verifyPrivyToken(token);
    // const privyUserId = privyUser.userId;

    // Mock: Extract Privy user ID from token (replace with actual verification)
    const privyUserId = "mock-privy-user-id";

    // TODO: Fetch account from database by Privy user ID
    // const account = await db.accounts.findByPrivyId(privyUserId);

    if (!privyUserId) {
      return NextResponse.json(
        {
          type: "about:blank",
          title: "Not Found",
          status: 404,
          detail: "Account not found",
        },
        { status: 404 }
      );
    }

    // Mock account data (replace with actual DB query)
    const accountId = crypto.randomUUID();
    const orgId = crypto.randomUUID();

    const account: Account = {
      accountId,
      orgId,
      email: "user@example.com",
      displayName: "Test User",
      role: "Owner",
      defaultWalletId: null,
    };

    // TODO: Fetch organizations where user is a member
    // const organizations = await db.organizations.findByAccountId(accountId);

    const organizations: Organization[] = [
      {
        orgId,
        name: "My Organization",
        slug: "my-org",
        billingPlan: "Free",
        primaryCurrency: "USD",
      },
    ];

    // TODO: Fetch user's wallets
    // const wallets = await db.wallets.findByOwnerAccountId(accountId);

    const wallets: Wallet[] = [];

    const response: MeResponse = {
      account,
      organizations,
      wallets,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      {
        type: "about:blank",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to fetch user data",
      },
      { status: 500 }
    );
  }
}
