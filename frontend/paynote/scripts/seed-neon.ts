import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv();
import crypto from "node:crypto";
import { eq, or } from "drizzle-orm";
import {
  accounts,
  organizationMemberships,
  organizations,
  wallets,
} from "../src/db/schema";

type DbClient = typeof import("../src/config/db");
let db!: DbClient["db"];

type Role = "Owner" | "Admin" | "Member" | "Viewer";

type SeedOrganization = {
  orgId: string;
  name: string;
  slug: string;
  billingPlan: "Free" | "Team" | "Enterprise";
  primaryCurrency: string;
};

type SeedAccount = {
  accountId: string;
  privyUserId: string;
  email: string;
  displayName: string;
  role: Role;
  primaryOrgSlug: string;
  walletAddress?: string;
  extraMemberships?: Array<{
    orgSlug: string;
    role: Role;
  }>;
};

const ORGS: SeedOrganization[] = [
  {
    orgId: "8e30e645-4a2c-48cf-8b94-03641726d6c4",
    name: "TM Inc.",
    slug: "tm-inc",
    billingPlan: "Free",
    primaryCurrency: "USD",
  },
  {
    orgId: "cad3d492-5fca-4d60-9c0f-a974a1294a5c",
    name: "TrissyG Industries",
    slug: "trissyg-industries",
    billingPlan: "Free",
    primaryCurrency: "USD",
  },
];

const ACCOUNTS: SeedAccount[] = [
  {
    accountId: "6a0f8bc7-2084-4b6a-a56e-d4c172402d56",
    privyUserId: "cmgp2izia018fkz0exmrbl2i1",
    email: "tristan_m_smith@outlook.com",
    displayName: "Tristan M.",
    role: "Owner",
    primaryOrgSlug: "tm-inc",
    walletAddress: "0x1Ec6A4833cDac57CC057e7d8099464177afF8B91",
  },
  {
    accountId: "d8f439ef-026e-4a8f-aad9-d5c3fa32fa3f",
    privyUserId: "cmgt4chpo007vi50cq55hikfn",
    email: "trissy.g.dev@gmail.com",
    displayName: "Trissy G.",
    role: "Owner",
    primaryOrgSlug: "trissyg-industries",
    walletAddress: "0xdF2E7f92F2e944aE4f5042D6a87B6ba8a2cfe277",
    extraMemberships: [
      {
        orgSlug: "tm-inc",
        role: "Admin",
      },
    ],
  },
];

async function upsertOrganization(seed: SeedOrganization) {
  const [row] = await db
    .insert(organizations)
    .values({
      orgId: seed.orgId,
      name: seed.name,
      slug: seed.slug,
      billingPlan: seed.billingPlan,
      primaryCurrency: seed.primaryCurrency,
    })
    .onConflictDoUpdate({
      target: organizations.slug,
      set: {
        name: seed.name,
        billingPlan: seed.billingPlan,
        primaryCurrency: seed.primaryCurrency,
      },
    })
    .returning();

  return row ?? (await db.query.organizations.findFirst({
    where: eq(organizations.slug, seed.slug),
  }))!;
}

async function upsertAccount(
  seed: SeedAccount,
  orgIdBySlug: Map<string, string>
) {
  const orgId = orgIdBySlug.get(seed.primaryOrgSlug);
  if (!orgId) {
    throw new Error(`Unknown org slug "${seed.primaryOrgSlug}"`);
  }

  await db
    .delete(accounts)
    .where(
      or(
        eq(accounts.privyUserId, seed.privyUserId),
        eq(accounts.email, seed.email)
      )
    );

  const [row] = await db
    .insert(accounts)
    .values({
      accountId: seed.accountId,
      orgId,
      privyUserId: seed.privyUserId,
      email: seed.email,
      displayName: seed.displayName,
      role: seed.role,
      defaultWalletId: null,
    })
    .onConflictDoUpdate({
      target: accounts.privyUserId,
      set: {
        orgId,
        email: seed.email,
        displayName: seed.displayName,
        role: seed.role,
      },
    })
    .returning();

  return row ?? (await db.query.accounts.findFirst({
    where: eq(accounts.privyUserId, seed.privyUserId),
  }))!;
}

async function upsertMembership(
  accountId: string,
  orgId: string,
  role: Role
) {
  await db
    .insert(organizationMemberships)
    .values({
      membershipId: crypto.randomUUID(),
      accountId,
      orgId,
      role,
    })
    .onConflictDoUpdate({
      target: [
        organizationMemberships.accountId,
        organizationMemberships.orgId,
      ],
      set: { role },
    });
}

async function upsertWallet(
  accountId: string,
  address?: string,
  label?: string
) {
  if (!address) {
    return null;
  }

  const normalized = address.toLowerCase();
  const existing = await db.query.wallets.findFirst({
    where: eq(wallets.address, normalized),
  });

  if (existing) {
    await db
      .update(accounts)
      .set({ defaultWalletId: existing.walletId })
      .where(eq(accounts.accountId, accountId));
    return existing.walletId;
  }

  const walletId = crypto.randomUUID();
  await db.insert(wallets).values({
    walletId,
    ownerAccountId: accountId,
    address: normalized,
    ensName: null,
    label: label ?? "Primary Wallet",
  });

  await db
    .update(accounts)
    .set({ defaultWalletId: walletId })
    .where(eq(accounts.accountId, accountId));

  return walletId;
}

async function main() {
  const dbModule = await import("../src/config/db");
  db = dbModule.db;

  console.log("Seeding Neon database with starter organizations and accounts...");

  const orgIdBySlug = new Map<string, string>();
  for (const org of ORGS) {
    const inserted = await upsertOrganization(org);
    orgIdBySlug.set(org.slug, inserted.orgId);
    console.log(`✔ Organization ready: ${org.name}`);
  }

  for (const account of ACCOUNTS) {
    const savedAccount = await upsertAccount(account, orgIdBySlug);
    await upsertMembership(savedAccount.accountId, savedAccount.orgId, account.role);

    if (account.extraMemberships?.length) {
      for (const extra of account.extraMemberships) {
        const extraOrgId = orgIdBySlug.get(extra.orgSlug);
        if (!extraOrgId) {
          throw new Error(`Unknown org slug "${extra.orgSlug}"`);
        }
        await upsertMembership(savedAccount.accountId, extraOrgId, extra.role);
      }
    }

    await upsertWallet(
      savedAccount.accountId,
      account.walletAddress,
      `${account.displayName}'s Wallet`
    );

    console.log(`✔ Account ready: ${account.displayName} (${account.email})`);
  }

  console.log("Done! You can now log in with the seeded Privy accounts.");
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
