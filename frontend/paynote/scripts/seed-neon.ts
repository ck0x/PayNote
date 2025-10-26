import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv();
import crypto from "node:crypto";
import { eq, or } from "drizzle-orm";
import { parseEther } from "viem";
import {
  accounts,
  organizationMemberships,
  organizations,
  wallets,
  payNotes,
  categories,
} from "../src/db/schema";

type DbClient = typeof import("../src/config/db");
let db!: DbClient["db"];

type Role = "Owner" | "Admin" | "Member" | "Viewer";

type SeedOrganization = {
  orgId: string;
  name: string;
  slug: string;
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
    primaryCurrency: "USD",
  },
  {
    orgId: "cad3d492-5fca-4d60-9c0f-a974a1294a5c",
    name: "TrissyG Industries",
    slug: "trissyg-industries",
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

type SeedCategory = {
  orgSlug: string;
  name: string;
  color: string;
  icon: string;
  visibility: string;
};

const CATEGORIES: SeedCategory[] = [
  {
    orgSlug: "tm-inc",
    name: "Operations",
    color: "#3B82F6",
    icon: "🏢",
    visibility: "private",
  },
  {
    orgSlug: "tm-inc",
    name: "Personal",
    color: "#8B5CF6",
    icon: "👤",
    visibility: "private",
  },
  {
    orgSlug: "tm-inc",
    name: "Payroll",
    color: "#10B981",
    icon: "💰",
    visibility: "private",
  },
  {
    orgSlug: "tm-inc",
    name: "Customer",
    color: "#F59E0B",
    icon: "🤝",
    visibility: "private",
  },
  {
    orgSlug: "tm-inc",
    name: "Research & Development",
    color: "#EF4444",
    icon: "🔬",
    visibility: "private",
  },
  {
    orgSlug: "trissyg-industries",
    name: "Operations",
    color: "#3B82F6",
    icon: "🏢",
    visibility: "private",
  },
  {
    orgSlug: "trissyg-industries",
    name: "Personal",
    color: "#8B5CF6",
    icon: "👤",
    visibility: "private",
  },
  {
    orgSlug: "trissyg-industries",
    name: "Payroll",
    color: "#10B981",
    icon: "💰",
    visibility: "private",
  },
  {
    orgSlug: "trissyg-industries",
    name: "Customer",
    color: "#F59E0B",
    icon: "🤝",
    visibility: "private",
  },
  {
    orgSlug: "trissyg-industries",
    name: "Research & Development",
    color: "#EF4444",
    icon: "🔬",
    visibility: "private",
  },
];

async function upsertOrganization(seed: SeedOrganization) {
  const [row] = await db
    .insert(organizations)
    .values({
      orgId: seed.orgId,
      name: seed.name,
      slug: seed.slug,
      primaryCurrency: seed.primaryCurrency,
    })
    .onConflictDoUpdate({
      target: organizations.slug,
      set: {
        name: seed.name,
        primaryCurrency: seed.primaryCurrency,
      },
    })
    .returning();

  return (
    row ??
    (await db.query.organizations.findFirst({
      where: eq(organizations.slug, seed.slug),
    }))!
  );
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

  return (
    row ??
    (await db.query.accounts.findFirst({
      where: eq(accounts.privyUserId, seed.privyUserId),
    }))!
  );
}

async function upsertMembership(accountId: string, orgId: string, role: Role) {
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

async function upsertCategory(
  seed: SeedCategory,
  orgIdBySlug: Map<string, string>
) {
  const orgId = orgIdBySlug.get(seed.orgSlug);
  if (!orgId) {
    throw new Error(`Unknown org slug "${seed.orgSlug}"`);
  }

  await db
    .insert(categories)
    .values({
      orgId,
      name: seed.name,
      color: seed.color,
      icon: seed.icon,
      visibility: seed.visibility,
    })
    .onConflictDoUpdate({
      target: [categories.orgId, categories.name],
      set: {
        color: seed.color,
        icon: seed.icon,
        visibility: seed.visibility,
      },
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

type SeedPayNote = {
  payNoteId: string;
  txHash: string;
  chainId: number;
  senderWalletAddress: string;
  recipientWalletAddress: string;
  amountWei: string;
  payReference?: string | null;
  fiatValueUsd?: string | null;
  timestamp: number;
  status: "Settled" | "Failed" | "Pending";
  orgSlug: string;
};

const toUnixTime = (isoTimestamp: string) =>
  Math.floor(new Date(isoTimestamp).getTime() / 1000);

const PAY_NOTES: SeedPayNote[] = [
  {
    payNoteId:
      "0x8f1c56cfa6f27a611dcb0d1f9d7a27bd1c1df5a2d907f96695df8d90fa1a2e11",
    txHash:
      "0x8f1c56cfa6f27a611dcb0d1f9d7a27bd1c1df5a2d907f96695df8d90fa1a2e11",
    chainId: 11155420,
    senderWalletAddress: "0x1Ec6A4833cDac57CC057e7d8099464177afF8B91",
    recipientWalletAddress: "0xdF2E7f92F2e944aE4f5042D6a87B6ba8a2cfe277",
    amountWei: parseEther("1.25").toString(),
    fiatValueUsd: "3850",
    payReference: "Monthly infra spend",
    timestamp: toUnixTime("2025-01-22T14:13:00Z"),
    status: "Settled",
    orgSlug: "tm-inc",
  },
  {
    payNoteId:
      "0xd28d82cdee5800ce659a89f6ca9f3997747f83f52ea95d7f92f5ec5327c0bd4d",
    txHash:
      "0xd28d82cdee5800ce659a89f6ca9f3997747f83f52ea95d7f92f5ec5327c0bd4d",
    chainId: 84532,
    senderWalletAddress: "0xdF2E7f92F2e944aE4f5042D6a87B6ba8a2cfe277",
    recipientWalletAddress: "0x1Ec6A4833cDac57CC057e7d8099464177afF8B91",
    amountWei: parseEther("0.32").toString(),
    fiatValueUsd: "985",
    payReference: "Team stipend",
    timestamp: toUnixTime("2025-01-21T09:42:00Z"),
    status: "Settled",
    orgSlug: "tm-inc",
  },
  {
    payNoteId:
      "0x5cde43ef1f34341b6d1941f2af4d5ff55ba2a8fec209ef2c92aea1e22df0fa1c",
    txHash:
      "0x5cde43ef1f34341b6d1941f2af4d5ff55ba2a8fec209ef2c92aea1e22df0fa1c",
    chainId: 10,
    senderWalletAddress: "0x1Ec6A4833cDac57CC057e7d8099464177afF8B91",
    recipientWalletAddress: "0xdF2E7f92F2e944aE4f5042D6a87B6ba8a2cfe277",
    amountWei: parseEther("2.80").toString(),
    fiatValueUsd: "8625",
    payReference: "Contractor payout",
    timestamp: toUnixTime("2025-01-20T18:07:00Z"),
    status: "Settled",
    orgSlug: "trissyg-industries",
  },
  {
    payNoteId:
      "0x72f0c3f11842631f7a0bb637c53ff3830c9fe52ef7b617d11d6b6dc09f5ac221",
    txHash:
      "0x72f0c3f11842631f7a0bb637c53ff3830c9fe52ef7b617d11d6b6dc09f5ac221",
    chainId: 11155420,
    senderWalletAddress: "0xdF2E7f92F2e944aE4f5042D6a87B6ba8a2cfe277",
    recipientWalletAddress: "0x1Ec6A4833cDac57CC057e7d8099464177afF8B91",
    amountWei: parseEther("0.08").toString(),
    fiatValueUsd: "246",
    payReference: null,
    timestamp: toUnixTime("2025-01-19T11:55:00Z"),
    status: "Pending",
    orgSlug: "trissyg-industries",
  },
  {
    payNoteId:
      "0x0c7b2e014df16472d311e008256cf0122dc4833aa4a385239b5c2d67c7054491",
    txHash:
      "0x0c7b2e014df16472d311e008256cf0122dc4833aa4a385239b5c2d67c7054491",
    chainId: 8453,
    senderWalletAddress: "0x1Ec6A4833cDac57CC057e7d8099464177afF8B91",
    recipientWalletAddress: "0xdF2E7f92F2e944aE4f5042D6a87B6ba8a2cfe277",
    amountWei: parseEther("1.95").toString(),
    fiatValueUsd: "6005",
    payReference: "Testnet faucet streaming",
    timestamp: toUnixTime("2025-01-17T16:21:00Z"),
    status: "Settled",
    orgSlug: "tm-inc",
  },
  {
    payNoteId:
      "0x1d0fbea161bb3c2971094a8845bc3c4df436f121b4d2b0ed0278289161af6c22",
    txHash:
      "0x1d0fbea161bb3c2971094a8845bc3c4df436f121b4d2b0ed0278289161af6c22",
    chainId: 11155420,
    senderWalletAddress: "0xdF2E7f92F2e944aE4f5042D6a87B6ba8a2cfe277",
    recipientWalletAddress: "0x1Ec6A4833cDac57CC057e7d8099464177afF8B91",
    amountWei: parseEther("0.54").toString(),
    fiatValueUsd: "1670",
    payReference: "Node service credits",
    timestamp: toUnixTime("2025-01-15T08:02:00Z"),
    status: "Settled",
    orgSlug: "trissyg-industries",
  },
];

async function upsertPayNote(
  seed: SeedPayNote,
  orgIdBySlug: Map<string, string>,
  walletIdByAddress: Map<string, string>
) {
  const orgId = orgIdBySlug.get(seed.orgSlug);
  if (!orgId) {
    throw new Error(`Unknown org slug "${seed.orgSlug}"`);
  }

  const senderWalletId = walletIdByAddress.get(
    seed.senderWalletAddress.toLowerCase()
  );
  const recipientWalletId = walletIdByAddress.get(
    seed.recipientWalletAddress.toLowerCase()
  );

  if (!senderWalletId || !recipientWalletId) {
    throw new Error(
      `Wallet not found: sender=${seed.senderWalletAddress}, recipient=${seed.recipientWalletAddress}`
    );
  }

  await db
    .insert(payNotes)
    .values({
      payNoteId: seed.payNoteId,
      txHash: seed.txHash,
      chainId: seed.chainId,
      senderWalletId,
      recipientWalletId,
      amountWei: seed.amountWei,
      payReference: seed.payReference,
      fiatValueUsd: seed.fiatValueUsd,
      timestamp: seed.timestamp,
      status: seed.status,
      orgId,
    })
    .onConflictDoUpdate({
      target: payNotes.payNoteId,
      set: {
        status: seed.status,
        fiatValueUsd: seed.fiatValueUsd,
      },
    });
}

async function main() {
  const dbModule = await import("../src/config/db");
  db = dbModule.db;

  console.log(
    "Seeding Neon database with starter organizations and accounts..."
  );

  const orgIdBySlug = new Map<string, string>();
  for (const org of ORGS) {
    const inserted = await upsertOrganization(org);
    orgIdBySlug.set(org.slug, inserted.orgId);
    console.log(`✔ Organization ready: ${org.name}`);
  }

  console.log("\nSeeding Categories...");
  for (const category of CATEGORIES) {
    await upsertCategory(category, orgIdBySlug);
    console.log(`✔ Category ready: ${category.name} (${category.orgSlug})`);
  }

  const walletIdByAddress = new Map<string, string>();
  for (const account of ACCOUNTS) {
    const savedAccount = await upsertAccount(account, orgIdBySlug);
    await upsertMembership(
      savedAccount.accountId,
      savedAccount.orgId,
      account.role
    );

    if (account.extraMemberships?.length) {
      for (const extra of account.extraMemberships) {
        const extraOrgId = orgIdBySlug.get(extra.orgSlug);
        if (!extraOrgId) {
          throw new Error(`Unknown org slug "${extra.orgSlug}"`);
        }
        await upsertMembership(savedAccount.accountId, extraOrgId, extra.role);
      }
    }

    const walletId = await upsertWallet(
      savedAccount.accountId,
      account.walletAddress,
      `${account.displayName}'s Wallet`
    );

    if (walletId && account.walletAddress) {
      walletIdByAddress.set(account.walletAddress.toLowerCase(), walletId);
    }

    console.log(`✔ Account ready: ${account.displayName} (${account.email})`);
  }

  console.log("\nSeeding PayNotes...");
  for (const payNote of PAY_NOTES) {
    await upsertPayNote(payNote, orgIdBySlug, walletIdByAddress);
    console.log(
      `✔ PayNote ready: ${payNote.payNoteId.slice(0, 10)}... (${
        payNote.payReference || "No reference"
      })`
    );
  }

  console.log("\nDone! You can now log in with the seeded Privy accounts.");
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
