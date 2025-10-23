import { NextRequest, NextResponse } from "next/server";
import type { Account } from "@/types/interfaces/Account";
import type { Organization } from "@/types/interfaces/Organization";
import type { Wallet } from "@/types/interfaces/Wallet";
import type { Email } from "@/types/primitives/Email";
import { PrivyConfigurationError, PrivyVerificationError, verifyPrivyToken } from "../_lib/privy";
import { findAccountByPrivyId, listOrganizationsForAccount, listWalletsForAccount, saveAccount } from "../_lib/store";
import { createProblemDetail, extractBearerToken } from "../_lib/utils";

interface MeResponse {
  account: Account;
  organizations: Organization[];
  wallets: Wallet[];
}

export async function GET(request: NextRequest) {
  try {
    const token = extractBearerToken(request);
    const { claims, user } = await verifyPrivyToken(token);
    const privyUserId = claims.userId;

    const existingAccount = findAccountByPrivyId(privyUserId);

    if (!existingAccount) {
      return NextResponse.json(
        createProblemDetail(404, "Account not found", "No PayNote account is linked to this Privy user."),
        { status: 404 }
      );
    }

    const account: Account = { ...existingAccount };
    let shouldPersist = false;

    const privyEmail = user?.email?.address as Email | undefined;
    if (privyEmail && privyEmail !== existingAccount.email) {
      account.email = privyEmail;
      shouldPersist = true;
    }

    if (shouldPersist) {
      saveAccount(account, privyUserId);
    }

    const organizations = listOrganizationsForAccount(existingAccount.accountId);
    const wallets = listWalletsForAccount(existingAccount.accountId);

    const response: MeResponse = {
      account,
      organizations,
      wallets,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof PrivyConfigurationError) {
      return NextResponse.json(createProblemDetail(500, "Privy configuration error", error.message), {
        status: 500,
      });
    }

    if (error instanceof PrivyVerificationError) {
      return NextResponse.json(createProblemDetail(401, "Unable to verify Privy session", error.message), {
        status: 401,
      });
    }

    console.error("Get user error:", error);
    return NextResponse.json(
      createProblemDetail(500, "Internal Server Error", "Failed to fetch user data"),
      { status: 500 }
    );
  }
}
