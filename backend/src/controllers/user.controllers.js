import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { database } from "../../db/database.js";
import { user } from "../../db/schema/user.js";
import { address } from "../../db/schema/address.js";
import role from "../../db/schema/role.js";
import fs from "fs";
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

import { SERVER_PORT, SERVER_HOST, USER_ROLE } from "../utils/constants.js";
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

    // Find user by email
    const data = await database.query.user.findFirst({
      where: eq(user.email, email),
    });

    // Check if user exists
    if (!data) {
      return unauthorizeResponse(res, "User not Registered!");
    }

    // Check if user is verified
    if (!data.is_verified) {
      return errorResponse(res, "User not verified", 403);
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, data.password);
    if (!isPasswordValid) {
      return unauthorizeResponse(res, "Credentials are Wrong!");
    }

    // Create JWT token
    const token = await createJWTToken(data.id);

    // Fetch user data along with role and seller profile information
    const userData = await database
      .select({
        users: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          gender: user.gender,
          profile_picture: user.profile_picture,
          cnic: user.cnic,
          is_verified: user.is_verified,
          is_admin: user.is_admin,
          address: user.address,
          bio: user.bio,
          is_complete: user.is_complete,
        },
        roles: {
          id: role.id,
          title: role.title,
          permissions: role.permissions,
        },
        sellerProfile: {
          id: sellerProfile.id,
          qualification: sellerProfile.qualification,
          experiance: sellerProfile.experiance,
          description: sellerProfile.description,
        },
      })
      .from(user)
      .leftJoin(role, eq(role.id, user.role_id))
      .leftJoin(sellerProfile, eq(sellerProfile.user_id, user.id))
      .where(eq(user.id, data.id))
      .then((result) => result[0]); // Extract the first result if it returns as an array

    // Validate userData
    if (!userData || !userData.users) {
      return errorResponse(res, "Failed to fetch user data", 500);
    }

    // Respond with user data and token
    return successResponse(res, "Login Successfully", { userData, token });
  } catch (error) {
    console.error("Login Error:", error);
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
    if (userData[0].roles.title === USER_ROLE.CUSTOMER) {
      const roleData = await getOrCreateRole(USER_ROLE.SERVICE_PROVIDER);
      const data = await database
        .update(user)
        .set({
          role_id: roleData[0].id,
        })
        .where(eq(user.id, req.loggedInUserId))
        .returning();
      const userData = await database
        .select()
        .from(user)
        .where(eq(user.id, req.loggedInUserId))
        .leftJoin(role, eq(role.id, user.role_id));
      return successResponse(res, "User become a service provider!", userData);
    }
    const roleData = await getOrCreateRole(USER_ROLE.CUSTOMER);

    const data = await database
      .update(user)
      .set({
        role_id: roleData[0].id,
      })
      .where(eq(user.id, req.loggedInUserId))
      .returning();
    const userData2 = await database
      .select()
      .from(user)
      .where(eq(user.id, req.loggedInUserId))
      .leftJoin(role, eq(role.id, user.role_id));
    return successResponse(res, "User become a customer!", userData2);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Enpoint to complete profile
const completeProfile = async (req, res) => {
  try {
    const { bio, cnic, address, gender } = req.body;

    // Update the user profile fields
    await database
      .update(user)
      .set({
        bio,
        cnic,
        address,
        gender,
      })
      .where(eq(user.id, req.loggedInUserId));

    // Fetch updated user data along with the role information
    const [userData] = await database
      .select({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        gender: user.gender,
        profile_picture: user.profile_picture,
        cnic: user.cnic,
        is_verified: user.is_verified,
        is_admin: user.is_admin,
        address: user.address,
        bio: user.bio,
        is_complete: user.is_complete,
        role_id: role.id,
        role_title: role.title,
        role_permissions: role.permissions, // Add permissions if they are part of the role model
      })
      .from(user)
      .leftJoin(role, eq(role.id, user.role_id)) // Join the role table
      .where(eq(user.id, req.loggedInUserId)); // Match the logged-in user ID

    // Format the response to merge role fields with user fields
    const formattedResponse = {
      id: userData.id,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone,
      gender: userData.gender,
      profile_picture: userData.profile_picture,
      cnic: userData.cnic,
      is_verified: userData.is_verified,
      is_admin: userData.is_admin,
      address: userData.address,
      bio: userData.bio,
      is_complete: userData.is_complete,
      role: {
        id: userData.role_id,
        title: userData.role_title,
        permissions: userData.role_permissions,
      },
    };

    // Return the flattened data
    return successResponse(res, "Profile is Updated!", formattedResponse);
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

// Endpoint to upload profile picture
const profilePicture = async (req, res) => {
  try {
    let profilePicturePath = req.file.path;

    // Get the previous profile picture path from the database
    const currentPicture = await database.query.user.findFirst({
      where: eq(user.id, req.loggedInUserId),
      columns: {
        profile_picture: true,
      },
    });

    if (currentPicture && currentPicture.profile_picture) {
      if (fs.existsSync(currentPicture.profile_picture)) {
        fs.unlinkSync(currentPicture.profile_picture);
      }
    }

    profilePicturePath = profilePicturePath
      .replace(/^public/, "") // Remove 'public' from the beginning
      .replace(/\\/g, "/"); // Replace backslashes with forward slashes

    const updatedUser = await database
      .update(user)
      .set({ profile_picture: profilePicturePath })
      .where(eq(user.id, req.loggedInUserId))
      .returning({
        id: user.id,
        email: user.email,
        profile_picture: user.profile_picture,
      });

    // Correctly format the path: Remove 'public' and replace backslashes with forward slashes
    // const relativeProfilePicturePath = updatedUser[0].profile_picture
    //   .replace(/^public/, "") // Remove 'public' from the beginning
    //   .replace(/\\/g, "/") // Replace backslashes with forward slashes

    return successResponse(res, "Profile picture is set successfully!", {
      profile_picture: updatedUser[0].profile_picture, // Only return the relative path
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const me = async (req, res) => {
  try {
    if (req.method === "GET") {
      const data = await database
        .select({
          users: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            gender: user.gender,
            profile_picture: user.profile_picture,
            cnic: user.cnic,
            is_verified: user.is_verified,
            is_admin: user.is_admin,
            address: user.address,
            bio: user.bio,
            is_complete: user.is_complete,
          },
          roles: {
            id: role.id,
            title: role.title,
            permissions: role.permissions,
          },
          sellerProfile: {
            id: sellerProfile.id,
            qualification: sellerProfile.qualification,
            experience: sellerProfile.experiance,
            description: sellerProfile.description,
          },
        })
        .from(user)
        .leftJoin(role, eq(role.id, user.role_id))
        .leftJoin(sellerProfile, eq(sellerProfile.user_id, user.id))
        .where(eq(user.id, req.loggedInUserId));

      if (data.length === 0) {
        return successResponse(res, "No data found for this user", data);
      }
      return successResponse(res, "User data fetched successfully!", data[0]);
    }

    if (req.method === "PATCH") {
      const {
        first_name,
        last_name,
        cnic,
        bio,
        address,
        phone,
        gender,
        qualification,
        experience,
        description,
      } = req.body;

      // Step 1: Update the user data
      const userData = await database
        .update(user)
        .set({
          first_name,
          last_name,
          phone,
          cnic,
          bio,
          address,
          gender,
        })
        .where(eq(user.id, req.loggedInUserId))
        .returning();

      if (userData.length === 0) {
        return successResponse(res, "User data is not updated!", userData);
      }

      // Step 2: Update the seller profile data if available
      let sellerProfileData = null;
      if (qualification || experience || description) {
        // Check if seller profile already exists
        const existingSellerProfile = await database
          .select()
          .from(sellerProfile)
          .where(eq(sellerProfile.user_id, req.loggedInUserId));

        if (existingSellerProfile.length > 0) {
          // Update existing seller profile
          sellerProfileData = await database
            .update(sellerProfile)
            .set({
              qualification,
              experiance: experience,
              description,
            })
            .where(eq(sellerProfile.user_id, req.loggedInUserId))
            .returning();
        } else {
          // Create new seller profile if it doesn't exist
          sellerProfileData = await database
            .insert(sellerProfile)
            .values({
              qualification,
              experiance: experience,
              description,
              user_id: req.loggedInUserId,
            })
            .returning();
        }
      }

      return successResponse(
        res,
        "User and seller profile updated successfully!",
        {
          userData,
          sellerProfileData,
        }
      );
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const calculateProfileCompletion = async (req, res) => {
  try {
    // Fetch user profile
    const userProfile = await database.query.user.findFirst({
      where: eq(user.id, req.loggedInUserId),
      columns: {
        bio: true,
        cnic: true,
        address: true,
      },
    });

    // Calculate user profile completion
    const userFields = ["bio", "cnic", "address"];
    const userCompletedFields = userFields.filter(
      (field) => userProfile[field] !== null && userProfile[field] !== undefined
    ).length;

    let userCompletionPercentage =
      (userCompletedFields / userFields.length) * 100;

    let sellerCompletionPercentage = 0;

    // Check if the user is a seller
    const sellerProfilee = await database.query.sellerProfile.findFirst({
      where: eq(sellerProfile.user_id, req.loggedInUserId),
      columns: {
        qualification: true,
        experiance: true,
        description: true,
      },
    });

    if (sellerProfilee) {
      // Calculate seller profile completion
      const sellerFields = ["qualification", "experiance", "description"];
      const sellerCompletedFields = sellerFields.filter(
        (field) =>
          sellerProfilee[field] !== null && sellerProfilee[field] !== undefined
      ).length;

      sellerCompletionPercentage =
        (sellerCompletedFields / sellerFields.length) * 100;
    }

    const response = {
      userCompletionPercentage: Math.round(userCompletionPercentage),
      sellerCompletionPercentage: Math.round(sellerCompletionPercentage),
    };

    return successResponse(
      res,
      "Profile completion percentages retrieved successfully!",
      response
    );
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
  me,
  profilePicture,
  calculateProfileCompletion,
};
