import { z } from "zod";

const bookOrderValidationSchema = z.object({
  order_date: z.custom((value) => {
    const currentDate = new Date();
    const selectedDate = new Date(value);

    if (isNaN(selectedDate.getTime())) {
      throw new Error("Invalid date");
    }

    if (selectedDate <= currentDate) {
      throw new Error("Order date must be greater than today's date");
    }

    return value;
  }),
  service_id: z.string().uuid({ message: "service_id must be a uuid" }),
  additional_notes: z.string().optional(),
  payment_method: z.enum(["jazzcash", "easypaisa", "cod"]),
});
const updateOrderValidationSchema = z.object({
  order_date: z
    .custom((value) => {
      const currentDate = new Date();
      const selectedDate = new Date(value);

      if (isNaN(selectedDate.getTime())) {
        throw new Error("Invalid date");
      }

      if (selectedDate <= currentDate) {
        throw new Error("Order date must be greater than today's date");
      }

      return value;
    })
    .optional(),
  additional_notes: z.string().optional(),
});

const cancelOrderValidationSchema = z.object({
  order_id: z.string().uuid({ message: "order_id must be a uuid" }),
});

const serviceProviderAcceptorCancelorDeleteOrderValidationSchema = z.object({
  order_status: z
    .enum(["pending", "processing", "completed", "cancelled"])
    .optional(),
});

export {
  bookOrderValidationSchema,
  updateOrderValidationSchema,
  cancelOrderValidationSchema,
  serviceProviderAcceptorCancelorDeleteOrderValidationSchema,
};
