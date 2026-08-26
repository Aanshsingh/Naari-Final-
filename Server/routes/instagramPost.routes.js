// routes/instagramPost.routes.js
import { Router } from "express";
import { createPost, getActivePosts, getAllPostsAdmin, deletePost } from "../Controllers/instagramPost.controller.js";
import { verifyJWT, verifyAdmin } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/").get(getActivePosts);
router.route("/admin/all").get(verifyJWT, verifyAdmin, getAllPostsAdmin);
router.route("/").post(verifyJWT, verifyAdmin, createPost);
router.route("/:id").delete(verifyJWT, verifyAdmin, deletePost);

export default router;