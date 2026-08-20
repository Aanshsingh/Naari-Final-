// routes/banner.routes.js
import { Router } from "express";
import {
  createBanner, getActiveBanners, getAllBannersAdmin, updateBanner, deleteBanner,
} from "../controllers/banner.controller.js";
import { verifyJWT, verifyAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(getActiveBanners); // public — storefront homepage reads this
router.route("/admin/all").get(verifyJWT, verifyAdmin, getAllBannersAdmin);
router.route("/").post(verifyJWT, verifyAdmin, createBanner);
router.route("/:id").patch(verifyJWT, verifyAdmin, updateBanner);
router.route("/:id").delete(verifyJWT, verifyAdmin, deleteBanner);

export default router;
