CREATE TABLE "categories" (
	"category_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"icon" text,
	"visibility" text DEFAULT 'private' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pay_note_categories" (
	"pay_note_category_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pay_note_id" text NOT NULL,
	"category_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_org_id_organizations_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("org_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pay_note_categories" ADD CONSTRAINT "pay_note_categories_pay_note_id_pay_notes_pay_note_id_fk" FOREIGN KEY ("pay_note_id") REFERENCES "public"."pay_notes"("pay_note_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pay_note_categories" ADD CONSTRAINT "pay_note_categories_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_org_name_unique" ON "categories" USING btree ("org_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "pay_note_categories_pay_note_category_unique" ON "pay_note_categories" USING btree ("pay_note_id","category_id");