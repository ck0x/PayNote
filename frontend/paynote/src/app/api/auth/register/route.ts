import { NextRequest, NextResponse } from "next/server";
import type { Account } from "@/types/interfaces/Account";
import type { Organization } from "@/types/interfaces/Organization";
import type { Wallet } from "@/types/interfaces/Wallet";

/**
 * Register Request Body
 */
interface RegisterRequest {
  privyUserId: string;
  email?: string;
  walletAddress?: string;
  displayName?: string;
}

/**
 * Register Response
 */
interface RegisterResponse {
  account: Account;
  organization: Organization;
  wallet?: Wallet;
  isNewUser: boolean;
}

/**
 * POST /api/auth/register
 * Creates or retrieves account and organization for authenticated Privy user
 */
export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { privyUserId, email, walletAddress, displayName } = body;

    if (!privyUserId) {
      return NextResponse.json(
        {
          type: "about:blank",
          title: "Validation Error",
          status: 400,
          detail: "privyUserId is required",
        },
        { status: 400 }
      );
    }

    // TODO: Verify Privy JWT token from Authorization header
    // const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    // await verifyPrivyToken(token);

    // TODO: Check if account already exists in database
    // const existingAccount = await db.accounts.findByPrivyId(privyUserId);

    // Mock: Simulate checking for existing user
    const existingAccount = null; // Replace with actual DB call

    if (existingAccount) {
      // User already registered, return existing data
      // TODO: Fetch from database
      return NextResponse.json({
        account: existingAccount,
        organization: {}, // Fetch actual org
        isNewUser: false,
      });
    }

    // Create new account
    const accountId = crypto.randomUUID();
    const orgId = crypto.randomUUID();

    // Create default organization
    const organization: Organization = {
      orgId,
      name: displayName ? `${displayName}'s Organization` : "My Organization",
      slug: `org-${accountId.slice(0, 8)}`,
      billingPlan: "Free",
      primaryCurrency: "USD",
    };

    // TODO: Save organization to database
    // await db.organizations.create(organization);

    // Create account
    const account: Account = {
      accountId,
      orgId,
      email: email || "",
      displayName: displayName || email?.split("@")[0] || "User",
      role: "Owner",
      defaultWalletId: null,
    };

    // TODO: Save account to database with Privy user ID
    // await db.accounts.create({ ...account, privyUserId });

    // If wallet address provided, create wallet record
    let wallet: Wallet | undefined;
    if (walletAddress) {
      const walletId = crypto.randomUUID();
      wallet = {
        walletId,
        address: walletAddress,
        ensName: null,
        label: "Primary Wallet",
        ownerAccountId: accountId,
        createdAt: Math.floor(Date.now() / 1000),
      };

      // TODO: Save wallet to database
      // await db.wallets.create(wallet);

      // Update account with default wallet
      account.defaultWalletId = walletId;
      // await db.accounts.update(accountId, { defaultWalletId: walletId });
    }

    const response: RegisterResponse = {
      account,
      organization,
      wallet,
      isNewUser: true,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        type: "about:blank",
        title: "Internal Server Error",
        status: 500,
        detail: "Failed to register user",
      },
      { status: 500 }
    );
  }
}
