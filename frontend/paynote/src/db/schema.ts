import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["Owner", "Admin", "Member", "Viewer"]);

export const organizations = pgTable(
  "organizations",
  {
    orgId: uuid("org_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    primaryCurrency: text("primary_currency").notNull().default("USD"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    slugIdx: uniqueIndex("organizations_slug_unique").on(table.slug),
  })
);

export const accounts = pgTable(
  "accounts",
  {
    accountId: uuid("account_id").primaryKey().defaultRandom(),
    orgId: uuid("org_id").notNull(),
    privyUserId: text("privy_user_id").notNull(),
    email: text("email"), // Nullable for wallet-only accounts
    displayName: text("display_name").notNull(),
    role: roleEnum("role").notNull().default("Owner"),
    defaultWalletId: uuid("default_wallet_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    privyIdx: uniqueIndex("accounts_privy_user_id_unique").on(
      table.privyUserId
    ),
    emailIdx: uniqueIndex("accounts_email_unique").on(table.email),
  })
);

export const wallets = pgTable(
  "wallets",
  {
    walletId: uuid("wallet_id").primaryKey().defaultRandom(),
    ownerAccountId: uuid("owner_account_id"),
    address: text("address").notNull(),
    ensName: text("ens_name"),
    label: text("label"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    addressIdx: uniqueIndex("wallets_address_unique").on(table.address),
  })
);

export const organizationMemberships = pgTable(
  "organization_memberships",
  {
    membershipId: uuid("membership_id").primaryKey().defaultRandom(),
    accountId: uuid("account_id").notNull(),
    orgId: uuid("org_id").notNull(),
    role: roleEnum("membership_role").notNull().default("Member"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    accountOrgIdx: uniqueIndex(
      "organization_memberships_account_org_unique"
    ).on(table.accountId, table.orgId),
  })
);

export const payNotes = pgTable(
  "pay_notes",
  {
    payNoteId: text("pay_note_id").primaryKey(),
    txHash: text("tx_hash").notNull(),
    chainId: integer("chain_id").notNull(),
    senderWalletId: uuid("sender_wallet_id")
      .notNull()
      .references(() => wallets.walletId),
    recipientWalletId: uuid("recipient_wallet_id")
      .notNull()
      .references(() => wallets.walletId),
    amountWei: text("amount_wei").notNull(),
    payReference: text("pay_reference"),
    fiatValueUsd: text("fiat_value_usd"),
    timestamp: integer("timestamp").notNull(), // UnixTime
    status: text("status").notNull().default("Pending"), // "Settled" | "Failed" | "Pending"
    orgId: uuid("org_id")
      .notNull()
      .references(() => organizations.orgId),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    txHashIdx: uniqueIndex("pay_notes_tx_hash_unique").on(table.txHash),
  })
);

export type AccountRow = typeof accounts.$inferSelect;
export type InsertAccountRow = typeof accounts.$inferInsert;
export type OrganizationRow = typeof organizations.$inferSelect;
export type InsertOrganizationRow = typeof organizations.$inferInsert;
export type WalletRow = typeof wallets.$inferSelect;
export type InsertWalletRow = typeof wallets.$inferInsert;
export type OrganizationMembershipRow =
  typeof organizationMemberships.$inferSelect;
export type PayNoteRow = typeof payNotes.$inferSelect;
export type InsertPayNoteRow = typeof payNotes.$inferInsert;
