// routes/payment.routes.js
import { Router } from "express";
import { createRazorpayOrder, VerifyPayment } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/create-razorpay-order").post(verifyJWT, createRazorpayOrder);
router.route("/verify").post(verifyJWT, VerifyPayment);

export default router;

