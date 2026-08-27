// models/InstagramPost.model.js
import mongoose, { Schema } from "mongoose";

const instagramPostSchema = new Schema(
  {
    mediaType: { type: String, enum: ["image", "video"], default: "video" }, // reels are video by default now
    thumbnail: { type: String }, // shown briefly while video loads, optional
    video: { type: String },     // the actual reel file
    image: { type: String },     // fallback for a static post, if she ever wants one
    productLink: { type: String, required: true }, // "goes to that product" — required per her request
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export const InstagramPost = mongoose.model("InstagramPost", instagramPostSchema);

