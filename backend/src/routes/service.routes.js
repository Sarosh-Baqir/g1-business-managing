import express from "express";
const router = express.Router({ mergeParams: true });
import {
  authentication,
  authorization,
  uploadServiceCoverPhotoMiddleware,
} from "../middlewares/auth_middlewares.js";
import {
  fetchSingleService,
  fetchAllServices,
  fetchMyServices,
  createService,
  deleteService,
  updateService,
  uploadServiceCoverPhoto,
} from "../controllers/service.controller.js";
import { USER_ROLE } from "../utils/constants.js";
import {
  fetchServiceSchema,
  createServiceSchema,
  updateServiceSchema,
} from "../validation_schemas/service.validation.schemas.js";
import { validationMiddleware } from "../middlewares/validation_schema.js";

router
  .route("/")
  .get(
    // authentication,
    validationMiddleware(fetchServiceSchema, (req) => req.params),
    fetchAllServices
  )
  .post(
    authentication,
    authorization(USER_ROLE.SERVICE_PROVIDER),
    validationMiddleware(createServiceSchema, (req) => req.body),
    createService
  );

router.route("/myServices").get(
  authentication,
  authorization(USER_ROLE.SERVICE_PROVIDER),
  // validationMiddleware(createServiceSchema, req => req.body),
  fetchMyServices
);

router.patch(
  "/cover-photo/:service_id",
  authentication,
  uploadServiceCoverPhotoMiddleware,
  uploadServiceCoverPhoto
);

router
  .route("/:service_id")
  .get(
    // authentication,
    // authorization(USER_ROLE.STAFF),
    validationMiddleware(fetchServiceSchema, (req) => req.params),
    fetchSingleService
  )
  .patch(
    authentication,
    authorization(USER_ROLE.SERVICE_PROVIDER),
    validationMiddleware(updateServiceSchema, (req) => req.body),
    updateService
  )
  .delete(
    authentication,
    authorization(USER_ROLE.SERVICE_PROVIDER),
    validationMiddleware(fetchServiceSchema, (req) => req.params),
    deleteService
  );

export default router;
