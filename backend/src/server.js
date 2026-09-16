import dotenv from "dotenv"
import conectDb from "./config/db.js"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import categoryRouter from "./routers/category.router.js"
import roomRouter from "./routers/room.router.js"
import productRouter from "./routers/product.router.js"
import userRouter from "./routers/user.router.js"
import cartRouter from "./routers/cart.router.js"
import orderRouter from "./routers/order.router.js"



const server = express();

dotenv.config()  // .env ko load karega
conectDb()  // MongoDB se connect karega


// midlewere
server.use(cors({ origin: "http://localhost:3000", credentials: true }))
server.use(cookieParser())
server.use(express.json());
server.use(express.urlencoded({extended:true}));




server.use("/api/category", categoryRouter)
server.use("/api/room-type", roomRouter)
server.use("/api/product", productRouter)
server.use("/api/user", userRouter)
server.use("/api/cart", cartRouter)
server.use("/api/order",orderRouter)

// server run 
const PORT = process.env.PORT
server.listen(PORT, () => {
    console.log(`server runing on port ${PORT}`)
})

