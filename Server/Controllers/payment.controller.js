import Razorpay from "razorpay";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/Order.model.js";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findOne({ _id: orderId, user: req.user._id });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  if (order.paymentInfo.status === "paid") {
    throw new ApiError(400, "order paid already");
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.totalPrice * 100),
    currency: "INR",
    receipt: order._id.toString(),
  });

  order.paymentInfo.razorpayOrderId = razorpayOrder.id;
  order.paymentInfo.method = "razorpay";
  await order.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID, // public key, safe to send to frontend
      },
      "Razorpay order created",
    ),
  );
});

const VerifyPayment = asyncHandler(async (req, res) => {
  console.log("========== VERIFY PAYMENT ==========");
  console.log("BODY:", req.body);

  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  console.log("orderId:", orderId);
  console.log("razorpay_order_id:", razorpay_order_id);
  console.log("razorpay_payment_id:", razorpay_payment_id);
  console.log("razorpay_signature:", razorpay_signature);

  if (
    !orderId ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    throw new ApiError(
      400,
      "Payment verification data is incomplete"
    );
  }

  const expectedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(
      `${razorpay_order_id}|${razorpay_payment_id}`
    )
    .digest("hex");

  console.log("EXPECTED:", expectedSignature);
  console.log("RECEIVED:", razorpay_signature);

  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(
      400,
      "Invalid payment signature"
    );
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.paymentInfo.status = "paid";
  order.paymentInfo.razorpayOrderId = razorpay_order_id;
  order.paymentInfo.razorpayPaymentId = razorpay_payment_id;

  order.orderStatus = "placed";

  await order.save();

  console.log("PAYMENT VERIFIED SUCCESSFULLY");

  return res.status(200).json(
    new ApiResponse(
      200,
      order,
      "Payment verified successfully"
    )
  );
});

const razorpayWebhook = asyncHandler(async(req,res)=>{
  const signature = req.headers["x-razorpay-signature"];

  const expectedSignature = crypto
  .createHmac("sha256",process.env.RAZORPAY_WEBHOOK_SECRET)
  .update(req.body)
  .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({ success: false, message: "Invalid webhook signature" });
  }

  const payload = JSON.parse(req.body);

  if (payload.event === "payment.captured") {
    const razorpayOrderId = payload.payload.payment.entity.order_id;
    const paymentId = payload.payload.payment.entity.id;

    // idempotent update — only touches orders still pending, so a retried webhook can't double-process
    await Order.findOneAndUpdate(
      { "paymentInfo.razorpayOrderId": razorpayOrderId, "paymentInfo.status": "pending" },
      {
        "paymentInfo.status": "paid",
        "paymentInfo.transactionId": paymentId,
        orderStatus: "processing",
      }
    );
  }

  return res.status(200).json({ received: true });
})

export { createRazorpayOrder, VerifyPayment, razorpayWebhook  };
