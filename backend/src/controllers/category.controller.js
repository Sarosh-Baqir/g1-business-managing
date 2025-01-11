import { eq } from "drizzle-orm";
import { database } from "../../db/database.js";
import { category } from "../../db/schema/category.js";
import { successResponse, errorResponse } from "../utils/response.handle.js";

// Normal User Category Controllers

// Create a new category

const fetchSingleCategory = async (req, res) => {
  try {
    if (req.method !== "GET") {
      return errorResponse(res, "Method Not Allowed", 405);
    }
    const category_id = req.params.category_id;
    if (category_id) {
      const specificCategory = await database.query.category.findFirst({
        where: eq(category.id, category_id),
      });

      if (!specificCategory) {
        return errorResponse(res, ` Category with this id not found`, 404);
      }

      return successResponse(res, "Category Found", specificCategory);
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const fetchAllCategories = async (req, res) => {
  try {
    if (req.method !== "GET") {
      return errorResponse(res, "Method Not Allowed", 405);
    }

    const categories = await database.query.category.findMany();
    if (categories.length <= 0) {
      return successResponse(res, "No Categories found", categories);
    }

    return successResponse(
      res,
      "Successfully fetched Categories List",
      categories
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export { fetchSingleCategory, fetchAllCategories };
