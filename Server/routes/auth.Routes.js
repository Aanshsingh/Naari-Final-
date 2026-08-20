import { Router } from "express";
import {
  registerUser,
  login,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,resendVerificationEmail,
  verifyEmail,
} from "../Controllers/auth.Controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js";

const router = Router();

// public routes
router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/refresh-token").post(refreshAccessToken);

// secured routes — verifyJWT runs first
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
// auth.routes.js — add these
router.route("/verify-email/:token").get(verifyEmail); // public — clicked from email, no auth yet
router.route("/resend-verification").post(verifyJWT, resendVerificationEmail); // must be logged in

export default router;