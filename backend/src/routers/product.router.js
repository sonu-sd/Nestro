import express from "express"
import {read,readById,create,updateStatus,edit,deleteById,updateFlag,addImages} from "../controllers/product.controller.js"
import upload from "../middleware/upload.js";
import { authorized, protect } from "../middleware/auth.js";
const router = express.Router()

router.get("/", read);
router.get("/:id", readById);
router.post("/create", upload.single("thumbnail"),protect,authorized("admin","superadmin"), create);
router.patch("/status-update/:id",protect,authorized("admin","superadmin"),updateStatus);
router.put("/edit/:id",upload.single("image"),protect,authorized("admin","superadmin"), edit);
router.delete("/delete/:id",protect,authorized("admin","superadmin"), deleteById)
router.patch("/update-flag/:id", protect,authorized("admin","superadmin"), updateFlag)
router.post("/add_images/:id",upload.array("images",6),protect,authorized("admin","superadmin"), addImages);

export default router   