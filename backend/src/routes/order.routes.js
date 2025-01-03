import express from "express";
const router = express.Router({ mergeParams: true });
import {
  authentication,
  authorization,
} from "../middlewares/auth_middlewares.js";
import {
  bookOrder,
  updateOrder,
  cancelOrder,
  acceptorRejectorCompleteOrder,
  getMyOrders,
} from "../controllers/order.controller.js";
import { USER_ROLE } from "../utils/constants.js";
import {
  bookOrderValidationSchema,
  updateOrderValidationSchema,
  cancelOrderValidationSchema,
  serviceProviderAcceptorCancelorDeleteOrderValidationSchema,
} from "../validation_schemas/order.validation.schemas.js";
import { validationMiddleware } from "../middlewares/validation_schema.js";

router.get("/", authentication, getMyOrders);
router.post(
  "/",
  authentication,
  validationMiddleware(bookOrderValidationSchema, (req) => req.body),
  bookOrder
);
router.patch(
  "/update/:order_id",
  authentication,
  validationMiddleware(updateOrderValidationSchema, (req) => req.body),
  updateOrder
);
router.patch(
  "/cancel/:order_id",
  authentication,
  validationMiddleware(cancelOrderValidationSchema, (req) => req.params),
  cancelOrder
);

router.patch(
  "/service-provider/:order_id",
  authentication,
  authorization(USER_ROLE.SERVICE_PROVIDER),
  validationMiddleware(
    serviceProviderAcceptorCancelorDeleteOrderValidationSchema,
    (req) => req.body
  ),
  acceptorRejectorCompleteOrder
);

export default router;
