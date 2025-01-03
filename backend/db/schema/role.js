import { pgTable, uuid, varchar, jsonb } from "drizzle-orm/pg-core"

const role = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).unique().notNull(),
  permissions: jsonb("permissions").notNull(),
})

export default role
