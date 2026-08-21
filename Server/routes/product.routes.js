// routes/product.routes.js
import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} from "../Controllers/product.Controller.js";
import { verifyJWT, verifyAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(getAllProducts);
router.route("/:slug").get(getProductBySlug);
router.route("/").post(verifyJWT, verifyAdmin, createProduct);
router.route("/:id").patch(verifyJWT, verifyAdmin, updateProduct);
router.route("/:id").delete(verifyJWT, verifyAdmin, deleteProduct);

export default router;
