import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/Product.model.js";

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
  } = req.body;

  if (!name || !slug || !price || !category) {
    throw new ApiError(400, "Name, slug, price, and category are required");
  }

  const existing = await Product.findOne({ slug });
  if (existing) {
    throw new ApiError(409, "A product with this slug already exists");
  }

  const product = await Product.create({
    name,
    slug,
    description,
    price,
    discountPrice,
    images,
    category,
    stock,
    sizes,
  });

  return res.status(201).json(new ApiResponse(201, product, "Product created"));
});

const getAllProducts = asyncHandler(async (req, res) => {
  const { category, search="", sort, page = 1, limit = 12 } = req.query;
  const filter = {
    isActive: true,
  };

  if (category) {
    filter.category = category;
  }

  if (search?.trim()) {
  filter.$text = {
    $search: search,
  };
}

  const sortOptions = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
  };
  const sortBy = sortOptions[sort] || { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit))
      .populate("category", "name slug"),
    Product.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
      "Products fetched",
    ),
  );
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isActive: true,
  }).populate("category", "name slug");
  if (!product) throw new ApiError(404, "Product not found");
  return res.status(200).json(new ApiResponse(200, product, "Product fetched"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product) throw new ApiError(404, "Product not found");
  return res.status(200).json(new ApiResponse(200, product, "Product updated"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  return res.status(200).json(new ApiResponse(200, {}, "Product deleted"));
});

export {
  createProduct,
  getAllProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};
