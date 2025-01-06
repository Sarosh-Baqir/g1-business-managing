import { z } from "zod";

const passwordContainsMixture = (value) => {
  if (typeof value !== "string") return false;
  const containsNumber = /\d/.test(value);
  const containsCharacter = /[a-zA-Z]/.test(value);
  return containsNumber && containsCharacter;
};

const registerUserValidationSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1)
    .regex(/^[A-Za-z\s]+$/),
  last_name: z
    .string()
    .trim()
    .min(1)
    .regex(/^[A-Za-z\s]+$/),
  email: z.string().trim().min(1).email(),
  phone: z.string().trim().min(11).max(15).regex(/^\d+$/),
  gender: z.enum(["male", "female", "other"]),
  password: z.string().trim().min(8).refine(passwordContainsMixture, {
    message: "Password must be a mixture of numbers and characters",
  }),
});
// Define validation schema for user Verification
const verifyUserValidationSchema = z.object({
  email: z.string().min(1).email(),
  otp: z.string().min(6).max(7),
});
// Define validation schema for getting OTP
const getOTPValidationSchema = z.object({
  email: z.string().min(1).email(),
});
// Define validation schema for Verifying OTP
const verifyOtpValidationSchema = z.object({
  email: z.string().min(1).email(),
  otp: z.string().min(6).max(7),
});
// Define validation schema for login
const loginValidationSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(8),
});
// Define Validation schema for update Password Endpoint
const updatePasswordValidationSchema = z
  .object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8).refine(passwordContainsMixture, {
      message: "Password must be a mixture of numbers and characters",
    }),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from the old password",
  });
// Define Validation Schema for reset-password endpoint
const resetPasswordValidationSchema = z.object({
  email: z.string().email().min(1),
  newPassword: z.string().min(8).refine(passwordContainsMixture, {
    message: "Password must be a mixture of numbers and characters",
  }),
  otp: z.string().min(6).max(7),
});

// Define Validation Schema for complete-profile endpoint
const completeProfileValidationSchema = z.object({
  bio: z.string().min(1).max(1000),
  cnic: z.string().regex(/^\d{5}-\d{7}-\d$/, {
    message: "cnic in '12345-1234567-1' format",
  }),
  Address: z.object({
    street_no: z
      .number({ message: "street_no should be a positive number" })
      .min(0, { message: "street_no should be a positive number" }),
    city: z
      .string()
      .min(1)
      .regex(/^[A-Za-z\s]+$/, {
        message: "City must be a string of characters",
      }),
    state: z
      .string()
      .min(1)
      .regex(/^[A-Za-z\s]+$/, {
        message: "State must be a string of characters",
      }),
    postal_code: z
      .string()
      .min(1)
      .regex(/^\d+$/, { message: "Postal Code must be a string of numbers" }),
    country: z
      .string()
      .min(1)
      .regex(/^[A-Za-z\s]+$/, {
        message: "Country must be a string of characters",
      }),
    location: z.string().optional(),
  }),
});

const completeSellerProfileValidationSchema = z.object({
  qualification: z.string().min(1).max(1000),
  experiance: z.string().min(1).max(1000),
  description: z.string().min(1).max(1000),
});

// Define Zod schema for validating PATCH request data
const updateUserValidationSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1)
    .regex(/^[A-Za-z\s]+$/, { message: "Only alphabets are allow!" })
    .optional(),
  last_name: z
    .string()
    .trim()
    .min(1)
    .regex(/^[A-Za-z\s]+$/)
    .optional(),
  cnic: z
    .string()
    .regex(/^\d{5}-\d{7}-\d$/, {
      message: "cnic should be in '12345-1234567-1' format",
    })
    .optional(),
  bio: z.string().min(1).max(1000).optional(),
  address: z
    .object({
      street_no: z
        .number({ message: "street_no should be a positive number" })
        .min(0, { message: "street_no should be a positive number" }),
      city: z
        .string()
        .min(1)
        .regex(/^[A-Za-z\s]+$/, { message: "City must be a string of characters" }),
      state: z
        .string()
        .min(1)
        .regex(/^[A-Za-z\s]+$/, { message: "State must be a string of characters" }),
      postal_code: z.string().min(1).regex(/^\d+$/, { message: "Postal Code must be a string of numbers" }),
      country: z
        .string()
        .min(1)
        .regex(/^[A-Za-z\s]+$/, { message: "Country must be a string of characters" }),
      location: z.string().optional(),
    })
    .optional(),
  phone: z.string().trim().min(11).max(15).regex(/^\d+$/).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
})


export {
  registerUserValidationSchema,
  verifyUserValidationSchema,
  getOTPValidationSchema,
  verifyOtpValidationSchema,
  loginValidationSchema,
  updatePasswordValidationSchema,
  resetPasswordValidationSchema,
  completeProfileValidationSchema,
  updateUserValidationSchema,
  completeSellerProfileValidationSchema,
};
