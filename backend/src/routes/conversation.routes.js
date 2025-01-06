import express from "express";
const router = express.Router();
import {
  createConversation,
  getConversation,
} from "../controllers/conversation.controller.js";
import { authentication } from "../middlewares/auth_middlewares.js";

router.post(
  "/",
  authentication,
  // validationMiddleware(bookOrderValidationSchema, req => req.body),
  createConversation
);

router.get(
  "/",
  authentication,
  // validationMiddleware(bookOrderValidationSchema, req => req.body),
  getConversation
);

export default router;
