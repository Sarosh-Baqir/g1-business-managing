import bcrypt from "bcrypt";
import { eq, and, desc, asc } from "drizzle-orm";
import { database } from "../../db/database.js";
import { user } from "../../db/schema/user.js";
import { category } from "../../db/schema/category.js";
import { service } from "../../db/schema/service.js";
import role from "../../db/schema/role.js";
import { order } from "../../db/schema/order.js";
import { generateRandomPassword } from "../utils/helper.js";
import { successResponse, errorResponse } from "../utils/response.handle.js";
import { getOrCreateRole } from "../../db/customqueries/queries.js";
import sendEmail from "../utils/sendEmail.js";

// Services Controllers

// Admin will Fetch services through this controller
const adminFetchUsers = async (req, res) => {
  try {
    const id = req.params.user_id;

    if (id) {
      const specificUser = await database
        .select()
        .from(user)
        .where(eq(user.id, id))
        .leftJoin(role, eq(role.id, user.role_id));

      if (!specificUser) {
        return errorResponse(res, "User not found", 404);
      }

      return successResponse(res, "User Found", specificUser);
    }

    const users = await database
      .select()
      .from(user)
      .leftJoin(role, eq(user.role_id, role.id));

    return successResponse(res, "Successfully fetched Users List", users);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Admin will create a user
const adminCreateUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      gender,
      cnic,
      role_title,
      is_verified,
      is_admin,
    } = req.body;

    const roleDetail = await getOrCreateRole(role_title);

    // Generate a random password
    const password = generateRandomPassword();

    const hashedPassword = await bcrypt.hash(password, 10);
    // try {
    //   await sendEmail("Account Registration", `Hello ${data.first_name}`, `<h1>Hello ${data.first_name} ${data.last_name}</h1><p>Thank you for registering with us!</p><p>Your can login now using email: <strong>${data.email}</strong> and password: <strong>${password}</strong>.</p>`, data.email);
    //   const data = await database
    //   .insert(user)
    //   .values({
    //     first_name,
    //     last_name,
    //     email,
    //     phone,
    //     password: hashedPassword,
    //     is_verified,
    //     cnic,
    //     role_id: roleDetail[0].id,
    //     is_admin
    //   })
    //   .returning()

    // return successResponse(res, "User is created successfully!", data)
    // } catch (error) {
    //   return errorResponse(res, `Error in sending email = ${error.message}`, 400)
    // }
    const data = await database
      .insert(user)
      .values({
        first_name,
        last_name,
        email,
        phone,
        password: hashedPassword,
        is_verified,
        cnic,
        gender,
        role_id: roleDetail[0].id,
        is_admin,
      })
      .returning();

    return successResponse(res, "User is created successfully!", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

//Admin will Update any User by providing UserId
const adminUpdateUser = async (req, res) => {
  try {
    const id = req.params.user_id;
    const { email, is_verified, role_title, is_admin } = req.body;
    let roleDetail;
    if (id === req.loggedInUserId)
      return errorResponse(
        res,
        "You cannot Update Yourself from this URL",
        400
      );
    if (role_title) {
      roleDetail = await getOrCreateRole(role_title);
    }

    const updatedUser = await database
      .update(user)
      .set({
        email,
        is_verified,
        role_id: roleDetail[0].id,
        is_admin,
      })
      .where(eq(user.id, id))
      .returning();
    return successResponse(res, "User is Updated!", updatedUser);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Admin will Delete any any user buy providing User Id
const adminDeleteUser = async (req, res) => {
  try {
    const id = req.params.user_id;
    if (id === req.loggedInUserId)
      return errorResponse(res, "You cannot Delete Yourself", 400);

    const data = await database.query.user.findFirst({
      where: eq(user.id, id),
    });
    if (!data) {
      return errorResponse(res, "User not Found", 404);
    }
    const deletedUser = await database
      .delete(user)
      .where(eq(user.id, id))
      .returning();

    return successResponse(res, "User deleted successfully", deletedUser);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Admin Category Management Controllers

// Create a new category

const adminFetchCategory = async (req, res) => {
  try {
    const id = req.params.category_id;

    if (id) {
      const specificCategory = await database.query.category.findFirst({
        where: eq(category.id, id),
      });

      if (!specificCategory) {
        return errorResponse(res, "Category not found", 404);
      }

      return successResponse(res, "Category Found", specificCategory);
    }

    const categories = await database.query.category.findMany();

    return successResponse(
      res,
      "Successfully fetched Categories List",
      categories
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Admin will create a user
const adminCreateCategory = async (req, res) => {
  console.log("in create category controller");
  try {
    const { title, description, is_available } = req.body;
    const data = await database
      .insert(category)
      .values({
        title,
        description,
        is_available,
      })
      .returning();

    return successResponse(res, "Category is created successfully!", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

//Admin will Update any User by providing UserId
const adminUpdateCategory = async (req, res) => {
  try {
    const id = req.params.category_id;
    const { title, description, is_available } = req.body;

    const updatedCategory = await database
      .update(category)
      .set({
        title,
        description,
        is_available,
      })
      .where(eq(category.id, id))
      .returning();
    return successResponse(res, "User is Updated!", updatedCategory);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Admin will Delete any any user buy providing User Id
const adminDeleteCategory = async (req, res) => {
  try {
    const id = req.params.category_id;

    const data = await database.query.category.findFirst({
      where: eq(category.id, id),
    });
    if (!data) {
      return errorResponse(res, "Category not Found", 404);
    }
    const deletedCategory = await database
      .delete(category)
      .where(eq(category.id, id))
      .returning();

    return successResponse(
      res,
      "Category deleted successfully",
      deletedCategory
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Services Controllers

// Admin will Fetch services through this controller
const adminFetchServices = async (req, res) => {
  try {
    let { city, category_id, PLTH, PHTL, email } = req.query;

    if (category_id && !city) {
      if (PLTH) {
        const services = await database.query.service.findMany({
          where: eq(service.category_id, category_id),
          with: {
            user: {
              columns: {
                first_name: true,
                last_name: true,
                profile_picture: true,
              },
            },
          },
          orderBy: asc(service.price),
        });
        if (services.length <= 0) {
          return successResponse(
            res,
            "No Services registered with this CATEGORY",
            services
          );
        }

        return successResponse(
          res,
          "Successfully fetched Services List against this category",
          services
        );
      }
      if (PHTL) {
        {
          const services = await database.query.service.findMany({
            where: eq(service.category_id, category_id),
            with: {
              user: {
                columns: {
                  first_name: true,
                  last_name: true,
                  profile_picture: true,
                },
              },
            },
            orderBy: desc(service.price),
          });

          if (services.length <= 0) {
            return successResponse(
              res,
              "No Services registered with this category",
              services
            );
          }

          return successResponse(
            res,
            "Successfully fetched Services List against this category",
            services
          );
        }
      }

      const services = await database.query.service.findMany({
        where: eq(service.category_id, category_id),
        with: {
          user: {
            columns: {
              first_name: true,
              last_name: true,
              profile_picture: true,
            },
          },
        },
      });
      if (services.length <= 0) {
        return successResponse(
          res,
          "No Services registered aginst this category",
          services
        );
      }

      return successResponse(
        res,
        "Successfully fetched Services List against this category",
        services
      );
    }

    if (!category_id && city) {
      if (PLTH) {
        const services = await database.query.service.findMany({
          where: eq(service.city, city),
          with: {
            user: {
              columns: {
                first_name: true,
                last_name: true,
                profile_picture: true,
              },
            },
          },
          orderBy: asc(service.price),
        });

        if (services.length <= 0) {
          return successResponse(
            res,
            "No Services registered with this city",
            services
          );
        }

        return successResponse(
          res,
          "Successfully fetched Services List against this category",
          services
        );
      }
      if (PHTL) {
        {
          const services = await database.query.service.findMany({
            where: eq(service.city, city),
            with: {
              user: {
                columns: {
                  first_name: true,
                  last_name: true,
                  profile_picture: true,
                },
              },
            },
            orderBy: desc(service.price),
          });
          if (services.length <= 0) {
            return successResponse(
              res,
              "No Services registered with this city",
              services
            );
          }

          return successResponse(
            res,
            "Successfully fetched Services List against this category",
            services
          );
        }
      }

      const services = await database.query.service.findMany({
        where: eq(service.city, city),
        with: {
          user: {
            columns: {
              first_name: true,
              last_name: true,
              profile_picture: true,
            },
          },
        },
      });
      if (services.length <= 0) {
        return successResponse(
          res,
          "No Services registered with this city",
          services
        );
      }

      return successResponse(
        res,
        "Successfully fetched Services List against selected city",
        services
      );
    }

    if (category_id && city) {
      if (PLTH) {
        const services = await database.query.service.findMany({
          where: and(
            eq(service.city, city),
            eq(service.category_id, category_id)
          ),
          with: {
            user: {
              columns: {
                first_name: true,
                last_name: true,
                profile_picture: true,
              },
            },
          },
          orderBy: asc(service.price),
        });

        if (services.length <= 0) {
          return successResponse(
            res,
            "No Services registered with this category in that city",
            services
          );
        }

        return successResponse(
          res,
          "Successfully fetched Services List against this category",
          services
        );
      }
      if (PHTL) {
        {
          const services = await database.query.service.findMany({
            where: and(
              eq(service.city, city),
              eq(service.category_id, category_id)
            ),
            with: {
              user: {
                columns: {
                  first_name: true,
                  last_name: true,
                  profile_picture: true,
                },
              },
            },
            orderBy: desc(service.price),
          });
          if (services.length <= 0) {
            return successResponse(
              res,
              "No Services registered with this category in that city",
              services
            );
          }

          return successResponse(
            res,
            "Successfully fetched Services List against this category",
            services
          );
        }
      }
      const services = await database.query.service.findMany({
        where: and(
          eq(service.city, city),
          eq(service.category_id, category_id)
        ),
        with: {
          user: {
            columns: {
              first_name: true,
              last_name: true,
              profile_picture: true,
            },
          },
        },
      });
      if (services.length <= 0) {
        return successResponse(
          res,
          "No Services registered with this category in that city",
          services
        );
      }

      return successResponse(
        res,
        "Successfully fetched Services List against this city and category",
        services
      );
    }

    if (PLTH && !category_id && !city && !PHTL) {
      const services = await database.query.service.findMany({
        with: {
          user: {
            columns: {
              first_name: true,
              last_name: true,
              profile_picture: true,
            },
          },
        },
        orderBy: asc(service.price),
      });
      // const services = await database.query.service.findMany().orderBy(desc(service.price));
      if (services.length <= 0) {
        return successResponse(res, "No Services found!", services);
      }

      return successResponse(
        res,
        "Successfully fetched Services List from price Low to High",
        services
      );
    }
    if (PHTL && !category_id && !city && !PLTH) {
      const services = await database.query.service.findMany({
        with: {
          user: {
            columns: {
              first_name: true,
              last_name: true,
              profile_picture: true,
            },
          },
        },
        orderBy: desc(service.price),
      });
      if (services.length <= 0) {
        return successResponse(res, "No Services found!", services);
      }

      return successResponse(
        res,
        "Successfully fetched Services List from price High to Low",
        services
      );
    }

    if (email) {
      const userData = await database.query.user.findFirst({
        where: eq(user.email, email),
      });
      if (!userData) {
        errorResponse(res, error.message, 403);
      }
      const services = await database.query.service.findMany({
        where: eq(service.user_id, userData.id),
        with: {
          user: {
            columns: {
              first_name: true,
              last_name: true,
              profile_picture: true,
            },
          },
        },
        orderBy: asc(service.service_name),
      });

      if (services.length <= 0) {
        return successResponse(res, "No Services found!", services);
      }

      return successResponse(
        res,
        "Successfully fetched Services List against provided user id",
        services
      );
    }

    const services = await database.query.service.findMany({
      with: {
        user: {
          columns: {
            first_name: true,
            last_name: true,
            profile_picture: true,
          },
        },
      },
    });
    if (services.length <= 0) {
      return successResponse(res, "No Services found!", services);
    }

    return successResponse(
      res,
      "Successfully! fetched Services List",
      services
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Admin will delete a service
const adminDeleteService = async (req, res) => {
  try {
    const service_id = req.params.service_id;
    const deletedService = await database
      .delete(service)
      .where(eq(service.id, service_id))
      .returning();
    if (!deletedService) {
      return errorResponse(res, "Service not Found", 404);
    }
    const userData = await database.query.user.findFirst({
      where: eq(user.id, deletedService.user_id),
    });

    return successResponse(res, "Service deleted successfully", deletedService);
    // if (deletedService) {
    //   return await sendEmail("Service Deleted", `Hello ${user.first_name}`, `<h1>Hello ${user.first_name} ${user.last_name}</h1><p>Admin deleted a service names as ${deletedService.service_name} against your account.!</p><p>Thank you for using our platform.</p>`, user.email);
    // }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Admin will make the service available or unavailable
const adminUpdateService = async (req, res) => {
  try {
    const service_id = req.params.service_id;
    const { is_available } = req.body;

    const data = await database.query.service.findFirst({
      where: eq(service.id, service_id),
    });
    if (data.is_available === is_available) {
      return successResponse(
        res,
        "This value is already stored in database!",
        data
      );
    }
    const updatedService = await database
      .update(service)
      .set({
        is_available,
      })
      .where(eq(service.id, service_id))
      .returning();
    successResponse(res, "Service is Updated!", updatedService);
    const user = await database.query.user.findFirst({
      where: eq(user.id, updatedService.user_id),
    });
    if (updatedService.is_available) {
      return await sendEmail(
        "Service Activated",
        `Hello ${user.first_name}`,
        `<h1>Hello ${user.first_name} ${user.last_name}</h1><p>Admin updated your service names as ${updatedService.service_name} against your account and is now available for business.!</p><p>Thank you for using our platform.</p>`,
        user.email
      );
    }
    return await sendEmail(
      "Service Deactivated",
      `Hello ${user.first_name}`,
      `<h1>Hello ${user.first_name} ${user.last_name}</h1><p>Admin updated your service names as ${updatedService.service_name} against your account and is now not available for business.!</p><p>Thank you for using our platform.</p>`,
      user.email
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Admin will create a category
const adminCreateService = async (req, res) => {
  try {
    const {
      service_name,
      description,
      category_id,
      price,
      is_available,
      start_time,
      end_time,
      email,
    } = req.body;
    let userData;
    if (email) {
      userData = await database.query.user.findFirst({
        where: eq(user.email, email),
      });
      console.log(email);
      console.log(userData);
      if (!userData) {
        return errorResponse(
          res,
          "User with provided email is not available",
          404
        );
      }
    }

    const isServiceAvailable = await database.query.service.findFirst({
      where: and(
        eq(service.user_id, userData.id),
        eq(service.category_id, category_id)
      ),
    });
    if (isServiceAvailable)
      return errorResponse(
        res,
        "Not Allowed! User already created a service against this category.",
        400
      );

    if (!user.address) {
      return errorResponse(
        res,
        "Not Allowed! User need to complete your profile before creating a service.",
        400
      );
    }

    const data = await database
      .insert(service)
      .values({
        service_name,
        description,
        category_id,
        price,
        is_available,
        start_time,
        end_time,
        user_id: userData.id,
        city: userData.address.city,
      })
      .returning();

    return successResponse(
      res,
      `Service is created successfully for ${user.first_name}.`,
      data
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Services Controllers

// Admin will Fetch services through this controller

const adminFetchOrders = async (req, res) => {
  try {
    const {
      order_id,
      customer_id,
      service_provider_id,
      order_status,
      payment_status,
    } = req.query;
    if (order_id) {
      const data = await database.query.order.findFirst({
        where: eq(order.id, order_id),
      });
      if (!data) {
        return errorResponse(res, "No order found. ", 400);
      }
      return successResponse(res, `Order fetched successfully!`, data);
    }
    if (customer_id) {
      const data = await database.query.order.findMany({
        where: eq(order.customer_id, customer_id),
      });
      if (data.length <= 0) {
        return errorResponse(
          res,
          "No order found against this customer. ",
          400
        );
      }
      return successResponse(res, `Orders fetched successfully!`, data);
    }
    if (service_provider_id) {
      const data = await database.query.order.findMany({
        where: eq(order.service_provider_id, service_provider_id),
      });
      if (data.length <= 0) {
        return errorResponse(
          res,
          "No order found against this service provider. ",
          400
        );
      }
      return successResponse(res, `Orders fetched successfully!`, data);
    }
    if (order_status) {
      const data = await database.query.order.findMany({
        where: eq(order.order_status, order_status),
      });
      if (data.length <= 0) {
        return errorResponse(
          res,
          "No order found against this order status. ",
          400
        );
      }
      return successResponse(res, `Orders fetched successfully!`, data);
    }
    if (payment_status) {
      const data = await database.query.order.findMany({
        where: eq(order.payment_status, payment_status),
      });
      if (data.length <= 0) {
        return errorResponse(
          res,
          "No order found against this payment status. ",
          400
        );
      }
      return successResponse(res, `Orders fetched successfully!`, data);
    }

    const data = await database.query.order.findMany();
    if (data.length <= 0) {
      return errorResponse(res, "No orders found. ", 400);
    }
    return successResponse(res, `Orders fetched successfully!`, data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Admin cancel an order
const adminCancelOrder = async (req, res) => {
  try {
    const order_id = req.params.order_id;
    const isOrder = await database.query.order.findFirst({
      where: eq(order.id, order_id),
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
        order_status: "cancelled",
      })
      .where(eq(order.id, order_id))
      .returning();

    return successResponse(res, "Order cancelled successfully!", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
// Admin delete an order
// Admin cancel an order
const adminDeleteOrder = async (req, res) => {
  try {
    const order_id = req.params.order_id;
    const isOrder = await database.query.order.findFirst({
      where: eq(order.id, order_id),
    });
    if (!isOrder)
      return errorResponse(
        res,
        "Not Allowed! This order is not available.",
        400
      );

    // Update the Order
    const data = await database
      .delete(order)
      .where(eq(order.id, order_id))
      .returning();

    return successResponse(res, "Order deleted successfully!", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export {
  adminFetchUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  adminFetchCategory,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminFetchServices,
  adminUpdateService,
  adminDeleteService,
  adminCreateService,
  adminFetchOrders,
  adminCancelOrder,
  adminDeleteOrder,
};
