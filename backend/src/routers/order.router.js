import express from "express";
import { getMyOrderById, getMyOrders, placeOrder } from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);
router.get("/my/:id", protect, getMyOrderById);

export default router;
