import { pgTable, uuid, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";

const conversation = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  members: jsonb("members").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export default conversation;
