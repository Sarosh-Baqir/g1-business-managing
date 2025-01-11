import { z } from "zod";

const fetchServiceSchema = z.object({
  category_id: z.string().uuid({ message: "id must be a uuid" }).optional(),
  service_id: z.string().uuid({ message: "id must be a uuid" }).optional(),
});

const createServiceSchema = z.object({
  service_name: z
    .string()
    .trim()
    .min(1)
    .regex(/^[A-Za-z\s]+$/),
  description: z.string().min(1).max(1000),
  category_id: z.string().uuid({ message: "category_id must be a uuid" }),
  price: z.number().positive(),
  is_available: z.boolean(),
  start_time: z.string().min(1),
  end_time: z.string().min(1),
});

const updateServiceSchema = z.object({
  service_name: z
    .string()
    .trim()
    .min(1)
    .regex(/^[A-Za-z\s]+$/)
    .optional(),
  description: z.string().min(1).max(1000).optional(),
  price: z.number().positive().optional(),
  is_available: z.boolean().optional(),
  start_time: z.string().min(1).optional(),
  end_time: z.string().min(1).optional(),
});

export { fetchServiceSchema, createServiceSchema, updateServiceSchema };
