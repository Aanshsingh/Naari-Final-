// routes/review.routes.js
import { Router } from "express";
import {
  createReview, getProductReviews, getAllReviewsAdmin, approveReview, rejectReview,
} from "../controllers/review.controller.js";
import { verifyJWT, verifyAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/product/:productId").get(getProductReviews); // public
router.route("/product/:productId").post(verifyJWT, createReview); // logged-in customers
router.route("/admin/all").get(verifyJWT, verifyAdmin, getAllReviewsAdmin);
router.route("/admin/:id/approve").patch(verifyJWT, verifyAdmin, approveReview);
router.route("/admin/:id/reject").delete(verifyJWT, verifyAdmin, rejectReview);

export default router;