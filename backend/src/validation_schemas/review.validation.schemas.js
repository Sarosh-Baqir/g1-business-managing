import { z } from "zod";

const deleteReviewSchema = z.object({
  review_id: z.string().uuid({ message: "review_id" }).optional(),
});

const createReviewSchema = z.object({
  service_id: z.string().uuid({ message: "service_id must be a uuid" }),
  review_message: z.string().min(1).max(1000),
  rating: z.number().int().min(1).max(5),
});

export { deleteReviewSchema, createReviewSchema };
