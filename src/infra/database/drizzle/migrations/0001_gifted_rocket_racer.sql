CREATE TYPE "public"."currencies" AS ENUM('BRL', 'USD', 'EUR');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tb_wallets" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"balance" numeric(14, 2) DEFAULT '0.00' NOT NULL,
	"currency" "currencies" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tb_wallets" ADD CONSTRAINT "tb_wallets_user_id_tb_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tb_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
