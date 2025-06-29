CREATE TYPE "public"."contact_type" AS ENUM('phone', 'email');--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contacts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" "contact_type" NOT NULL,
	"description" varchar(255) NOT NULL,
	"person_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "persons" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "persons_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"cpf" varchar(14) NOT NULL,
	CONSTRAINT "persons_cpf_unique" UNIQUE("cpf")
);
--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;