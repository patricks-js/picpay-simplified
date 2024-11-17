CREATE TABLE IF NOT EXISTS "tb_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"payerId" integer NOT NULL,
	"payeeId" integer NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tb_transactions" ADD CONSTRAINT "tb_transactions_payerId_tb_users_id_fk" FOREIGN KEY ("payerId") REFERENCES "public"."tb_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tb_transactions" ADD CONSTRAINT "tb_transactions_payeeId_tb_users_id_fk" FOREIGN KEY ("payeeId") REFERENCES "public"."tb_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
