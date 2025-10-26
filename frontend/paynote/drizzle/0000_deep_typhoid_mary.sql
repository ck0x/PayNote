CREATE TYPE "public"."role" AS ENUM('Owner', 'Admin', 'Member', 'Viewer');--> statement-breakpoint
CREATE TABLE "accounts" (
	"account_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"privy_user_id" text NOT NULL,
	"email" text NOT NULL,
	"display_name" text NOT NULL,
	"role" "role" DEFAULT 'Owner' NOT NULL,
	"default_wallet_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_memberships" (
	"membership_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"org_id" uuid NOT NULL,
	"membership_role" "role" DEFAULT 'Member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"org_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"primary_currency" text DEFAULT 'USD' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"wallet_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_account_id" uuid,
	"address" text NOT NULL,
	"ens_name" text,
	"label" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_privy_user_id_unique" ON "accounts" USING btree ("privy_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_email_unique" ON "accounts" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_memberships_account_org_unique" ON "organization_memberships" USING btree ("account_id","org_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organizations_slug_unique" ON "organizations" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "wallets_address_unique" ON "wallets" USING btree ("address");