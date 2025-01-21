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
  bidding_amount: z.number().optional(),
  payment_method: z.enum(["jazzcash", "easypaisa", "cod"]).optional(),
  order_completion_date: z.custom((value) => {
    const currentDate = new Date();
    const selectedDate = new Date(value);

    if (isNaN(selectedDate.getTime())) {
      throw new Error("Invalid date");
    }

    if (selectedDate <= currentDate) {
      throw new Error(
        "Order completion date must be greater than today's date"
      );
    }

    return value;
  }),
  is_offer: z.boolean(),
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
const updateOrderPriceValidationSchema = z.object({
  order_price: z.number({ message: "order price must be a number" }),
});

const cancelOrderValidationSchema = z.object({
  order_id: z.string().uuid({ message: "order_id must be a uuid" }),
});

const serviceProviderAcceptorCancelorDeleteOrderValidationSchema = z.object({
  order_status: z
    .enum(["pending", "processing", "completed", "cancelled"])
    .optional(),
  payment_method: z.enum(["jazzcash", "easypaisa", "cod"]).optional(),
  is_offer: z.boolean(),
});

export {
  bookOrderValidationSchema,
  updateOrderValidationSchema,
  cancelOrderValidationSchema,
  serviceProviderAcceptorCancelorDeleteOrderValidationSchema,
  updateOrderPriceValidationSchema,
};
