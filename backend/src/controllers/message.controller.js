import message from "../../db/schema/message.js";
import { eq, or, and, asc, desc } from "drizzle-orm";
import conversation from "../../db/schema/conversation.js";
import { user } from "../../db/schema/user.js";
import { database } from "../../db/database.js";
import { successResponse, errorResponse } from "../utils/response.handle.js";
import { inArray, arrayContains } from "drizzle-orm";

const createMessage = async (req, res) => {
  try {
    const { conversation_id, text } = req.body;
    console.log("Ahsan2", conversation_id, text);
    const data = await database
      .insert(message)
      .values({
        conversation_id,
        sender_id: req.loggedInUserId,
        text,
      })
      .returning();
    console.log("Ahsan3");
    console.log(data);
    return successResponse(res, "Message created successfully!", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getMessages = async (req, res) => {
  try {
    const conversation_id = req.params.conversation_id;
    console.log(conversation_id);
    const messages = await database.query.message.findMany({
      where: eq(message.conversation_id, conversation_id),
    });
    if (messages.length <= 0) {
      return successResponse(
        res,
        "No messages against this conversation_id!",
        messages
      );
    }
    return successResponse(
      res,
      "Messages found against this conversation_id!",
      messages
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export { createMessage, getMessages };
