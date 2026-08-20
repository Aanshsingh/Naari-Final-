// controllers/banner.controller.js
import { Banner } from "../models/Banner.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const createBanner = asyncHandler(async (req, res) => {
  const { title, image, link, position, order } = req.body;

  if (!image) throw new ApiError(400, "Banner image is required");

  const banner = await Banner.create({ title, image, link, position, order });
  return res.status(201).json(new ApiResponse(201, banner, "Banner created"));
});

const getActiveBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
  return res.status(200).json(new ApiResponse(200, banners, "Banners fetched"));
});

const getAllBannersAdmin = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ order: 1 });
  return res.status(200).json(new ApiResponse(200, banners, "Banners fetched"));
});

const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!banner) throw new ApiError(404, "Banner not found");
  return res.status(200).json(new ApiResponse(200, banner, "Banner updated"));
});

const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) throw new ApiError(404, "Banner not found");
  return res.status(200).json(new ApiResponse(200, {}, "Banner deleted"));
});

export { createBanner, getActiveBanners, getAllBannersAdmin, updateBanner, deleteBanner };