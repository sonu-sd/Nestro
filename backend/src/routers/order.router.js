import express from "express";
import { createOnlineOrder, getMyOrderById, getMyOrders, placeOrder, verifyOnlinePayment } from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.post("/online", protect, createOnlineOrder);
router.post("/online/verify", protect, verifyOnlinePayment);
router.get("/my", protect, getMyOrders);
router.get("/my/:id", protect, getMyOrderById);

export default router;
