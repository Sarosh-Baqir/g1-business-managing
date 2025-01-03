import { pgTable, uuid, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./user.js";

const wallet = pgTable("wallet", {
  id: uuid("id").defaultRandom().primaryKey(),
  balance: numeric("balance", { precision: 15, scale: 2 }).default(0),
  user_id: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

const walletRelations = relations(wallet, ({ one }) => ({
  user: one(user, {
    fields: [wallet.user_id],
    references: [user.id],
  }),
}));

export { wallet, walletRelations };
