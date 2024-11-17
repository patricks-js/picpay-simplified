CREATE TYPE "public"."user_role" AS ENUM('customer', 'merchant');--> statement-breakpoint
ALTER TABLE "tb_users" ADD COLUMN "role" "user_role" NOT NULL;--> statement-breakpoint
ALTER TABLE "tb_users" ADD COLUMN "balance" numeric(14, 2) DEFAULT '0.00' NOT NULL;