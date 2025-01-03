import { pgEnum, pgTable, uuid, varchar, boolean,json,text } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import role from "./role.js"
import { address } from "./address.js"
import { service } from "./service.js"
import { order } from "./order.js"
import { review } from "./review.js"


const genderEnum = pgEnum("gender", ["male", "female", "other"])

const user = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  first_name: varchar("first_name"),
  last_name: varchar("last_name"),
  phone: varchar("phone", { length: 255 }).notNull(),
  gender: genderEnum("gender"),
  profile_picture: varchar("profile_picture", { length: 255 }),
  otp: varchar("otp", { length: 6 }),
  cnic: varchar("cnic", { length: 15 }),
  role_id: uuid("role_id").references(() => role.id),
  is_verified: boolean("is_verified").default(false),
  is_admin: boolean("is_admin").default(false),
  address: json("address"),
  bio: text("bio"),
  is_complete: boolean("is_complete").default(false),
})

const userRelations = relations(user, ({ one, many }) => ({
  role: one(role),
  address: many(address),
  services: many(service),
  orders: many(order),  reviews: many(review)
}))

export { user, genderEnum, userRelations }
