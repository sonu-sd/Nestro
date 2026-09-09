import express from "express";

import { sync,getCart} from "../controllers/cart.controller.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();


// Auth
router.post("/sync",protect,sync);
router.get("/",protect, getCart);

export default router;