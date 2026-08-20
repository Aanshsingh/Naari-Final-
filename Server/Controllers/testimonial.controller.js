// controllers/testimonial.controller.js
import { Testimonial } from "../models/Testimonial.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const submitTestimonial = asyncHandler(async (req, res) => {
  const { name, email, message, rating } = req.body;

  if (!name || !email || !message) {
    throw new ApiError(400, "Name, email, and message are required");
  }

  const testimonial = await Testimonial.create({ name, email, message, rating, isApproved: false });
  return res.status(201).json(new ApiResponse(201, testimonial, "Thank you — your comment is pending review"));
});

const getApprovedTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 }).limit(10);
  return res.status(200).json(new ApiResponse(200, testimonials, "Testimonials fetched"));
});

const getAllTestimonialsAdmin = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status === "pending") filter.isApproved = false;
  if (status === "approved") filter.isApproved = true;

  const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, testimonials, "Testimonials fetched"));
});

const approveTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  if (!testimonial) throw new ApiError(404, "Testimonial not found");
  return res.status(200).json(new ApiResponse(200, testimonial, "Testimonial approved"));
});

const rejectTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) throw new ApiError(404, "Testimonial not found");
  return res.status(200).json(new ApiResponse(200, {}, "Testimonial rejected and removed"));
});

export {
  submitTestimonial,
  getApprovedTestimonials,
  getAllTestimonialsAdmin,
  approveTestimonial,
  rejectTestimonial,
};

