import { eq, ne, and } from "drizzle-orm";
import { review } from "../../db/schema/review.js";
import { database } from "../../db/database.js";
import { order } from "../../db/schema/order.js";
import { service } from "../../db/schema/service.js";
import { successResponse, errorResponse } from "../utils/response.handle.js";

const createReview = async (req, res) => {
  try {
    const user_id = req.loggedInUserId;

    const { service_id, order_id, review_message, rating } = req.body;

    const isMyOwnService = await database.query.service.findFirst({
      where: and(eq(service.user_id, user_id), eq(service.id, service_id)),
    });
    if (isMyOwnService) {
      return errorResponse(
        res,
        "Not Allowed! You can't add a review against your own service.",
        400
      );
    }

    // const isOrderNotCompleted = await database.query.order.findFirst({
    //   where: and(
    //     eq(order.customer_id, user_id),
    //     eq(order.service_id, service_id),
    //     eq(order.order_status, "completed")
    //   ),
    // });
    const isOrderCompleted = await database.query.order.findFirst({
      where: and(
        eq(order.id, order_id),
        eq(order.customer_id, user_id),
        eq(order.service_id, service_id),
        eq(order.order_status, "completed")
      ),
    });
    console.log("order", isOrderCompleted);
    if (!isOrderCompleted) {
      return errorResponse(
        res,
        "Not Allowed! This order is not completed yet.",
        400
      );
    }

    const data = await database
      .insert(review)
      .values({
        reviewer_id: user_id,
        service_id,
        review_message,
        rating,
      })
      .returning();
    return successResponse(res, "Review Created Succesfully!", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const deleteReview = async (req, res) => {
  try {
    const review_id = req.params.review_id;
    const data = await database.query.review.findFirst({
      where: and(
        eq(review.reviewer_id, req.loggedInUsedId, eq(review.id, review_id))
      ),
    });
    if (!data) {
      return errorResponse(res, "No review found.", 400);
    }
    return successResponse(res, "Review Deleted Succesfully!", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export { createReview, deleteReview };
