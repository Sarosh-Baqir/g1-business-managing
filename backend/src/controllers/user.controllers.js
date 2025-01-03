import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { database } from "../../db/database.js";
import { user } from "../../db/schema/user.js";
import { address } from "../../db/schema/address.js";
import role from "../../db/schema/role.js";

import blackListToken from "../../db/schema/blacklisttoken.js";
import {
  createOTP,
  createJWTToken,
  getToken,
  verifyToken,
} from "../utils/helper.js";
import {
  successResponse,
  errorResponse,
  unauthorizeResponse,
} from "../utils/response.handle.js";
import sendEmail from "../utils/sendEmail.js";
import { getOrCreateRole } from "../../db/customqueries/queries.js";

import { USER_ROLE } from "../utils/constants.js";
import { sellerProfile } from "../../db/schema/sellerProfile.js";

// API to register a new user
const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password, gender, is_admin } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = createOTP();

    try {
      // await sendEmail(
      //   "Registration Request",
      //   `Hello ${first_name}`,
      //   `<h1>Hello ${first_name} ${last_name}</h1><p>Thank you for registering with us!</p><p>Your OTP for registration is <strong>${otp}</strong>.</p>`,
      //   email
      // );

      const data = await database
        .insert(user)
        .values({
          first_name,
          last_name,
          email,
          phone,
          password: hashedPassword,
          otp,
          gender,
          is_admin,
        })
        .returning({
          id: user.id,
          email: user.email,
          otp: user.otp,
          role_id: user.role_id,
          is_admin: user.is_admin,
        });

      return successResponse(
        res,
        "User Registered Successfully! An email has been sent with otp to your provided email.",
        {
          data,
        }
      );
    } catch (error) {
      return errorResponse(
        res,
        `Error in sending email = ${error.message}`,
        400
      );
    }
    //  const data = await database
    //     .insert(user)
    //     .values({
    //       first_name,
    //       last_name,
    //       email,
    //       phone,
    //       password: hashedPassword,
    //       otp,
    //       gender,
    //       role_id: defaultRole[0].id,
    //     })
    //   .returning();

    //   return successResponse(res, "User Registered Successfully!", {
    //     data,
    //   });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// After Registration Verify the User
const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const data = await database.query.user.findFirst({
      where: eq(user.email, email),
    });
    if (!data) {
      return errorResponse(res, "User Not Found", 404);
    }
    if (data.is_verified) {
      return errorResponse(res, "User is Already Verified", 400);
    }
    if (otp !== data.otp) {
      return errorResponse(res, "Invalid OTP!", 400);
    }

    try {
      // await sendEmail(
      //   "Account Verification",
      //   `Hello ${data.first_name}`,
      //   `<h1>Hello ${data.first_name} ${data.last_name}</h1><h3>Hurray! Congratulations.</h3><p>Your account has been verified. Now you can login to the system.</p>`,
      //   data.email
      // );
      const updatedUser = await database
        .update(user)
        .set({ is_verified: true, otp: null })
        .where(eq(user.email, email))
        .returning({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          is_verified: user.is_verified,
        });

      return successResponse(res, "User verified successfully!", updatedUser);
    } catch (error) {
      return errorResponse(
        res,
        `Error in sending email = ${error.message}`,
        400
      );
    }
    // const updatedUser = await database
    //     .update(user)
    //     .set({ is_verified: true, otp: null })
    //     .where(eq(user.email, email))
    //     .returning({ id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, is_verified: user.is_verified })

    //   return successResponse(res, "User verified successfully!", updatedUser)
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get Otp
const getOTP = async (req, res) => {
  try {
    const email = req.params.email;
    const data = await database.query.user.findFirst({
      where: eq(user.email, email),
    });
    if (!data) {
      return errorResponse(res, "User Not Found", 404);
    }
    const newOtp = createOTP();

    try {
      // await sendEmail(
      //   "New OTP Request",
      //   `Hello ${data.first_name}`,
      //   `<h1>Hello ${data.first_name} ${data.last_name}</h1><p>You request for a new otp!!</p><p>Your OTP is <strong>${newOtp}</strong>.</p>`,
      //   data.email
      // );

      const otp = await database
        .update(user)
        .set({ otp: newOtp })
        .where(eq(user.email, email))
        .returning({ otp: user.otp });
      return successResponse(res, "OTP sent successfully!", otp);
    } catch (error) {
      return errorResponse(
        res,
        `Error in sending email = ${error.message}`,
        400
      );
    }

    //     const otp = await database.update(user).set({ otp: newOtp }).where(eq(user.email, email)).returning({ otp: user.otp })
    // return successResponse(res, "OTP sent successfully!", otp)
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const data = await database.query.user.findFirst({
      where: eq(user.email, email),
      columns: {
        email: true,
        otp: true,
      },
    });

    if (!data) {
      return errorResponse(res, "Not Found", 404);
    }
    if (otp !== data.otp) {
      return errorResponse(res, "Invalid OTP", 400);
    }

    const updatedUser = await database
      .update(user)
      .set({ otp: null })
      .where(eq(user.email, email))
      .returning({ id: user.id, email: user.email });

    return successResponse(res, "OTP verified successfully!", updatedUser);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// API for loggingIn
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await database.query.user.findFirst({
      where: eq(user.email, email),
    });
    if (!data) {
      return unauthorizeResponse(res, "User not Registered!");
    }

    if (!data.is_verified) {
      return errorResponse(res, "User not verified", 403);
    }

    const isPasswordValid = await bcrypt.compare(password, data.password);

    if (!isPasswordValid) {
      return unauthorizeResponse(res, "Credentials are Wrong!");
    }

    const token = await createJWTToken(data.id);
    return successResponse(res, "Login Successfully", { data, token });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Any user will Update his password
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const data = await database.query.user.findFirst({
      where: eq(user.id, req.loggedInUserId),
    });

    const isMatch = await bcrypt.compare(oldPassword, data.password);

    if (!isMatch) {
      return errorResponse(res, "Old Password is incorrect!", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    try {
      await sendEmail(
        "Password Updated Successfully!",
        `Hello ${data.first_name}`,
        `<h1>Hello ${data.first_name} ${data.last_name}</h1><p>Your Password has been updated against ${data.email}!</p>`,
        data.email
      );

      const updatedUser = await database
        .update(user)
        .set({ password: hashedPassword })
        .where(eq(user.id, req.loggedInUserId))
        .returning({ id: user.id, email: user.email });

      return successResponse(
        res,
        "Password is updated, and email has been sent.",
        updatedUser
      );
    } catch (error) {
      return errorResponse(
        res,
        `Error in sending email = ${error.message}`,
        400
      );
    }

    //       const updatedUser = await database
    //   .update(user)
    //   .set({ password: hashedPassword })
    //   .where(eq(user.id, req.loggedInUserId))
    //   .returning({ id: user.id, email: user.email })

    // return successResponse(res, "Password is updated", updatedUser)
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// First send request to get-otp and then verify-otp and then reset-password

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;

    const data = await database.query.user.findFirst({
      where: eq(user.email, email),
      columns: {
        id: true,
        is_verified: true,
        otp: true,
        password: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });

    if (!data) {
      return errorResponse(res, "User Not Found", 404);
    }

    if (!data.is_verified) {
      return errorResponse(res, "Account is not verified", 403);
    }
    if (data.otp !== otp) {
      return errorResponse(res, "Invalid Otp!", 400);
    }

    const isSameAsCurrentPassword = await bcrypt.compare(
      newPassword,
      data.password
    );

    if (isSameAsCurrentPassword) {
      return errorResponse(
        res,
        "Your previous password and newPassword should not be the same",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // try {
    //   await sendEmail("Password Reset Successfully!", `Hello ${data.first_name}`, `<h1>Hello ${data.first_name} ${data.last_name}</h1><p>Your Password has been updated against ${data.email}!</p>`, data.email);
    //   const updatedUser = await database
    //     .update(user)
    //     .set({ password: hashedPassword })
    //     .where(eq(user.email, email))
    //     .returning({ id: user.id, email: user.email })

    //   return successResponse(res, "Password is Reset", updatedUser)
    // } catch (error) {
    //   return errorResponse(res, `Error in sending email = ${error.message}`, 400);
    // }

    const updatedUser = await database
      .update(user)
      .set({ password: hashedPassword })
      .where(eq(user.email, email))
      .returning({ id: user.id, email: user.email });

    return successResponse(res, "Password is Reset", updatedUser);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

//Logout API It will delete the token from Bearer header
const logOut = async (req, res) => {
  try {
    const token = getToken(req);
    const decodedToken = verifyToken(token);
    if (!token) {
      return unauthorizeResponse(res, "Authentication token is required");
    }

    const data = await database
      .insert(blackListToken)
      .values({ token, expire_time: decodedToken.exp });
    return successResponse(res, "Log out successfully", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// End point to become a service provider
const switchRole = async (req, res) => {
  try {
    const userData = await database
      .select()
      .from(user)
      .where(eq(user.id, req.loggedInUserId))
      .leftJoin(role, eq(role.id, user.role_id));

    if (userData[0]?.roles?.title === USER_ROLE.CUSTOMER) {
      const roleData = await getOrCreateRole(USER_ROLE.SERVICE_PROVIDER);

      const data = await database
        .update(user)
        .set({
          role_id: roleData[0].id,
        })
        .where(eq(user.id, req.loggedInUserId))
        .returning();
      return successResponse(res, "User become a service provider!", data);
    }
    const roleData = await getOrCreateRole(USER_ROLE.CUSTOMER);

    // try {
    //   await sendEmail("Account Updated", `Hello ${userData[0].users.first_name}`, `<h1>Hello ${userData[0].users.first_name} ${userData[0].users.last_name}</h1><h3>Hurray! Congratulations.</h3><p>Your account has been updated to <strong>service provider</strong>.</p><p> Now you can create services to sell and earn with us.</p>`, userData[0].users.email);
    //   const data = await database
    //   .update(user)
    //   .set({
    //     role_id: roleData.id
    //   })
    //   .where(eq(user.id, req.loggedInUserId))
    //     .returning()
    //   return successResponse(res, "User become a service provider!", data)
    // } catch (error) {
    //   return errorResponse(res, `Error in sending email = ${error.message}`, 400);
    // }

    const data = await database
      .update(user)
      .set({
        role_id: roleData[0].id,
      })
      .where(eq(user.id, req.loggedInUserId))
      .returning();
    return successResponse(res, "User become a customer!", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Enpoint to complete profile
const completeProfile = async (req, res) => {
  try {
    const { bio, cnic, Address } = req.body;
    const addressWithUserId = {
      ...Address,
      user_id: req.loggedInUserId,
    };

    const add = await database
      .insert(address)
      .values(addressWithUserId)
      .returning();
    console.log("address in table: ", add);

    const data = await database
      .update(user)
      .set({
        bio,
        cnic,
        address: Address,
      })
      .where(eq(user.id, req.loggedInUserId))
      .returning({
        id: user.id,
        bio: user.bio,
        cnic: user.cnic,
        address: user.address,
      });

    return successResponse(res, "Profile is Updated!", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Enpoint to complete profile
const completeSellerProfile = async (req, res) => {
  try {
    const { qualification, experiance, description } = req.body;

    const data = await database
      .insert(sellerProfile)
      .values({
        qualification,
        experiance,
        description,
        user_id: req.loggedInUserId,
      })
      .returning();

    return successResponse(res, "Seller Profile is Updated!", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export {
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
};
