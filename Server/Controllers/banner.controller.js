// controllers/banner.controller.js

import { Banner } from "../models/Banner.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// =====================================================
// CREATE BANNER
// =====================================================

const createBanner = asyncHandler(async (req, res) => {

  const {
    title,
    subtitle,
    buttonText,
    mediaType,
    image,
    video,
    link,
    position,
    order,
    isActive,
  } = req.body;


  // Validate media
  if (mediaType === "video" && !video) {
    throw new ApiError(
      400,
      "Video is required for a video banner"
    );
  }

  if (mediaType !== "video" && !image) {
    throw new ApiError(
      400,
      "Image is required"
    );
  }


  const banner = await Banner.create({
    title,
    subtitle,
    buttonText,
    mediaType,
    image,
    video,
    link,
    position,
    order,
    isActive,
  });


  return res.status(201).json(
    new ApiResponse(
      201,
      banner,
      "Banner created successfully"
    )
  );
});


// =====================================================
// GET ACTIVE BANNERS
// =====================================================

const getActiveBanners = asyncHandler(async (req, res) => {

  const banners = await Banner.find({
    isActive: true,
  }).sort({
    order: 1,
  });


  return res.status(200).json(
    new ApiResponse(
      200,
      banners,
      "Banners fetched successfully"
    )
  );
});


// =====================================================
// GET ALL BANNERS - ADMIN
// =====================================================

const getAllBannersAdmin = asyncHandler(async (req, res) => {

  const banners = await Banner.find()
    .sort({
      order: 1,
    });


  return res.status(200).json(
    new ApiResponse(
      200,
      banners,
      "Banners fetched successfully"
    )
  );
});


// =====================================================
// UPDATE BANNER
// =====================================================

const updateBanner = asyncHandler(async (req, res) => {

  const {
    title,
    subtitle,
    buttonText,
    mediaType,
    image,
    video,
    link,
    position,
    order,
    isActive,
  } = req.body;


  // Validate media when updating
  if (mediaType === "video" && !video) {
    throw new ApiError(
      400,
      "Video is required for a video banner"
    );
  }

  if (mediaType === "image" && !image) {
    throw new ApiError(
      400,
      "Image is required for an image banner"
    );
  }


  const banner = await Banner.findByIdAndUpdate(
    req.params.id,
    {
      title,
      subtitle,
      buttonText,
      mediaType,
      image,
      video,
      link,
      position,
      order,
      isActive,
    },
    {
      new: true,
      runValidators: true,
    }
  );


  if (!banner) {
    throw new ApiError(
      404,
      "Banner not found"
    );
  }


  return res.status(200).json(
    new ApiResponse(
      200,
      banner,
      "Banner updated successfully"
    )
  );
});


// =====================================================
// DELETE BANNER
// =====================================================

const deleteBanner = asyncHandler(async (req, res) => {

  const banner = await Banner.findByIdAndDelete(
    req.params.id
  );


  if (!banner) {
    throw new ApiError(
      404,
      "Banner not found"
    );
  }


  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Banner deleted successfully"
    )
  );
});


export {
  createBanner,
  getActiveBanners,
  getAllBannersAdmin,
  updateBanner,
  deleteBanner,
};