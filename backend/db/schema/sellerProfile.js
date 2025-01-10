import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./user.js";

const sellerProfile = pgTable("sellerProfile", {
  id: uuid("id").defaultRandom().primaryKey(),
  qualification: text("qualilfication").notNull(),
  experiance: text("experiance"),
  description: text("description"),
  user_id: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

const sellerProfileRelations = relations(sellerProfile, ({ one }) => ({
  user: one(user, {
    fields: [sellerProfile.user_id],
    references: [user.id],
  }),
}));

export { sellerProfile, sellerProfileRelations };
