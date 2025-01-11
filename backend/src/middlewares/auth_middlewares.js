import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import { database } from "../../db/database.js";
import { user } from "../../db/schema/user.js";
import blackListToken from "../../db/schema/blacklisttoken.js";
import { getToken, verifyToken } from "../utils/helper.js";
import {
  errorResponse,
  unauthorizeResponse,
} from "../utils/response.handle.js";

import role from "../../db/schema/role.js";

const authentication = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      return unauthorizeResponse(res, "Authentication token is required");
    }

    const invalidToken = await database.query.blackListToken.findFirst({
      where: eq(blackListToken.token, token),
    });
    if (invalidToken) {
      return unauthorizeResponse(res, "Unauthorize! Invalid Token");
    }

    let decodedToken;

    try {
      decodedToken = verifyToken(token);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return unauthorizeResponse(res, "Token has expired");
      } else {
        return unauthorizeResponse(res, "Invalid token");
      }
    }

    const data = await database.query.user.findFirst({
      where: eq(user.id, decodedToken.id),
      columns: { id: true },
    });

    if (!data) {
      return unauthorizeResponse(res, "Unauthorize! User not Found");
    }
    // Sending LoggedIn user in the next middleware
    req.loggedInUserId = data.id;
    next();
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Authorization Middleware
const authorization =
  (...permissions) =>
  async (req, res, next) => {
    try {
      const loggedInUserId = req.loggedInUserId;
      const data = await database
        .select()
        .from(user)
        .where(eq(user.id, loggedInUserId))
        .leftJoin(role, eq(role.id, user.role_id));
      console.log(data[0].roles.title);
      console.log(permissions[0]);
      if (!data[0].users.is_admin && data[0].roles.title !== permissions[0]) {
        return errorResponse(res, "Forbidden", 403);
      }
      next();
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  };

// Middleware to check if user is already registered
const checkUserAlreadyRegistered = async (req, res, next) => {
  try {
    const { email } = req.body;
    const data = await database.query.user.findFirst({
      where: eq(user.email, email),
      columns: { is_admin: true },
    });

    if (data) {
      return errorResponse(
        res,
        "user with this Email is already Registered",
        409
      );
    }
    next();
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

// Middleware to upload Profile Picture
const uploadProfilePictureMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/profilePicture");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
}).single("profile_picture");

// Middleware to upload Service Cover Photo
const uploadServiceCoverPhotoMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/serviceCoverPhoto");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
}).single("cover_photo");

export {
  authentication,
  authorization,
  checkUserAlreadyRegistered,
  uploadProfilePictureMiddleware,
  uploadServiceCoverPhotoMiddleware,
};
