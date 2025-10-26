import { NextRequest, NextResponse } from "next/server";
import type { Account } from "@/types/interfaces/Account";
import type { Organization } from "@/types/interfaces/Organization";
import type { Wallet } from "@/types/interfaces/Wallet";
import type { Email } from "@/types/primitives/Email";
import {
  PrivyConfigurationError,
  PrivyVerificationError,
  verifyPrivyToken,
} from "../_lib/privy";
import {
  findAccountByPrivyId,
  findWalletByAddress,
  findWalletById,
  listOrganizationsForAccount,
  listWalletsForAccount,
  saveAccount,
  saveOrganization,
  saveWallet,
  updateAccountDefaultWallet,
} from "../_lib/store";
import {
  createProblemDetail,
  extractBearerToken,
  slugify,
} from "../_lib/utils";

interface RegisterRequest {
  email?: string;
  walletAddress?: string;
  displayName?: string;
}

interface RegisterResponse {
  account: Account;
  organization: Organization;
  organizations: Organization[];
  wallet?: Wallet;
  wallets: Wallet[];
  isNewUser: boolean;
}

const DEFAULT_CURRENCY: Organization["primaryCurrency"] = "USD";

function resolveEmail(
  inputEmail: string | undefined,
  fallbackEmail: Email | undefined
) {
  if (inputEmail?.length) {
    return inputEmail;
  }

  if (fallbackEmail?.length) {
    return fallbackEmail;
  }

  return "" as Email;
}

function resolveDisplayName(
  displayName: string | undefined,
  email: Email,
  walletAddress?: string
) {
  if (displayName?.length) {
    return displayName;
  }

  if (email.length) {
    return email.split("@")[0] ?? "User";
  }

  if (walletAddress) {
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }

  return "PayNote User";
}

function buildOrganizationName(baseName: string) {
  return baseName.endsWith("s")
    ? `${baseName}' Workspace`
    : `${baseName}'s Workspace`;
}

function createOrganization(displayName: string, orgId: string) {
  const name = buildOrganizationName(displayName);
  const baseSlug = slugify(name) || `org-${orgId.slice(0, 6)}`;

  return {
    orgId,
    name,
    slug: `${baseSlug}-${orgId.slice(0, 6)}`,
    primaryCurrency: DEFAULT_CURRENCY,
  } satisfies Organization;
}

export async function POST(request: NextRequest) {
  try {
    const token = extractBearerToken(request);
    const { claims, user } = await verifyPrivyToken(token);
    const privyUserId = claims.userId;

    let body: RegisterRequest = {};
    try {
      body = (await request.json()) as RegisterRequest;
    } catch {
      // Ignore JSON parse errors and treat as empty body
    }

    const candidateEmail = resolveEmail(
      body.email,
      user?.email?.address as Email | undefined
    );
    const candidateDisplayName = resolveDisplayName(
      body.displayName,
      candidateEmail,
      body.walletAddress ?? user?.wallet?.address
    );

    const existingAccount = await findAccountByPrivyId(privyUserId);
    const isNewUser = !existingAccount;

    let account: Account;
    let organization: Organization;
    let wallet: Wallet | undefined;

    if (existingAccount) {
      const updatedAccount: Account = {
        ...existingAccount,
        email: candidateEmail || existingAccount.email,
        displayName: candidateDisplayName || existingAccount.displayName,
      };

      const walletAddress = body.walletAddress ?? user?.wallet?.address ?? null;

      if (walletAddress) {
        const normalizedAddress = walletAddress.toLowerCase();
        const globalWallet = await findWalletByAddress(walletAddress);

        if (
          globalWallet &&
          globalWallet.ownerAccountId !== updatedAccount.accountId
        ) {
          return NextResponse.json(
            createProblemDetail(
              409,
              "Wallet already linked",
              "The provided wallet address is linked to another PayNote account."
            ),
            { status: 409 }
          );
        }

        const existingWallets = await listWalletsForAccount(
          updatedAccount.accountId
        );
        wallet = existingWallets.find(
          (entry) => entry.address.toLowerCase() === normalizedAddress
        );

        if (!wallet) {
          wallet = {
            walletId: crypto.randomUUID(),
            address: walletAddress,
            ensName: null,
            label: `${updatedAccount.displayName}'s Wallet`,
            ownerAccountId: updatedAccount.accountId,
            createdAt: Math.floor(Date.now() / 1000),
          };
          await saveWallet(wallet);
        }

        updatedAccount.defaultWalletId = wallet.walletId;
      } else if (existingAccount.defaultWalletId) {
        wallet =
          (await findWalletById(existingAccount.defaultWalletId)) ?? undefined;
        updatedAccount.defaultWalletId =
          wallet?.walletId ?? existingAccount.defaultWalletId;
      } else {
        wallet = undefined;
        updatedAccount.defaultWalletId = null;
      }

      await saveAccount(updatedAccount, privyUserId);
      account = updatedAccount;

      let organizations = await listOrganizationsForAccount(account.accountId);
      if (!organizations.length) {
        organization = createOrganization(
          account.displayName,
          existingAccount.orgId
        );
        await saveOrganization(organization, account.accountId);
        organizations = await listOrganizationsForAccount(account.accountId);
      } else {
        organization = organizations[0]!;
      }

      const wallets = await listWalletsForAccount(account.accountId);
      if (!wallet && account.defaultWalletId) {
        wallet = wallets.find(
          (entry) => entry.walletId === account.defaultWalletId
        );
      }

      return NextResponse.json({
        account,
        organization,
        organizations,
        wallet,
        wallets,
        isNewUser,
      } satisfies RegisterResponse);
    }

    const accountId = crypto.randomUUID();
    const orgId = crypto.randomUUID();

    account = {
      accountId,
      orgId,
      email: candidateEmail,
      displayName: candidateDisplayName,
      role: "Owner",
      defaultWalletId: null,
    };

    organization = createOrganization(account.displayName, orgId);
    wallet = undefined;

    if (body.walletAddress ?? user?.wallet?.address) {
      const walletAddress = (body.walletAddress ?? user?.wallet?.address)!;
      const globalWallet = await findWalletByAddress(walletAddress);

      if (globalWallet) {
        return NextResponse.json(
          createProblemDetail(
            409,
            "Wallet already linked",
            "The provided wallet address is linked to another PayNote account."
          ),
          { status: 409 }
        );
      }

      const walletId = crypto.randomUUID();

      wallet = {
        walletId,
        address: walletAddress,
        ensName: null,
        label: `${account.displayName}'s Wallet`,
        ownerAccountId: accountId,
        createdAt: Math.floor(Date.now() / 1000),
      };

      account.defaultWalletId = walletId;
    }

    await saveOrganization(organization, accountId);
    await saveAccount(account, privyUserId);

    if (wallet) {
      await saveWallet(wallet);
      await updateAccountDefaultWallet(account.accountId, wallet.walletId);
    }

    const organizations = [organization];
    const wallets = wallet ? [wallet] : [];

    return NextResponse.json(
      {
        account,
        organization,
        organizations,
        wallet,
        wallets,
        isNewUser,
      } satisfies RegisterResponse,
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof PrivyConfigurationError) {
      return NextResponse.json(
        createProblemDetail(500, "Privy configuration error", error.message),
        {
          status: 500,
        }
      );
    }

    if (error instanceof PrivyVerificationError) {
      return NextResponse.json(
        createProblemDetail(
          401,
          "Unable to verify Privy session",
          error.message
        ),
        {
          status: 401,
        }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      createProblemDetail(
        500,
        "Internal Server Error",
        "Failed to register user"
      ),
      { status: 500 }
    );
  }
}
