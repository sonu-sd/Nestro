import express from "express"
import { Orderplace, read } from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.js";


const router = express.Router()

router.post("/create",protect,Orderplace)
router.get("/",read)


export default router