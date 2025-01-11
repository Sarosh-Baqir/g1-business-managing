import express from "express";
import {
  adminFetchUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  adminFetchCategory,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminFetchServices,
  adminUpdateService,
  adminDeleteService,
  adminCreateService,
  adminFetchOrders,
  adminCancelOrder,
  adminDeleteOrder,
} from "../controllers/admin.controller.js";
import { validationMiddleware } from "../middlewares/validation_schema.js";
import {
  adminFetchUsersValidationSchema,
  adminCreateUserValidationSchema,
  adminUpdateUserValidationSchema,
  adminDeleteUserValidationSchema,
  adminFetchCategoryValidationSchema,
  adminCreateCategoryValidationSchema,
  adminUpdateCategoryValidationSchema,
  adminDeleteCategoryValidationSchema,
  adminCreateServiceValidationSchema,
  adminUpdateServiceValidationSchema,
  adminDeleteServiceValidationSchema,
  adminFetchServiceValidationSchema,
  adminFetchOrderValidationSchema,
  adminCancelorDeleteOrderValidationSchema,
} from "../validation_schemas/admin.validation.schemas.js";
import {
  authentication,
  authorization,
  checkUserAlreadyRegistered,
} from "../middlewares/auth_middlewares.js";
import { USER_ROLE } from "../utils/constants.js";

const router = express.Router();

// Admin Routes for User Management

router.get(
  "/user",
  authentication,
  authorization(USER_ROLE.ADMIN),
  adminFetchUsers
);

router.get(
  "/user/:user_id",
  authentication,
  authorization(USER_ROLE.ADMIN),
  validationMiddleware(adminFetchUsersValidationSchema, (req) => req.params),
  adminFetchUsers
);

router.post(
  "/user",
  authentication,
  authorization(USER_ROLE.ADMIN),
  validationMiddleware(adminCreateUserValidationSchema, (req) => req.body),
  checkUserAlreadyRegistered,
  adminCreateUser
);
router.patch(
  "/user/:user_id",
  authentication,
  authorization(USER_ROLE.ADMIN),
  validationMiddleware(adminUpdateUserValidationSchema, (req) => req.body),
  adminUpdateUser
);
router.delete(
  "/user/:user_id",
  authentication,
  authorization(USER_ROLE.ADMIN),
  validationMiddleware(adminDeleteUserValidationSchema, (req) => req.params),
  adminDeleteUser
);

// Admin routes for Category Management

router.post(
  "/category",
  authentication,
  authorization(USER_ROLE.ADMIN),
  validationMiddleware(adminCreateCategoryValidationSchema, (req) => req.body),
  adminCreateCategory
);
router.get(
  "/category",
  authentication,
  authorization(USER_ROLE.ADMIN),
  adminFetchCategory
);
router.get(
  "/category/:category_id",
  authentication,
  authorization(USER_ROLE.ADMIN),
  validationMiddleware(adminFetchCategoryValidationSchema, (req) => req.params),
  adminFetchCategory
);
router.patch(
  "/category/:category_id",
  authentication,
  authorization(USER_ROLE.ADMIN),
  validationMiddleware(adminUpdateCategoryValidationSchema, (req) => req.body),
  adminUpdateCategory
);
router.delete(
  "/category/:category_id",
  authentication,
  authorization(USER_ROLE.ADMIN),
  validationMiddleware(
    adminDeleteCategoryValidationSchema,
    (req) => req.params
  ),
  adminDeleteCategory
);

// Admin Routes for Services Management

router.get(
  "/services",
  authentication,
  authorization(USER_ROLE.ADMIN),
  // validationMiddleware(adminFetchServiceValidationSchema, req => req.query),
  adminFetchServices
);

router.post(
  "/services",
  authentication,
  authorization(USER_ROLE.ADMIN),
  validationMiddleware(adminCreateServiceValidationSchema, (req) => req.body),
  adminCreateService
);

router.patch(
  "/services/:service_id",
  authentication,
  authorization(USER_ROLE.ADMIN),
  validationMiddleware(adminUpdateServiceValidationSchema, (req) => req.params),
  adminUpdateService
);

router.delete(
  "/services/:service_id",
  authentication,
  authorization(USER_ROLE.ADMIN),
  validationMiddleware(adminDeleteServiceValidationSchema, (req) => req.params),
  adminDeleteService
);

// Admin Routes for Orders Management

router.get(
  "/order",
  authentication,
  authorization(USER_ROLE.ADMIN),
  validationMiddleware(adminFetchOrderValidationSchema, (req) => req.query),
  adminFetchOrders
);

router.patch(
  "/order/:order_id",
  authentication,
  authorization(USER_ROLE.ADMIN),
  validationMiddleware(
    adminCancelorDeleteOrderValidationSchema,
    (req) => req.params
  ),
  adminCancelOrder
);

router.delete(
  "/order/:order_id",
  authentication,
  authorization(USER_ROLE.ADMIN),
  validationMiddleware(
    adminCancelorDeleteOrderValidationSchema,
    (req) => req.params
  ),
  adminDeleteOrder
);

//  Admin Routes for Review Management

export default router;
