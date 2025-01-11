CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"is_available" boolean DEFAULT false,
	CONSTRAINT "categories_id_unique" UNIQUE("id"),
	CONSTRAINT "categories_title_unique" UNIQUE("title")
);
