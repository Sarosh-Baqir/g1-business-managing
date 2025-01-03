import { eq } from "drizzle-orm";
import { database } from "../../db/database.js";
import { supportTicket } from "../../db/schema/supportTicket.js";
import { user } from "../../db/schema/user.js";

import { successResponse, errorResponse } from "../utils/response.handle.js";

// create a ticket
const createSupportTicket = async (req, res) => {
  const { issue_detail } = req.body;
  const user_id = req.loggedInUserId;
  try {
    const User = await database.query.user.findFirst({
      where: eq(user.is_admin, true),
    });
    console.log("admin: ", User);

    const data = await database
      .insert(supportTicket)
      .values({
        issue_detail,
        user_id,
        assigned_admin: User.id,
      })
      .returning();

    return successResponse(res, "Ticket Created Successfully!", {
      data,
    });
  } catch (error) {
    return errorResponse(
      res,
      `Error in creating ticket = ${error.message}`,
      400
    );
  }
};

const adminChangeTicketStatus = async (req, res) => {
  const { ticket_status } = req.body;
  const user_id = req.loggedInUserId;
  try {
    const User = await database.query.supportTicket.findFirst({
      where: eq(supportTicket.assigned_admin, user_id),
    });
    if (!User) {
      return errorResponse(res, "you are not eligible for this action.", 404);
    }
    const data = await database
      .update(supportTicket)
      .set({ ticket_status })
      .where(eq(supportTicket.assigned_admin, user_id))
      .returning();

    return successResponse(res, "Status changed Successfully!", {
      data,
    });
  } catch (error) {
    return errorResponse(
      res,
      `Error in changing status = ${error.message}`,
      400
    );
  }
};

export { createSupportTicket, adminChangeTicketStatus };
