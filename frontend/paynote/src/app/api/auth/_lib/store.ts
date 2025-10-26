import { db } from "@/config/db";
import {
  accounts,
  organizationMemberships,
  organizations,
  wallets,
  type AccountRow,
  type OrganizationRow,
  type WalletRow,
} from "@/db/schema";
import type { Role } from "@/types/enums/Role";
import type { Account } from "@/types/interfaces/Account";
import type { Organization } from "@/types/interfaces/Organization";
import type { Wallet } from "@/types/interfaces/Wallet";
import type { UUID } from "@/types/primitives/UUID";
import { eq, inArray } from "drizzle-orm";

function mapAccount(row: AccountRow): Account {
  return {
    accountId: row.accountId as UUID,
    orgId: row.orgId as UUID,
    email: row.email,
    displayName: row.displayName,
    role: row.role as Role,
    defaultWalletId: (row.defaultWalletId as UUID | null) ?? null,
  };
}

function mapOrganization(row: OrganizationRow): Organization {
  return {
    orgId: row.orgId as UUID,
    name: row.name,
    slug: row.slug,
    primaryCurrency: row.primaryCurrency,
  };
}

function mapWallet(row: WalletRow): Wallet {
  const createdAt =
    row.createdAt instanceof Date
      ? row.createdAt
      : row.createdAt
      ? new Date(row.createdAt)
      : new Date();

  return {
    walletId: row.walletId as UUID,
    ownerAccountId: (row.ownerAccountId as UUID | null) ?? null,
    address: row.address,
    ensName: row.ensName,
    label: row.label,
    createdAt: Math.floor(createdAt.getTime() / 1000),
  };
}

async function ensureMembership(accountId: UUID, orgId: UUID, role: Role) {
  await db
    .insert(organizationMemberships)
    .values({
      accountId,
      orgId,
      role,
    })
    .onConflictDoUpdate({
      target: [
        organizationMemberships.accountId,
        organizationMemberships.orgId,
      ],
      set: {
        role,
      },
    });
}

export async function findAccountByPrivyId(privyUserId: string) {
  const row = await db.query.accounts.findFirst({
    where: eq(accounts.privyUserId, privyUserId),
  });
  return row ? mapAccount(row) : undefined;
}

export async function findAccountByEmail(email: string) {
  if (!email || !email.trim()) {
    return undefined;
  }
  
  const row = await db.query.accounts.findFirst({
    where: eq(accounts.email, email),
  });
  return row ? mapAccount(row) : undefined;
}

export async function saveAccount(account: Account, privyUserId: string) {
  const emailValue = account.email && account.email.trim() ? account.email : null;
  
  await db
    .insert(accounts)
    .values({
      accountId: account.accountId,
      orgId: account.orgId,
      privyUserId,
      email: emailValue,
      displayName: account.displayName,
      role: account.role,
      defaultWalletId: account.defaultWalletId ?? null,
    })
    .onConflictDoUpdate({
      target: accounts.accountId,
      set: {
        orgId: account.orgId,
        privyUserId,
        email: emailValue,
        displayName: account.displayName,
        role: account.role,
        defaultWalletId: account.defaultWalletId ?? null,
      },
    });

  await ensureMembership(account.accountId, account.orgId, account.role);

  return account;
}

export async function updateAccountDefaultWallet(
  accountId: UUID,
  walletId: UUID | null
) {
  const updated = await db
    .update(accounts)
    .set({ defaultWalletId: walletId })
    .where(eq(accounts.accountId, accountId))
    .returning();

  return updated.length ? mapAccount(updated[0]!) : undefined;
}

export async function saveOrganization(
  organization: Organization,
  ownerAccountId: UUID
) {
  await db
    .insert(organizations)
    .values({
      orgId: organization.orgId,
      name: organization.name,
      slug: organization.slug,
      primaryCurrency: organization.primaryCurrency,
    })
    .onConflictDoUpdate({
      target: organizations.orgId,
      set: {
        name: organization.name,
        slug: organization.slug,
        primaryCurrency: organization.primaryCurrency,
      },
    });

  await ensureMembership(ownerAccountId, organization.orgId, "Owner");

  return organization;
}

export async function listOrganizationsForAccount(accountId: UUID) {
  const memberships = await db
    .select({ orgId: organizationMemberships.orgId })
    .from(organizationMemberships)
    .where(eq(organizationMemberships.accountId, accountId));

  if (!memberships.length) {
    return [];
  }

  const rows = await db
    .select()
    .from(organizations)
    .where(
      inArray(
        organizations.orgId,
        memberships.map((entry) => entry.orgId)
      )
    );

  return rows.map(mapOrganization);
}

export async function saveWallet(wallet: Wallet) {
  const normalizedAddress = wallet.address.toLowerCase();

  await db
    .insert(wallets)
    .values({
      walletId: wallet.walletId,
      ownerAccountId: wallet.ownerAccountId ?? null,
      address: normalizedAddress,
      ensName: wallet.ensName ?? null,
      label: wallet.label ?? null,
    })
    .onConflictDoUpdate({
      target: wallets.walletId,
      set: {
        ownerAccountId: wallet.ownerAccountId ?? null,
        address: normalizedAddress,
        ensName: wallet.ensName ?? null,
        label: wallet.label ?? null,
      },
    });

  return wallet;
}

export async function findWalletById(walletId: UUID) {
  const row = await db.query.wallets.findFirst({
    where: eq(wallets.walletId, walletId),
  });

  return row ? mapWallet(row) : undefined;
}

export async function findWalletByAddress(address: string) {
  const normalized = address.toLowerCase();
  const row = await db.query.wallets.findFirst({
    where: eq(wallets.address, normalized),
  });

  return row ? mapWallet(row) : undefined;
}

export async function listWalletsForAccount(accountId: UUID) {
  const rows = await db
    .select()
    .from(wallets)
    .where(eq(wallets.ownerAccountId, accountId));

  return rows.map(mapWallet);
}

export async function findOrganizationById(orgId: UUID) {
  const row = await db.query.organizations.findFirst({
    where: eq(organizations.orgId, orgId),
  });

  return row ? mapOrganization(row) : undefined;
}

export async function listAccountsForOrganization(orgId: UUID) {
  const rows = await db
    .select()
    .from(accounts)
    .where(eq(accounts.orgId, orgId));

  return rows.map(mapAccount);
}

export async function findAccountById(accountId: UUID) {
  const row = await db.query.accounts.findFirst({
    where: eq(accounts.accountId, accountId),
  });

  return row ? mapAccount(row) : undefined;
}

export async function updateAccount(
  accountId: UUID,
  updates: Partial<Account>
) {
  const updatePayload: Record<string, unknown> = {};

  if (updates.displayName !== undefined) {
    updatePayload.displayName = updates.displayName;
  }
  if (updates.role !== undefined) {
    updatePayload.role = updates.role;
  }
  if (updates.defaultWalletId !== undefined) {
    updatePayload.defaultWalletId = updates.defaultWalletId;
  }

  if (!Object.keys(updatePayload).length) {
    return findAccountById(accountId);
  }

  const rows = await db
    .update(accounts)
    .set(updatePayload)
    .where(eq(accounts.accountId, accountId))
    .returning();

  if (!rows.length) {
    return undefined;
  }

  const updated = mapAccount(rows[0]!);
  await ensureMembership(updated.accountId, updated.orgId, updated.role);
  return updated;
}

export async function deleteAccount(accountId: UUID) {
  await db
    .delete(organizationMemberships)
    .where(eq(organizationMemberships.accountId, accountId));

  const rows = await db
    .delete(accounts)
    .where(eq(accounts.accountId, accountId))
    .returning({ accountId: accounts.accountId });

  return rows.length > 0;
}
