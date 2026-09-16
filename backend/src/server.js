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

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);


// midlewere
server.use(cors({ origin: allowedOrigins, credentials: true }))
server.use(cookieParser())
server.use(express.json());
server.use(express.urlencoded({extended:true}));

server.get("/api/health", (req, res) => {
    res.status(200).json({ success: true, message: "Nestro API is healthy" });
});



server.use("/api/category", categoryRouter)
server.use("/api/room-type", roomRouter)
server.use("/api/product", productRouter)
server.use("/api/user", userRouter)
server.use("/api/cart", cartRouter)
server.use("/api/order",orderRouter)

server.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

server.use((error, req, res, next) => {
    console.error(error);
    if (error.name === "MulterError") {
        const message = error.code === "LIMIT_FILE_SIZE"
            ? "Image must be 5 MB or smaller"
            : "Only JPG, PNG, and WebP images are allowed";
        return res.status(400).json({ success: false, message });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
});

// server run 
const PORT = process.env.PORT
server.listen(PORT, () => {
    console.log(`server runing on port ${PORT}`)
})

