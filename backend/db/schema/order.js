import {
  pgTable,
  uuid,
  timestamp,
  decimal,
  text,
  json,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { user } from "./user.js";
import { service } from "./service.js";

const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "completed",
  "cancelled",
]);
const paymentStatusEnum = pgEnum("payment_status", [
  "paid",
  "pending",
  "failed",
]);
const paymentMethodEnum = pgEnum("payment_method", [
  "jazzcash",
  "easypaisa",
  "cod",
]);

const order = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  customer_id: uuid("customer_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  service_id: uuid("service_id")
    .references(() => service.id, { onDelete: "cascade" })
    .notNull(),
  service_provider_id: uuid("service_provider_id")
    .references(() => user.id)
    .notNull(),
  placed_at: timestamp("placed_date").notNull().defaultNow(),
  order_date: timestamp("order_date", { mode: "string" }).notNull(),
  order_status: orderStatusEnum("order_status").default("pending").notNull(),
  order_price: decimal("order_price").notNull(),
  payment_status: paymentStatusEnum("payment_status")
    .default("pending")
    .notNull(),
  payment_method: paymentMethodEnum("payment_method").default("cod").notNull(),
  customer_address: json("customer_address").notNull(),
  additional_notes: text("additional_notes"),
  order_completion_date: timestamp("order_completion_date"),
  cancellation_reason: text("cancellation_reason"),
});

const orderRelations = relations(order, ({ one, many }) => ({
  customer: one(user, {
    fields: [order.customer_id],
    references: [user.id],
  }),
  serviceProvider: one(user, {
    fields: [order.service_provider_id],
    references: [user.id],
  }),
  service: one(service, {
    fields: [order.service_id],
    references: [service.id],
  }),
}));

export {
  order,
  orderRelations,
  orderStatusEnum,
  paymentStatusEnum,
  paymentMethodEnum,
};
