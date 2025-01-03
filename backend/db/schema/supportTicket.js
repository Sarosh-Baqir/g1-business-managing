import { pgTable, uuid, text, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./user.js";

const ticketStatusEnum = pgEnum("ticket_status", [
  "open",
  "in-progress",
  "resolved",
]);

const supportTicket = pgTable("supportTicket", {
  id: uuid("id").defaultRandom().primaryKey(),
  issue_detail: text("issue_detail"),
  ticket_status: ticketStatusEnum("ticket_status").default("open").notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  assigned_admin: uuid("assigned_admin").references(() => user.id, {
    onDelete: "cascade",
  }),
});

const supportTicketRelations = relations(supportTicket, ({ one, many }) => ({
  user: one(user, {
    fields: [supportTicket.user_id],
    references: [user.id],
  }),
  user: one(user, {
    fields: [supportTicket.assigned_admin],
    references: [user.id],
  }),
}));

export { supportTicket, supportTicketRelations, ticketStatusEnum };
