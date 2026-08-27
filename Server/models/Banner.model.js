// models/Banner.model.js
import mongoose, { Schema } from "mongoose";

const bannerSchema = new Schema(
  {
    title: {
      type: String,
      default: "",
    },

    subtitle: {
      type: String,
      default: "",
    },

    buttonText: {
      type: String,
      default: "",
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },

    image: {
      type: String,
      default: "",
    },

    video: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "/shop",
    },

    position: {
      type: String,
      enum: ["hero", "mid-page", "footer"],
      default: "hero",
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Banner = mongoose.model("Banner", bannerSchema);