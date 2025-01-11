import { eq, and, asc, desc } from "drizzle-orm";
import fs from "fs";
import { service } from "../../db/schema/service.js";
import { database } from "../../db/database.js";
import { successResponse, errorResponse } from "../utils/response.handle.js";
import { user } from "../../db/schema/user.js";
import { SERVER_PORT, SERVER_HOST } from "../utils/constants.js";
import { review } from "../../db/schema/review.js";
import sendEmail from "../utils/sendEmail.js";
import { calculateAverageRating } from "../utils/helper.js";

const fetchSingleService = async (req, res) => {
  try {
    const service_id = req.params.service_id;
    if (service_id) {
      const specificService = await database.query.service.findFirst({
        where: eq(service.id, service_id),
        with: {
          user: true,
          category: true,
          reviews: {
            with: {
              reviewer: {
                columns: {
                  first_name: true,
                  last_name: true,
                  email: true,
                  profile_picture: true,
                },
              },
            },
          },
        },
      });
      const averageRating = calculateAverageRating(specificService.reviews);
      return successResponse(res, "Service Found", {
        specificService,
        averageRating,
      });
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const fetchAllServices = async (req, res) => {
  try {
    const category_id = req.params.category_id;
    if (req.method !== "GET") {
      return errorResponse(res, "Method Not Allowed", 405);
    }
    if (category_id) {
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
          "No Services found against this category",
          services
        );
      }

      return successResponse(
        res,
        "Successfully fetched Services List against this category",
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
      return successResponse(res, "No Services found", services);
    }

    return successResponse(res, "Successfully fetched Services List", services);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const fetchMyServices = async (req, res) => {
  try {
    const services = await database.query.service.findMany({
      where: eq(service.user_id, req.loggedInUserId),
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
        "You are not providing any service",
        services
      );
    }

    return successResponse(res, "Successfully Fetched Services List", services);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const createService = async (req, res) => {
  console.log("in");
  try {
    const {
      service_name,
      description,
      category_id,
      price,
      is_available,
      start_time,
      end_time,
    } = req.body;
    console.log(req.body);
    const isServiceAvailable = await database.query.service.findFirst({
      where: and(
        eq(service.user_id, req.loggedInUserId),
        eq(service.category_id, category_id)
      ),
    });
    console.log("isServiceAvailbale: ", isServiceAvailable);
    if (isServiceAvailable)
      return errorResponse(
        res,
        "Not Allowed! You already created a service against this category.",
        400
      );
    const userData = await database.query.user.findFirst({
      where: eq(user.id, req.loggedInUserId),
    });
    console.log("userData: ", userData);
    if (!userData.address) {
      return errorResponse(
        res,
        "Not Allowed! You need to complete your profile before creating a service.",
        400
      );
    }
    // try {
    //    await sendEmail("Service Registered Successfully!", `Hello ${userData.first_name}`, `<h1>Hello ${userData.first_name} ${userData.last_name}</h1><p>You have been created a new service named as ${data.service_name}</p>`, userData.email);

    //     const data = await database
    //     .insert(service)
    //     .values({
    //         service_name,
    //         description,
    //         category_id,
    //         price,
    //         is_available,
    //         start_time,
    //         end_time,
    //         user_id: req.loggedInUserId,
    //         city: userData.address.city
    //     })
    //         .returning()
    //     return successResponse(res, "Service Created Successfully!", {
    //             data,
    //     })
    // } catch (error) {
    //     return errorResponse(res, `Error in sending email = ${error.message}`, 400);
    // }

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
        user_id: req.loggedInUserId,
        city: userData.address.city,
      })
      .returning();
    return successResponse(res, "Service Created Successfully!", {
      data,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const updateService = async (req, res) => {
  try {
    const id = req.params.service_id;
    const {
      service_name,
      description,
      category_id,
      price,
      is_available,
      start_time,
      end_time,
    } = req.body;
    const isServiceAvailable = await database.query.service.findFirst({
      where: and(eq(service.user_id, req.loggedInUserId), eq(service.id, id)),
    });
    console.log("AhsanAhsan Ahsan");
    if (!isServiceAvailable)
      return errorResponse(res, "This service does not exist.", 400);

    if (category_id !== isServiceAvailable.category_id) {
      const services = await database.query.service.findMany({
        where: and(
          eq(service.user_id, req.loggedInUserId),
          eq(service.category_id, category_id)
        ),
      });
      if (services.length >= 1) {
        return errorResponse(
          res,
          "Not Allowed! You already created service against this id.",
          400
        );
      }
    }
    // Update the service
    const updatedService = await database
      .update(service)
      .set({
        service_name,
        description,
        category_id,
        price,
        is_available,
        start_time,
        end_time,
      })
      .where(eq(service.id, id))
      .returning();

    return successResponse(res, "Service updated successfully!", {
      updatedService,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const deleteService = async (req, res) => {
  try {
    const id = req.params.service_id;
    const userData = await database.query.user.findFirst({
      where: eq(user.id, req.loggedInUserId),
    });

    const data = await database.query.user.findFirst({
      where: eq(service.id, id),
    });
    if (!data) {
      return errorResponse(res, `Service with this id = ${id} not Found`, 400);
    }
    if (data.user_id !== req.loggedInUserId) {
      return errorResponse(
        res,
        "Not Allowed! This service not belongs to you.",
        400
      );
    }
    // try {
    //     await sendEmail("Service Deleted Successfully!", `Hello ${userData.first_name}`, `<h1>Hello ${userData.first_name} ${userData.last_name}</h1><p>You have been deleted a service named as ${data.service_name}</p>`, userData.email);

    //     const deletedService = await database.delete(service).where(eq(service.id, id)).returning({
    //         id: service.id,
    //         service_name: service.service_name
    //     })

    //     return successResponse(res, "Service deleted successfully!", deletedService)
    // } catch (error) {
    //     return errorResponse(res, `Error in sending email = ${error.message}`, 400);
    // }

    const deletedService = await database
      .delete(service)
      .where(eq(service.id, id))
      .returning({
        id: service.id,
        service_name: service.service_name,
      });

    return successResponse(
      res,
      "Service deleted successfully!",
      deletedService
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const uploadServiceCoverPhoto = async (req, res) => {
  try {
    const service_id = req.params.service_id;
    const coverPhotoPath = req.file.path;
    console.log(req);

    // Get the previous cover photo path from the database for the service
    const currentCoverPhoto = await database.query.service.findFirst({
      where: eq(service.id, service_id),
      columns: {
        cover_photo: true,
      },
    });

    // If there's a current cover photo, delete it from the filesystem
    if (currentCoverPhoto && currentCoverPhoto.cover_photo) {
      if (fs.existsSync(currentCoverPhoto.cover_photo)) {
        fs.unlinkSync(currentCoverPhoto.cover_photo);
      }
    }

    // Update the service with the new cover photo path
    const updatedService = await database
      .update(service)
      .set({ cover_photo: coverPhotoPath })
      .where(eq(service.id, service_id))
      .returning();
    console.log(updatedService);
    // Return the updated service with the full cover photo URL
    updatedService[0].cover_photo = `http://${SERVER_HOST}:${SERVER_PORT}${updatedService[0].cover_photo.replace(/^public/, "").replace(/\\/g, "/")}`;

    return successResponse(
      res,
      "Cover photo is set successfully!",
      updatedService
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const fetchFilteredServices = async (req, res) => {
  try {
    let { city, category_id, PLTH, PHTL } = req.query;

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

export {
  createService,
  fetchSingleService,
  fetchAllServices,
  fetchFilteredServices,
  fetchMyServices,
  updateService,
  deleteService,
  uploadServiceCoverPhoto,
};
