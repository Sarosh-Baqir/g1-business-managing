import { eq, or, and, asc, desc } from "drizzle-orm";
import conversation from "../../db/schema/conversation.js";
import { user } from "../../db/schema/user.js";
import message from "../../db/schema/message.js";
import { database } from "../../db/database.js";
import { successResponse, errorResponse } from "../utils/response.handle.js";
import { inArray, arrayContains } from "drizzle-orm";

// Create new conversation
const createConversation = async (req, res) => {
  try {
    const sender_id = req.loggedInUserId;
    const { receiver_id } = req.body;
    const isReceiver = await database.query.user.findFirst({
      where: eq(user.id, receiver_id),
    });
    if (!isReceiver) {
      return errorResponse(res, "No data Found against this receiver_id", 400);
    }
    const memberArray = [sender_id, receiver_id];
    const existingConversation = await database.query.conversation.findFirst({
      where: eq(conversation.members, memberArray),
    });
    if (existingConversation) {
      return errorResponse(
        res,
        "Conversation between these users already available",
        400
      );
    }
    const data = await database
      .insert(conversation)
      .values({
        members: memberArray,
      })
      .returning();
    return successResponse(res, "Conversation created succesfully!", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// // Get conversations of a user
// const getConversation = async (req, res) => {
//   try {
//     const conversations = await database
//       .select()
//       .from(conversation)
//       .where(arrayContains(conversation.members, [req.loggedInUserId]));
//     // console.log(conversations.members.)
//     if (conversations.length <= 0) {
//       return successResponse(
//         res,
//         "No conversations found against this user",
//         conversations
//       );
//     }
//     return successResponse(res, "Conversations list found!", conversations);
//   } catch (error) {
//     return errorResponse(res, error.message, 500);
//   }
// };

// Get conversations of a user
const getConversation = async (req, res) => {
  try {
    const loggedInUserId = req.loggedInUserId;

    // Fetch conversations where the logged-in user is a member
    const conversations = await database
      .select()
      .from(conversation)
      .where(arrayContains(conversation.members, [req.loggedInUserId]));
    //console.log("conversations: ", conversations);
    if (conversations.length === 0) {
      return successResponse(res, "No conversations found for this user", []);
    }

    // Map through each conversation to fetch messages and other user details
    const enrichedConversations = await Promise.all(
      conversations.map(async (conv) => {
        // Fetch messages for this conversation
        const messages = await database
          .select()
          .from(message)
          .where(eq(message.conversation_id, conv.id))
          .orderBy(message.timestamp);

        // Find the other user's ID
        const otherUserId = conv.members.find(
          (memberId) => memberId !== loggedInUserId
        );

        // Fetch details of the other user
        // const otherUser = await database
        //   .select()
        //   .from(user)
        //   .where(eq(user.id, otherUserId));
        const otherUser = await database.query.user.findFirst({
          where: eq(user.id, otherUserId),
        });
        console.log("other user: ", otherUser);

        return {
          id: conv.id,
          members: conv.members,
          created_at: conv.timestamp,
          messages: messages.map((msg) => ({
            id: msg.id,
            conversation_id: msg.conversation_id,
            sender_id: msg.sender_id,
            text: msg.text,
            created_at: msg.timestamp,
          })),
          otherUser: {
            id: otherUser.id,
            email: otherUser.email,
            phone: otherUser.phone,
            first_name: otherUser.first_name,
            last_name: otherUser.last_name,
            gender: otherUser.gender,
            profile_picture: otherUser.profile_picture,
            otp: otherUser.otp,
            cnic: otherUser.cnic,
            address: otherUser.address,
            is_admin: otherUser.is_admin,
            is_verified: otherUser.is_verified,
            role_id: otherUser.role_id,
            driving_license_details: otherUser.driving_license_details,
            profile_completion: otherUser.is_complete ? "100.00" : "Incomplete",
            created_at: otherUser.created_at,
            updated_at: otherUser.updated_at,
          },
        };
      })
    );

    return successResponse(
      res,
      "Conversations list found!",
      enrichedConversations
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export { createConversation, getConversation };
