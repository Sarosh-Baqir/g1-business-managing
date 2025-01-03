import { z } from "zod";

const createSupportTicketSchema = z.object({
  issue_detail: z.string().min(1).max(1000),
});

const adminChangeTicketStatusSchema = z.object({
  ticket_status: z.enum(["open", "in-progress", "resolved"]),
});

export { createSupportTicketSchema, adminChangeTicketStatusSchema };
