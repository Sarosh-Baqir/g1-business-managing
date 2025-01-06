import express from "express";
const router = express.Router();
import {
  createMessage,
  getMessages,
} from "../controllers/message.controller.js";
import { authentication } from "../middlewares/auth_middlewares.js";

router.post(
  "/",
  authentication,
  // validationMiddleware(bookOrderValidationSchema, req => req.body),
  createMessage
);

router.get(
  "/:conversation_id",
  authentication,
  // validationMiddleware(bookOrderValidationSchema, req => req.body),
  getMessages
);

export default router;
