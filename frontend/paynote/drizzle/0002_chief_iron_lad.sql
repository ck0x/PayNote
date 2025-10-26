ALTER TABLE "accounts" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pay_notes" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "pay_notes" ALTER COLUMN "status" SET DEFAULT 'Pending';--> statement-breakpoint
DROP TYPE "public"."status";