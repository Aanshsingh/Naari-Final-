// routes/testimonial.routes.js
import { Router } from "express";
import {
  submitTestimonial,
  getApprovedTestimonials,
  getAllTestimonialsAdmin,
  approveTestimonial,
  rejectTestimonial,
} from "../Controllers/testimonial.controller.js";
import { verifyJWT, verifyAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(getApprovedTestimonials); // public — homepage reads this
router.route("/").post(submitTestimonial); // public — no login required to leave a comment
router.route("/admin/all").get(verifyJWT, verifyAdmin, getAllTestimonialsAdmin);
router.route("/admin/:id/approve").patch(verifyJWT, verifyAdmin, approveTestimonial);
router.route("/admin/:id/reject").delete(verifyJWT, verifyAdmin, rejectTestimonial);

export default router;
