import { NextRequest, NextResponse } from "next/server";
import type { Account } from "@/types/interfaces/Account";
import type { Organization } from "@/types/interfaces/Organization";
import type { Wallet } from "@/types/interfaces/Wallet";
import type { Email } from "@/types/primitives/Email";
import { PrivyConfigurationError, PrivyVerificationError, verifyPrivyToken } from "../_lib/privy";
import { findAccountByPrivyId, listOrganizationsForAccount, listWalletsForAccount, saveAccount } from "../_lib/store";
import { createProblemDetail, extractBearerToken } from "../_lib/utils";

interface LoginResponse {
  account: Account;
  organizations: Organization[];
  wallets: Wallet[];
}

export async function POST(request: NextRequest) {
  try {
    const token = extractBearerToken(request);
    const { claims, user } = await verifyPrivyToken(token);
    const privyUserId = claims.userId;

    const existingAccount = findAccountByPrivyId(privyUserId);

    if (!existingAccount) {
      return NextResponse.json(
        createProblemDetail(404, "Account not found", "No PayNote account is linked to this Privy user. Please register first."),
        { status: 404 }
      );
    }

    const updatedAccount: Account = {
      ...existingAccount,
    };
    let shouldPersist = false;

    const privyEmail = user?.email?.address as Email | undefined;
    if (privyEmail && privyEmail !== existingAccount.email) {
      updatedAccount.email = privyEmail;
      shouldPersist = true;
    }

    if (shouldPersist) {
      saveAccount(updatedAccount, privyUserId);
    }

    const organizations = listOrganizationsForAccount(existingAccount.accountId);
    const wallets = listWalletsForAccount(existingAccount.accountId);

    const response: LoginResponse = {
      account: updatedAccount,
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

    console.error("Login error:", error);
    return NextResponse.json(
      createProblemDetail(500, "Internal Server Error", "Failed to login"),
      { status: 500 }
    );
  }
}
