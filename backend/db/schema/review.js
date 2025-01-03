import { pgTable, uuid,text,timestamp,integer } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { service } from "./service.js"
import { user } from "./user.js"


const review = pgTable("reviews", {
    id: uuid("id").defaultRandom().primaryKey(),
    reviewer_id: uuid("reviewer_id").references(() => user.id,{onDelete: 'cascade'}).notNull(),
    service_id: uuid("service_id").references(() => service.id,{onDelete: 'cascade'}),
    review_message: text("review_message"),
    rating: integer('rating').default(5),
    added_at: timestamp("added_at").notNull().defaultNow()
})

const reviewRelations = relations(review, ({ one, many }) => ({
    service: one(service, {
        fields: [review.service_id],
        references: [service.id],
    }),
    reviewer: one(user, {
        fields: [review.reviewer_id],
        references: [user.id],
      }),
}))

export { review,reviewRelations }
