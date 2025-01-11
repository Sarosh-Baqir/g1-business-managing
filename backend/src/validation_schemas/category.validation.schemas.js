import { z } from "zod";

const fetchCategorySchema = z.object({
  category_id: z.string().uuid({ message: "id must be a uuid" }).optional(),
});

export default fetchCategorySchema;
