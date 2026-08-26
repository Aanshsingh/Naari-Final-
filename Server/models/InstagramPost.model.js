// models/InstagramPost.model.js
import mongoose, { Schema } from "mongoose";

const instagramPostSchema = new Schema(
  {
    image: { type: String, required: true },
    reelUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const InstagramPost = mongoose.model("InstagramPost", instagramPostSchema);

