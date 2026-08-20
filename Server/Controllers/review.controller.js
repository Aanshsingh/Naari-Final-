// controllers/review.controller.js
import { Review } from "../models/Review.model.js";
import { Product } from "../models/Product.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  if (!rating) throw new ApiError(400, "Rating is required");

  const existing = await Review.findOne({ product: productId, user: req.user._id });
  if (existing) throw new ApiError(409, "You've already reviewed this product");

  const review = await Review.create({
    product: productId, user: req.user._id, rating, comment, isApproved: false,
  });

  return res.status(201).json(new ApiResponse(201, review, "Review submitted, pending approval"));
});

const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, isApproved: true })
    .populate("user", "name")
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched"));
});

const getAllReviewsAdmin = asyncHandler(async (req, res) => {
  const { status } = req.query; // "pending" | "approved" | undefined (all)
  const filter = {};
  if (status === "pending") filter.isApproved = false;
  if (status === "approved") filter.isApproved = true;

  const reviews = await Review.find(filter)
    .populate("user", "name email")
    .populate("product", "name slug")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched"));
});

const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  if (!review) throw new ApiError(404, "Review not found");

  await recalculateProductRating(review.product);
  return res.status(200).json(new ApiResponse(200, review, "Review approved"));
});

const rejectReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw new ApiError(404, "Review not found");
  return res.status(200).json(new ApiResponse(200, {}, "Review rejected and removed"));
});

// keeps Product.ratingsAverage/numReviews in sync whenever a review is approved
async function recalculateProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  await Product.findByIdAndUpdate(productId, {
    ratingsAverage: stats[0]?.avg || 0,
    numReviews: stats[0]?.count || 0,
  });
}

export { createReview, getProductReviews, getAllReviewsAdmin, approveReview, rejectReview };