import express from "express";
import {
  registerUser,
  verifyUser,
  getOTP,
  verifyOTP,
  login,
  updatePassword,
  resetPassword,
  logOut,
  switchRole,
  completeProfile,
  completeSellerProfile,
} from "../controllers/user.controllers.js";
import { validationMiddleware } from "../middlewares/validation_schema.js";
import {
  registerUserValidationSchema,
  verifyUserValidationSchema,
  getOTPValidationSchema,
  verifyOtpValidationSchema,
  loginValidationSchema,
  updatePasswordValidationSchema,
  resetPasswordValidationSchema,
  completeProfileValidationSchema,
  completeSellerProfileValidationSchema,
} from "../validation_schemas/user.validation.schemas.js";
import {
  authentication,
  authorization,
  checkUserAlreadyRegistered,
} from "../middlewares/auth_middlewares.js";
import { USER_ROLE } from "../utils/constants.js";

const router = express.Router();

router.get(
  "/get-otp/:email",
  validationMiddleware(getOTPValidationSchema, (req) => req.params),
  getOTP
);

router.post(
  "/register",
  validationMiddleware(registerUserValidationSchema, (req) => req.body),
  checkUserAlreadyRegistered,
  registerUser
);
router.post(
  "/verify-user",
  validationMiddleware(verifyUserValidationSchema, (req) => req.body),
  verifyUser
);

router.post(
  "/verify-otp",
  validationMiddleware(verifyOtpValidationSchema, (req) => req.body),
  verifyOTP
);
router.post(
  "/login",
  validationMiddleware(loginValidationSchema, (req) => req.body),
  login
);
router.post(
  "/update-password",
  authentication,
  validationMiddleware(updatePasswordValidationSchema, (req) => req.body),
  updatePassword
);
router.post(
  "/forget-password",
  validationMiddleware(resetPasswordValidationSchema, (req) => req.body),
  resetPassword
);
router.post("/logout", authentication, logOut);
router.patch("/switch-role", authentication, switchRole);

router.patch(
  "/complete-profile",
  authentication,
  validationMiddleware(completeProfileValidationSchema, (req) => req.body),
  completeProfile
);

router.patch(
  "/complete-seller-profile",
  authentication,
  authorization(USER_ROLE.SERVICE_PROVIDER),
  validationMiddleware(
    completeSellerProfileValidationSchema,
    (req) => req.body
  ),
  completeSellerProfile
);

export default router;
