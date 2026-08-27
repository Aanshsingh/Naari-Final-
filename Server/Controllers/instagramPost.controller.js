// controllers/instagramPost.controller.js
import { InstagramPost } from "../models/InstagramPost.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPost = asyncHandler(async (req, res) => {
  const { mediaType, video, image, productLink, order } = req.body;

  if (!productLink) throw new ApiError(400, "This reel must link to a product");
  if (mediaType === "video" && !video) throw new ApiError(400, "Video is required");
  if (mediaType === "image" && !image) throw new ApiError(400, "Image is required");

  const post = await InstagramPost.create({ mediaType, video, image, productLink, order });
  return res.status(201).json(new ApiResponse(201, post, "Reel added"));
});

const getActivePosts = asyncHandler(async (req, res) => {
  const posts = await InstagramPost.find({ isActive: true }).sort({ order: 1 }).limit(4);
  return res.status(200).json(new ApiResponse(200, posts, "Posts fetched"));
});

const getAllPostsAdmin = asyncHandler(async (req, res) => {
  const posts = await InstagramPost.find().sort({ order: 1 });
  return res.status(200).json(new ApiResponse(200, posts, "Posts fetched"));
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await InstagramPost.findByIdAndDelete(req.params.id);
  if (!post) throw new ApiError(404, "Post not found");
  return res.status(200).json(new ApiResponse(200, {}, "Post deleted"));
});

export { createPost, getActivePosts, getAllPostsAdmin, deletePost };

