import { pgTable, integer, uuid, varchar } from "drizzle-orm/pg-core"
import { user, userRelations } from "./user.js";
import { relations } from "drizzle-orm"
const address = pgTable("addresses", {
    id: uuid("id").defaultRandom().primaryKey(),
    street_no: integer("street_no",).notNull(),
    city: varchar("city", { length: 32 }).notNull(),
    state: varchar("state", { length: 32 }).notNull(),
    postal_code: varchar("postal_code", { length: 32 }).notNull(),
    country: varchar("country", { length: 32 }).notNull(),
    location: varchar("location", { length: 255 }),
    user_id: uuid('user_id').notNull().references(()=>user.id),
})

const addressRelations = relations(address, ({ one }) => ({
    user: one(user, {
      fields: [address.user_id],
      references: [user.id],
    }),
  }));

export {address, addressRelations}
