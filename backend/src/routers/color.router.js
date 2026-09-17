import express from "express";
import { read, readAdmin, create, edit, updateStatus } from "../controllers/color.controller.js";
import { protect, authorized } from "../middleware/auth.js";

const router = express.Router();
router.get("/", read);
router.get("/admin", protect, authorized("admin", "superAdmin"), readAdmin);
router.post("/create", protect, authorized("admin", "superAdmin"), create);
router.put("/edit/:id", protect, authorized("admin", "superAdmin"), edit);
router.patch("/status-update/:id", protect, authorized("admin", "superAdmin"), updateStatus);
export default router;
