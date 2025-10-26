CREATE TYPE "public"."status" AS ENUM('Settled', 'Failed', 'Pending');--> statement-breakpoint
CREATE TABLE "pay_notes" (
	"pay_note_id" text PRIMARY KEY NOT NULL,
	"tx_hash" text NOT NULL,
	"chain_id" integer NOT NULL,
	"sender_wallet_id" uuid NOT NULL,
	"recipient_wallet_id" uuid NOT NULL,
	"amount_wei" text NOT NULL,
	"pay_reference" text,
	"fiat_value_usd" text,
	"timestamp" integer NOT NULL,
	"status" "status" DEFAULT 'Pending' NOT NULL,
	"org_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pay_notes" ADD CONSTRAINT "pay_notes_sender_wallet_id_wallets_wallet_id_fk" FOREIGN KEY ("sender_wallet_id") REFERENCES "public"."wallets"("wallet_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pay_notes" ADD CONSTRAINT "pay_notes_recipient_wallet_id_wallets_wallet_id_fk" FOREIGN KEY ("recipient_wallet_id") REFERENCES "public"."wallets"("wallet_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pay_notes" ADD CONSTRAINT "pay_notes_org_id_organizations_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("org_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "pay_notes_tx_hash_unique" ON "pay_notes" USING btree ("tx_hash");