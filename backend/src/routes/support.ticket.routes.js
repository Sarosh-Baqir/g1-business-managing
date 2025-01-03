import express from "express";
const router = express.Router();
import { authentication } from "../middlewares/auth_middlewares.js";
import {
  createSupportTicket,
  adminChangeTicketStatus,
} from "../controllers/support.ticket.controller.js";
import {
  createSupportTicketSchema,
  adminChangeTicketStatusSchema,
} from "../validation_schemas/support.ticket.validation.schemas.js";
import { validationMiddleware } from "../middlewares/validation_schema.js";

router.post(
  "/",
  authentication,
  validationMiddleware(createSupportTicketSchema, (req) => req.body),
  createSupportTicket
);

router.post(
  "/change-ticket-status",
  authentication,
  validationMiddleware(adminChangeTicketStatusSchema, (req) => req.body),
  adminChangeTicketStatus
);

export default router;
