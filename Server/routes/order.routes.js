// routes/order.routes.js
import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getMyOrder,
  updateOrderStatus,
  getAllOrdersAdmin,
  getOrderStats,
  getSalesOverview,
} from "../Controllers/order.controller.js"
import { verifyJWT, verifyAdmin} from "../middleware/auth.middleware.js";

const router = Router();
router.route("/mine").get(verifyJWT, getMyOrder);
router.route("/:id").get(verifyJWT, getOrderById);
router.route("/").post(verifyJWT, createOrder);
router.route("/admin/all").get(verifyJWT, verifyAdmin, getAllOrdersAdmin);
router.route("/admin/:id/status").patch(verifyJWT, verifyAdmin, updateOrderStatus);
router.route("/admin/stats").get(verifyJWT, verifyAdmin, getOrderStats);

export default router;