import { Category } from "../models/Category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createCategory = asyncHandler(async (req, res) => {
  const {
    name,
    image,
    slug,
    parentCategory,
  } = req.body;

  if (!name || !slug) {
    throw new ApiError(
      400,
      "Name and slug are required"
    );
  }

  const existing = await Category.findOne({ slug });

  if (existing) {
    throw new ApiError(
      409,
      "Category with this slug already exists"
    );
  }

  const category = await Category.create({
    name,
    slug,
    image,
    parentCategory,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      category,
      "Category created successfully"
    )
  );
});


const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  return res.status(200).json(
    new ApiResponse(
      200,
      categories,
      "All categories fetched"
    )
  );
});


const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    throw new ApiError(
      404,
      "Category not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      category,
      "Category updated successfully"
    )
  );
});


const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(
    req.params.id
  );

  if (!category) {
    throw new ApiError(
      404,
      "Category not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Category deleted successfully"
    )
  );
});


const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    slug: req.params.slug,
  });

  if (!category) {
    throw new ApiError(
      404,
      "Category not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      category,
      "Category fetched"
    )
  );
});


export {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
};