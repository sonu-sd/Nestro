import express from "express"
import {read,readById,create,updateStatus,edit,deleteById} from "../controllers/room.controller.js"
import  upload  from "../middleware/upload.js";
import {protect,authorized} from "../middleware/auth.js"
const router = express.Router()

router.get("/", read);

router.get("/:id", readById);
router.post("/create", upload.single("image"),protect,authorized("admin","superadmin"), create);
router.patch("/status-update/:id",protect,authorized("admin","superadmin"),updateStatus);
router.put("/edit/:id",upload.single("image"),protect,authorized("admin","superadmin"),edit);
router.delete("/delete/:id",protect,authorized("admin","superadmin"),deleteById)


export default router   