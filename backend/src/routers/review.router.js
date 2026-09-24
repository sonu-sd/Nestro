import express from "express";
import { authorized, protect } from "../middleware/auth.js";
import {
  publicReviews,
  createReview,
  myReviews,
  adminReviews,
  moderateReview,
} from "../controllers/review.controller.js";

const router = express.Router();
router.get("/", publicReviews);
router.get("/mine", protect, myReviews);
router.get("/admin", protect, authorized("admin", "superAdmin"), adminReviews);
router.post("/", protect, authorized("user"), createReview);
router.patch(
  "/admin/:id",
  protect,
  authorized("admin", "superAdmin"),
  moderateReview,
);
export default router;
