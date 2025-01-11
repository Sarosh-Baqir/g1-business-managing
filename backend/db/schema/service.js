import {
  pgTable,
  uuid,
  varchar,
  boolean,
  text,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./user.js";
import { order } from "./order.js";
import { review } from "./review.js";
import { category } from "./category.js";

const service = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  service_name: varchar("service_name").notNull(),
  description: text("description"),
  user_id: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  category_id: uuid("category_id")
    .notNull()
    .references(() => category.id, { onDelete: "cascade" }),

  price: decimal("price").notNull(),
  is_available: boolean("is_available").default(true),
  cover_photo: varchar("cover_photo", { length: 255 }),
  start_time: varchar("start_time").notNull(),
  end_time: varchar("end_time").notNull(),
  city: varchar("city").notNull(),
});

const serviceRelations = relations(service, ({ one, many }) => ({
  user: one(user, {
    fields: [service.user_id],
    references: [user.id],
  }),
  category: one(category, {
    fields: [service.category_id],
    references: [category.id],
  }),
  orders: many(order),
  reviews: many(review),
}));

export { service, serviceRelations };
