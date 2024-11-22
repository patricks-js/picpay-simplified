CREATE TYPE "public"."user_role" AS ENUM('customer', 'merchant');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tb_users" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"surname" text NOT NULL,
	"email" text NOT NULL,
	"document" text NOT NULL,
	"passwordHash" text NOT NULL,
	"type" "user_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tb_users_email_unique" UNIQUE("email"),
	CONSTRAINT "tb_users_document_unique" UNIQUE("document")
);
