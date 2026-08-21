// routes/contact.routes.js
import { Router } from "express";
import { submitContactForm } from "../Controllers/contact.controller.js";

const router = Router();
router.route("/").post(submitContactForm); // public — no login required to contact the store

export default router;
