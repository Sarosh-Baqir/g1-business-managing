import { z } from "zod";
import { USER_ROLE } from "../utils/constants.js";

// Admin Validation Schemas for User Management by Admin

// Define validation schema for getting OTP
const adminFetchUsersValidationSchema = z.object({
  id: z.string().uuid({ message: "id must be a uuid" }).optional(),
});
// Define validation schema for Admin Create User
const adminCreateUserValidationSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1)
    .regex(/^[A-Za-z\s]+$/),
  last_name: z
    .string()
    .trim()
    .min(1)
    .regex(/^[A-Za-z\s]+$/),
  email: z.string().trim().min(1).email(),
  phone: z.string().trim().min(11).max(15).regex(/^\d+$/).optional(),
  gender: z.enum(["male", "female", "other"]),
  cnic: z.string().regex(/^\d{5}-\d{7}-\d$/, {
    message: "cnic should be in '12345-1234567-1' format",
  }),
  role_title: z
    .enum([USER_ROLE.ADMIN, USER_ROLE.SERVICE_PROVIDER, USER_ROLE.CUSTOMER])
    .default(USER_ROLE.CUSTOMER),
  is_verified: z.string().default(false),
  is_admin: z.boolean().default(false),
});
// Define Admin Update User End Point
const adminUpdateUserValidationSchema = z.object({
  email: z.string().trim().min(1).email().optional(),
  is_verified: z.boolean().optional(),
  is_verified: z.boolean().optional(),
  role_title: z
    .enum([USER_ROLE.ADMIN, USER_ROLE.SERVICE_PROVIDER, USER_ROLE.CUSTOMER])
    .optional(),
});
// Define validation schema for getting OTP
const adminDeleteUserValidationSchema = z.object({
  user_id: z.string().uuid({ message: "user_id must be a uuid" }),
});

// Admin Validation Schemas for Category Management by Admin

// Define validation schema for getting OTP
const adminFetchCategoryValidationSchema = z.object({
  id: z.string().uuid({ message: "id must be a uuid" }).optional(),
});

const adminCreateCategoryValidationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/^[A-Za-z\s]+$/),
  description: z
    .string()
    .trim()
    .min(1)
    .regex(/^[A-Za-z\s]+$/),
  is_available: z.boolean(),
});

const adminUpdateCategoryValidationSchema = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  description: z.string().trim().min(1).optional(),
  is_available: z.boolean().optional(),
});

const adminDeleteCategoryValidationSchema = z.object({
  category_id: z.string().uuid({ message: "category_id must be a uuid" }),
});

// Services Schemas

const adminFetchServiceValidationSchema = z.object({
  service_id: z
    .string()
    .uuid({ message: "service_id must be a uuid" })
    .optional(),
  city: z
    .string()
    .min(1)
    .regex(/^[A-Za-z\s]+$/, { message: "City must be a string of characters" })
    .optional(),
  category_id: z
    .string()
    .uuid({ message: "category_id must be a uuid" })
    .optional(),
  PLTH: z.boolean().optional(),
  PHTL: z.boolean().optional(),
  user_id: z.string().uuid({ message: "user_id must be a uuid" }).optional(),
});

const adminDeleteServiceValidationSchema = z.object({
  service_id: z.string().uuid({ message: "service_id must be a uuid" }),
});

const adminCreateServiceValidationSchema = z.object({
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
  email: z.string().trim().min(1).email(),
});

const adminUpdateServiceValidationSchema = z.object({
  service_id: z.string().uuid({ message: "service_id must be a uuid" }),
});

// Order Schemas

const adminFetchOrderValidationSchema = z.object({
  order_id: z.string().uuid({ message: "order_id must be a uuid" }).optional(),
  customer_id: z
    .string()
    .uuid({ message: "customer_id must be a uuid" })
    .optional(),
  service_provider_id: z
    .string()
    .uuid({ message: "service_provider_id must be a uuid" })
    .optional(),
  order_status: z
    .enum(["pending", "processing", "completed", "cancelled"])
    .optional(),
  payment_status: z.enum(["paid", "pending", "failed"]).optional(),
});

const adminCancelorDeleteOrderValidationSchema = z.object({
  order_id: z.string().uuid({ message: "order_id must be a uuid" }),
});

export {
  adminFetchUsersValidationSchema,
  adminCreateUserValidationSchema,
  adminUpdateUserValidationSchema,
  adminDeleteUserValidationSchema,
  adminFetchCategoryValidationSchema,
  adminCreateCategoryValidationSchema,
  adminUpdateCategoryValidationSchema,
  adminDeleteCategoryValidationSchema,
  adminDeleteServiceValidationSchema,
  adminCreateServiceValidationSchema,
  adminUpdateServiceValidationSchema,
  adminFetchServiceValidationSchema,
  adminFetchOrderValidationSchema,
  adminCancelorDeleteOrderValidationSchema,
};
