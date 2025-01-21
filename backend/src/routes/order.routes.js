import express from "express";
const router = express.Router({ mergeParams: true });
import {
  authentication,
  authorization,
} from "../middlewares/auth_middlewares.js";
import {
  bookOrder,
  updateOrder,
  updateOrderPrice,
  cancelOrder,
  acceptorRejectorCompleteOrder,
  getMyOrders,
  getOrderDetail,
} from "../controllers/order.controller.js";
import { USER_ROLE } from "../utils/constants.js";
import {
  bookOrderValidationSchema,
  updateOrderValidationSchema,
  cancelOrderValidationSchema,
  serviceProviderAcceptorCancelorDeleteOrderValidationSchema,
  updateOrderPriceValidationSchema,
} from "../validation_schemas/order.validation.schemas.js";
import { validationMiddleware } from "../middlewares/validation_schema.js";

router.get("/", authentication, getMyOrders);
router.get("/:order_id", authentication, getOrderDetail);
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
  "/updatePrice/:order_id",
  authentication,
  validationMiddleware(updateOrderPriceValidationSchema, (req) => req.body),
  updateOrderPrice
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
