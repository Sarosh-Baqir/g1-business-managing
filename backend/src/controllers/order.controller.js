import { eq, and } from "drizzle-orm";
import { order } from "../../db/schema/order.js";
import { database } from "../../db/database.js";
import { user } from "../../db/schema/user.js";
import role from "../../db/schema/role.js";
import { successResponse, errorResponse } from "../utils/response.handle.js";
import { service } from "../../db/schema/service.js";
import { USER_ROLE } from "../utils/constants.js";

const bookOrder = async (req, res) => {
  try {
    const { order_date, service_id, additional_notes, payment_method } =
      req.body;
    const ismyOwnService = await database.query.service.findFirst({
      where: and(
        eq(service.id, service_id),
        eq(service.user_id, req.loggedInUser)
      ),
    });

    if (ismyOwnService) {
      return errorResponse(
        res,
        "Not Allowed! You can't order your own service.",
        400
      );
    }
    const serviceData = await database.query.service.findFirst({
      where: eq(service.id, service_id),
    });
    if (!serviceData)
      return errorResponse(res, "This service is not available.", 400);
    const serviceProvider = await database.query.user.findFirst({
      where: eq(user.id, serviceData.user_id),
    });
    if (!serviceProvider) {
      return errorResponse(
        res,
        "Not Allowed! Service Provider Account has been deleted or not activated.",
        400
      );
    }
    const loggedInUser = await database.query.user.findFirst({
      where: eq(user.id, req.loggedInUserId),
    });
    if (!loggedInUser.address) {
      return errorResponse(
        res,
        "Not Allowed! You need to complete your profile before booking an order.",
        400
      );
    }
    // try {
    //      await sendEmail("Order Booked Successfully!", `Hello ${loggedInUser.first_name}`, `<h1>Hello ${loggedInUser.first_name} ${loggedInUser.last_name}</h1><p>You have booked a new order with service named as ${serviceData.service_name}. Please go to your orders for further information.</p>`, loggedInUser.email);
    //      await sendEmail("Got New Order!", `Hello ${serviceProvider.first_name}`, `<h1>Hello ${serviceProvider.first_name} ${serviceProvider.last_name}</h1><p>You got a new order with service named as ${serviceData.service_name}. Please go to your orders for further information.</p>`, serviceProvider.email);

    //     const data = await database
    //     .insert(order)
    //     .values({
    //         customer_id:req.loggedInUserId,
    //         service_id,
    //         service_provider_id: serviceProvider.id,
    //         order_date,
    //         order_price: serviceData.price,
    //         customer_address:loggedInUser.address,
    //         additional_notes,
    //         payment_method
    //     })
    //         .returning()

    //         return successResponse(res, "Order Booked Successfully!", {
    //             data,
    //     })
    //   } catch (error) {
    //     return errorResponse(res, `Error in sending email = ${error.message}`, 400);
    //   }

    const data = await database
      .insert(order)
      .values({
        customer_id: req.loggedInUserId,
        service_id,
        service_provider_id: serviceProvider.id,
        order_date,
        order_price: serviceData.price,
        customer_address: loggedInUser.address,
        additional_notes,
        payment_method,
      })
      .returning();

    return successResponse(res, "Order Booked Successfully!", {
      data,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const updateOrder = async (req, res) => {
  try {
    const order_id = req.params.order_id;
    const { order_date, additional_notes } = req.body;

    const isOrder = await database.query.order.findFirst({
      where: and(
        eq(order.customer_id, req.loggedInUserId),
        eq(order.id, order_id)
      ),
    });
    if (!isOrder)
      return errorResponse(
        res,
        "Not Allowed! This order is not available.",
        400
      );

    // Update the Order
    const data = await database
      .update(order)
      .set({
        order_date,
        additional_notes,
      })
      .where(eq(order.id, order_id))
      .returning();

    return successResponse(res, "Order updated successfully!", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order_id = req.params.order_id;
    const { cancellation_reason } = req.body;
    const isOrder = await database.query.order.findFirst({
      where: and(
        eq(order.customer_id, req.loggedInUserId),
        eq(order.id, order_id)
      ),
    });
    if (!isOrder)
      return errorResponse(
        res,
        "Not Allowed! This order is not available.",
        400
      );

    if (
      isOrder.order_status === "cancelled" ||
      isOrder.order_status === "completed"
    ) {
      return errorResponse(
        res,
        "Not Allowed! Because order is already completed or cancelled",
        400
      );
    }
    // Update the Order
    const data = await database
      .update(order)
      .set({
        cancellation_reason,
        order_status: "cancelled",
        payment_status: "failed",
      })
      .where(eq(order.id, order_id))
      .returning();

    return successResponse(res, "Order cancelled successfully!", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const acceptorRejectorCompleteOrder = async (req, res) => {
  try {
    const order_id = req.params.order_id;
    const { order_status } = req.body;
    const isOrder = await database.query.order.findFirst({
      where: and(
        eq(order.service_provider_id, req.loggedInUserId),
        eq(order.id, order_id)
      ),
    });
    if (!isOrder)
      return errorResponse(
        res,
        "Not Allowed! This order is not available or not belongs to you.",
        400
      );

    if (isOrder.order_status === "cancelled" && order_status === "cancelled") {
      return errorResponse(
        res,
        "Not Allowed! Because order is already cancelled.",
        400
      );
    }
    if (isOrder.order_status === "completed" && order_status === "completed") {
      return errorResponse(
        res,
        "Not Allowed! Because order is already completed.",
        400
      );
    }
    if (
      isOrder.order_status === "processing" &&
      order_status === "processing"
    ) {
      return errorResponse(
        res,
        "Not Allowed! Because order is already accepted and in processing.",
        400
      );
    }
    if (isOrder.order_status === "completed" && order_status === "cancelled") {
      return errorResponse(
        res,
        "Not Allowed! Because order is already completed.",
        400
      );
    }
    if (isOrder.order_status === "completed" && order_status === "processing") {
      return errorResponse(
        res,
        "Not Allowed! Because order is already completed.",
        400
      );
    }
    if (order_status === "cancelled") {
      const data = await database
        .update(order)
        .set({
          order_status: order_status,
          payment_status: "failed",
        })
        .where(eq(order.id, order_id))
        .returning();

      return successResponse(res, `Order ${order_status} successfully!`, data);
    }
    if (order_status === "completed") {
      const data = await database
        .update(order)
        .set({
          order_status: order_status,
          payment_status: "paid",
        })
        .where(eq(order.id, order_id))
        .returning();

      return successResponse(res, `Order ${order_status} successfully!`, data);
    }
    const data = await database
      .update(order)
      .set({
        order_status: order_status,
        payment_status: "pending",
      })
      .where(eq(order.id, order_id))
      .returning();

    return successResponse(res, `Order ${order_status} successfully!`, data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getMyOrders = async (req, res) => {
  try {
    const loggedInUser = await database.query.user.findFirst({
      where: eq(user.id, req.loggedInUserId),
    });
    const roleData = await database.query.role.findFirst({
      where: eq(role.id, loggedInUser.role_id),
    });
    console.log(roleData.title);
    if (roleData.title === USER_ROLE.CUSTOMER) {
      const data = await database.query.order.findMany({
        where: eq(order.customer_id, loggedInUser.id),
        with: {
          service: true,
          serviceProvider: true,
        },
      });
      if (data.length <= 0) {
        return errorResponse(
          res,
          "Not Allowed! You have not booked any services yet.",
          400
        );
      }
      return successResponse(
        res,
        `Your booked Orders fetched successfully!`,
        data
      );
    }
    if (roleData.title === USER_ROLE.SERVICE_PROVIDER) {
      const data = await database.query.order.findMany({
        where: eq(order.service_provider_id, loggedInUser.id),
        with: {
          service: true,
          customer: true,
        },
      });
      return successResponse(
        res,
        `Your gain Orders fetched successfully!`,
        data
      );
    }

    return errorResponse(
      res,
      `Not Allowed! You are admin you can't book or gain an order!`,
      400
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export {
  bookOrder,
  updateOrder,
  cancelOrder,
  acceptorRejectorCompleteOrder,
  getMyOrders,
};
