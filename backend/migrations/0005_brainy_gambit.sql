ALTER TABLE "seller_profile" RENAME TO "sellerProfile";--> statement-breakpoint
ALTER TABLE "sellerProfile" DROP CONSTRAINT "seller_profile_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "order_price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "bidding_amount" numeric;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sellerProfile" ADD CONSTRAINT "sellerProfile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
