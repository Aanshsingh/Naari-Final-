import { Router } from "express";

import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryBySlug ,
} from "../Controllers/Category.Controller.js";

import { verifyJWT,verifyAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(getAllCategories);                                    // public
router.route("/").post(verifyJWT, verifyAdmin, createCategory);             // admin only
router.route("/:id").patch(verifyJWT, verifyAdmin, updateCategory);         // admin only
router.route("/:id").delete(verifyJWT, verifyAdmin, deleteCategory);        // admin only
router.route("/slug/:slug").get(getCategoryBySlug);

export default router;
