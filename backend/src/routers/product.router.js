import express from "express";
import {
  read,
  readAdmin,
  readAdminById,
  readById,
  readBySlug,
  create,
  updateStatus,
  edit,
  deleteById,
  updateFlag,
  addImages,
} from "../controllers/product.controller.js";
import upload from "../middleware/upload.js";
import { authorized, protect } from "../middleware/auth.js";
const router = express.Router();

router.get("/", read);
router.get("/admin", protect, authorized("admin", "superAdmin"), readAdmin);
router.get(
  "/admin/:id",
  protect,
  authorized("admin", "superAdmin"),
  readAdminById,
);
router.get("/slug/:slug", readBySlug);
router.get("/:id", readById);
router.post(
  "/create",
  protect,
  authorized("admin", "superAdmin"),
  upload.single("thumbnail"),
  create,
);
router.patch(
  "/status-update/:id",
  protect,
  authorized("admin", "superAdmin"),
  updateStatus,
);
router.put(
  "/edit/:id",
  protect,
  authorized("admin", "superAdmin"),
  upload.single("image"),
  edit,
);
router.delete(
  "/delete/:id",
  protect,
  authorized("admin", "superAdmin"),
  deleteById,
);
router.patch(
  "/update-flag/:id",
  protect,
  authorized("admin", "superAdmin"),
  updateFlag,
);
router.post(
  "/add_images/:id",
  protect,
  authorized("admin", "superAdmin"),
  upload.array("images", 6),
  addImages,
);

export default router;
