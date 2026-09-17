import express from "express";
import { cancelMyOrder, createOnlineOrder, getAdminOrders, getMyOrderById, getMyOrders, placeOrder, updateAdminOrder, verifyOnlinePayment } from "../controllers/order.controller.js";
import { authorized, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.post("/online", protect, createOnlineOrder);
router.post("/online/verify", protect, verifyOnlinePayment);
router.get("/admin", protect, authorized("admin", "superAdmin"), getAdminOrders);
router.patch("/admin/:id", protect, authorized("admin", "superAdmin"), updateAdminOrder);
router.get("/my", protect, getMyOrders);
router.get("/my/:id", protect, getMyOrderById);
router.post("/my/:id/cancel", protect, cancelMyOrder);

export default router;
