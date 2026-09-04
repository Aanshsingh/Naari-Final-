// Server/Controllers/product.Controller.js

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/Product.model.js";

import {
  getEffectiveBadge,
  getEffectivePrice,
  isSaleActive,
} from "../utils/productDisplay.js";


// ============================================================
// ENRICH PRODUCT
// ============================================================

function enrichProduct(product) {
  const obj = product.toObject
    ? product.toObject()
    : product;

  return {
    ...obj,

    effectiveBadge: getEffectiveBadge(obj),

    effectivePrice: getEffectivePrice(obj),

    isOnSale: isSaleActive(obj),
  };
}


// ============================================================
// CREATE PRODUCT
// ============================================================

const createProduct = asyncHandler(async (req, res) => {

  const {
    name,
    slug,
    description,
    price,
    discountPrice,
    images,
    category,
    stock,
    sizes,
    badge,
    saleStartDate,
    saleEndDate,
    fabricCare,
  } = req.body;


  // ----------------------------------------------------------
  // REQUIRED FIELDS
  // ----------------------------------------------------------

  if (
    !name?.trim() ||
    !slug?.trim() ||
    price === undefined ||
    price === null ||
    !category
  ) {
    throw new ApiError(
      400,
      "Name, slug, price, and category are required"
    );
  }


  // ----------------------------------------------------------
  // PRICE VALIDATION
  // ----------------------------------------------------------

  if (Number(price) <= 0) {
    throw new ApiError(
      400,
      "Price must be greater than 0"
    );
  }


  if (
    discountPrice !== undefined &&
    discountPrice !== null &&
    discountPrice !== ""
  ) {
    if (
      Number(discountPrice) <= 0 ||
      Number(discountPrice) >= Number(price)
    ) {
      throw new ApiError(
        400,
        "Discount price must be greater than 0 and less than the original price"
      );
    }
  }


  // ----------------------------------------------------------
  // STOCK VALIDATION
  // ----------------------------------------------------------

  if (
    stock !== undefined &&
    (
      Number(stock) < 0 ||
      !Number.isInteger(Number(stock))
    )
  ) {
    throw new ApiError(
      400,
      "Stock must be a valid non-negative integer"
    );
  }


  // ----------------------------------------------------------
  // SLUG CHECK
  // ----------------------------------------------------------

  const existing = await Product.findOne({
    slug: slug.trim(),
  });

  if (existing) {
    throw new ApiError(
      409,
      "A product with this slug already exists"
    );
  }


  // ----------------------------------------------------------
  // CREATE PRODUCT
  // ----------------------------------------------------------

  const product = await Product.create({
    name: name.trim(),

    slug: slug.trim(),

    description: description?.trim() || "",

    price: Number(price),

    discountPrice:
      discountPrice !== undefined &&
      discountPrice !== null &&
      discountPrice !== ""
        ? Number(discountPrice)
        : undefined,

    images: Array.isArray(images)
      ? images
      : [],

    category,

    stock:
      stock !== undefined
        ? Number(stock)
        : 0,

    sizes: Array.isArray(sizes)
      ? sizes
      : [],

    badge:
      badge || "auto",

    saleStartDate:
      saleStartDate || undefined,

    saleEndDate:
      saleEndDate || undefined,

    fabricCare:
      fabricCare?.trim() || "",
  });


  // ----------------------------------------------------------
  // ENRICH RESPONSE
  // ----------------------------------------------------------

  const enrichedProduct =
    enrichProduct(product);


  return res.status(201).json(
    new ApiResponse(
      201,
      enrichedProduct,
      "Product created"
    )
  );
});


// ============================================================
// GET ALL PRODUCTS
// ============================================================

const getAllProducts = asyncHandler(async (req, res) => {

  const {
    category,
    search = "",
    sort,
    page = 1,
    limit = 12,
  } = req.query;


  // ----------------------------------------------------------
  // PAGINATION
  // ----------------------------------------------------------

  const pageNumber = Math.max(
    Number(page) || 1,
    1
  );

  const limitNumber = Math.min(
    Math.max(Number(limit) || 12, 1),
    100
  );


  // ----------------------------------------------------------
  // FILTER
  // ----------------------------------------------------------

  const filter = {
    isActive: true,
  };


  if (category) {
    filter.category = category;
  }


  if (search?.trim()) {
    filter.$text = {
      $search: search.trim(),
    };
  }


  // ----------------------------------------------------------
  // SORT
  // ----------------------------------------------------------

  const sortOptions = {

    price_asc: {
      price: 1,
    },

    price_desc: {
      price: -1,
    },

    newest: {
      createdAt: -1,
    },

  };


  const sortBy =
    sortOptions[sort] || {
      createdAt: -1,
    };


  // ----------------------------------------------------------
  // SKIP
  // ----------------------------------------------------------

  const skip =
    (pageNumber - 1) * limitNumber;


  // ----------------------------------------------------------
  // DATABASE QUERY
  // ----------------------------------------------------------

  const [
    products,
    total,
  ] = await Promise.all([

    Product.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limitNumber)
      .populate(
        "category",
        "name slug"
      ),

    Product.countDocuments(filter),

  ]);


  // ----------------------------------------------------------
  // ENRICH
  // ----------------------------------------------------------

  const enrichedProducts =
    products.map(enrichProduct);


  return res.status(200).json(
    new ApiResponse(
      200,

      {
        products: enrichedProducts,

        total,

        page: pageNumber,

        totalPages:
          Math.ceil(
            total / limitNumber
          ),
      },

      "Products fetched"
    )
  );
});


// ============================================================
// GET PRODUCT BY SLUG
// ============================================================

const getProductBySlug = asyncHandler(async (req, res) => {

  const product =
    await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate(
      "category",
      "name slug"
    );


  if (!product) {
    throw new ApiError(
      404,
      "Product not found"
    );
  }


  // IMPORTANT
  // Add effectivePrice,
  // effectiveBadge and isOnSale
  const enrichedProduct =
    enrichProduct(product);


  return res.status(200).json(
    new ApiResponse(
      200,
      enrichedProduct,
      "Product fetched"
    )
  );
});


// ============================================================
// UPDATE PRODUCT
// ============================================================

const updateProduct = asyncHandler(async (req, res) => {

  const {
    name,
    slug,
    description,
    price,
    discountPrice,
    images,
    category,
    stock,
    sizes,
    badge,
    saleStartDate,
    saleEndDate,
    fabricCare,
  } = req.body;


  // ----------------------------------------------------------
  // FIND PRODUCT
  // ----------------------------------------------------------

  const existingProduct =
    await Product.findById(
      req.params.id
    );


  if (!existingProduct) {
    throw new ApiError(
      404,
      "Product not found"
    );
  }


  // ----------------------------------------------------------
  // PRICE VALIDATION
  // ----------------------------------------------------------

  if (
    price !== undefined &&
    (
      Number(price) <= 0 ||
      !Number.isFinite(Number(price))
    )
  ) {
    throw new ApiError(
      400,
      "Price must be greater than 0"
    );
  }


  // Get final price for validation
  const finalPrice =
    price !== undefined
      ? Number(price)
      : Number(existingProduct.price);


  if (
    discountPrice !== undefined &&
    discountPrice !== null &&
    discountPrice !== ""
  ) {

    if (
      Number(discountPrice) <= 0 ||
      Number(discountPrice) >= finalPrice
    ) {
      throw new ApiError(
        400,
        "Discount price must be greater than 0 and less than the original price"
      );
    }

  }


  // ----------------------------------------------------------
  // STOCK VALIDATION
  // ----------------------------------------------------------

  if (
    stock !== undefined &&
    (
      Number(stock) < 0 ||
      !Number.isInteger(Number(stock))
    )
  ) {
    throw new ApiError(
      400,
      "Stock must be a valid non-negative integer"
    );
  }


  // ----------------------------------------------------------
  // SLUG VALIDATION
  // ----------------------------------------------------------

  if (slug !== undefined) {

    const duplicateSlug =
      await Product.findOne({
        slug: slug.trim(),
        _id: {
          $ne: req.params.id,
        },
      });


    if (duplicateSlug) {
      throw new ApiError(
        409,
        "A product with this slug already exists"
      );
    }

  }


  // ----------------------------------------------------------
  // BUILD UPDATE
  // ----------------------------------------------------------

  const updateData = {};


  if (name !== undefined) {
    updateData.name =
      name.trim();
  }


  if (slug !== undefined) {
    updateData.slug =
      slug.trim();
  }


  if (description !== undefined) {
    updateData.description =
      description.trim();
  }


  if (price !== undefined) {
    updateData.price =
      Number(price);
  }


  if (discountPrice !== undefined) {

    updateData.discountPrice =
      discountPrice === ""
        ? undefined
        : Number(discountPrice);

  }


  if (images !== undefined) {

    updateData.images =
      Array.isArray(images)
        ? images
        : [];

  }


  if (category !== undefined) {
    updateData.category =
      category;
  }


  if (stock !== undefined) {
    updateData.stock =
      Number(stock);
  }


  if (sizes !== undefined) {

    updateData.sizes =
      Array.isArray(sizes)
        ? sizes
        : [];

  }


  if (badge !== undefined) {
    updateData.badge =
      badge;
  }


  if (saleStartDate !== undefined) {

    updateData.saleStartDate =
      saleStartDate || undefined;

  }


  if (saleEndDate !== undefined) {

    updateData.saleEndDate =
      saleEndDate || undefined;

  }


  if (fabricCare !== undefined) {

    updateData.fabricCare =
      fabricCare.trim();

  }


  // ----------------------------------------------------------
  // UPDATE
  // ----------------------------------------------------------

  const updatedProduct =
    await Product.findByIdAndUpdate(
      req.params.id,

      {
        $set: updateData,
      },

      {
        new: true,
        runValidators: true,
      }
    ).populate(
      "category",
      "name slug"
    );


  if (!updatedProduct) {
    throw new ApiError(
      404,
      "Product not found"
    );
  }


  // ----------------------------------------------------------
  // ENRICH RESPONSE
  // ----------------------------------------------------------

  const enrichedProduct =
    enrichProduct(updatedProduct);


  return res.status(200).json(
    new ApiResponse(
      200,
      enrichedProduct,
      "Product updated"
    )
  );
});


// ============================================================
// DELETE PRODUCT
// ============================================================

const deleteProduct = asyncHandler(async (req, res) => {

  const product =
    await Product.findByIdAndDelete(
      req.params.id
    );


  if (!product) {
    throw new ApiError(
      404,
      "Product not found"
    );
  }


  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Product deleted"
    )
  );
});


// ============================================================
// EXPORT
// ============================================================

export {
  createProduct,
  getAllProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};