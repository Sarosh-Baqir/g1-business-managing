import { pgTable, uuid, varchar, boolean, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { service } from "./service.js";

const category = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey().notNull().unique(),
  title: varchar("title").notNull().unique(),
  description: text("description"),
  is_available: boolean("is_available").default(false),
});
const categoryRelations = relations(category, ({ one, many }) => ({
  services: many(service),
}));

export { category, categoryRelations };
