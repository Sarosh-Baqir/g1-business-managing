import express from "express";
import { authentication } from "../middlewares/auth_middlewares.js";
import { validationMiddleware } from "../middlewares/validation_schema.js";
import fetchCategorySchema from "../validation_schemas/category.validation.schemas.js";
import {
  fetchSingleCategory,
  fetchAllCategories,
} from "../controllers/category.controller.js";
import serviceRoutes from "./service.routes.js";
const router = express.Router();

router
  .route("/")
  .get(
    // authentication,
    fetchAllCategories
  )
  .patch(authentication, fetchAllCategories)
  .delete(authentication, fetchAllCategories)
  .post(authentication, fetchAllCategories);

router
  .route("/:category_id")
  .get(
    // authentication,
    validationMiddleware(fetchCategorySchema, (req) => req.params),
    fetchSingleCategory
  )
  .patch(
    // authentication,
    validationMiddleware(fetchCategorySchema, (req) => req.params),
    fetchSingleCategory
  )
  .delete(
    authentication,
    validationMiddleware(fetchCategorySchema, (req) => req.params),
    fetchSingleCategory
  )
  .post(
    authentication,
    validationMiddleware(fetchCategorySchema, (req) => req.params),
    fetchSingleCategory
  );

router.use("/:category_id/services", serviceRoutes);

export default router;
