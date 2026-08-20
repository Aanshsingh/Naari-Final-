import mongoose from "mongoose";
import { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
        },
        note: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        image: String,
        price: Number,
        qty: Number,
        size: String,
      },
    ],
    shippingAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
    },
    paymentInfo: {
      method: { type: String, enum: ["razorpay", "stripe"] },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      transactionId: String,
    },
    itemsPrice: Number,
    shippingPrice: Number,
    totalPrice: Number,
    orderStatus: {
      type: String,
      enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
