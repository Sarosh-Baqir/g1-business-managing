import express from "express";
const router = express.Router();
import { authentication } from "../middlewares/auth_middlewares.js";
import {
  createReview,
  deleteReview,
} from "../controllers/review.controller.js";
import {
  createReviewSchema,
  deleteReviewSchema,
} from "../validation_schemas/review.validation.schemas.js";
import { validationMiddleware } from "../middlewares/validation_schema.js";

router.post(
  "/",
  authentication,
  validationMiddleware(createReviewSchema, (req) => req.body),
  createReview
);
router.delete(
  "/:review_id",
  authentication,
  validationMiddleware(deleteReviewSchema, (req) => req.params),
  deleteReview
);

export default router;
