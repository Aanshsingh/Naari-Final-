import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    images: [{ url: String, publicId: String }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, default: 0 },
    sizes: [{ label: String, stock: Number }],
    fabricCare: { type: String },
    badge: {
      type: String,
      enum: [
        "auto",
        "new",
        "sale",
        "bestseller",
        "limited",
        "sold-out",
        "none",
      ],
      default: "auto",
    },
    saleStartDate: { type: Date },
    saleEndDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.index({ name: "text", description: "text" });

export const Product = mongoose.model("Product", productSchema);
