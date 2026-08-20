// models/Testimonial.model.js
import mongoose, { Schema } from "mongoose";

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    message: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model("Testimonial", testimonialSchema);