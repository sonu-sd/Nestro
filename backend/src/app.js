import crypto from "crypto";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import categoryRouter from "./routers/category.router.js";
import roomRouter from "./routers/room.router.js";
import productRouter from "./routers/product.router.js";
import userRouter from "./routers/user.router.js";
import cartRouter from "./routers/cart.router.js";
import orderRouter from "./routers/order.router.js";
import colorRouter from "./routers/color.router.js";
import { isDatabaseReady } from "./config/env.js";

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",").map((origin) => origin.trim()).filter(Boolean);
const app = express();

app.set("trust proxy", 1);
app.use((req, res, next) => { req.requestId = crypto.randomUUID(); res.setHeader("X-Request-Id", req.requestId); next(); });
app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-8", legacyHeaders: false, message: { success: false, message: "Too many requests. Please try again later." } }));
app.get("/api/health", (req, res) => res.status(200).json({ success: true, status: "ok", requestId: req.requestId }));
app.get("/api/ready", (req, res) => { const ready = isDatabaseReady(mongoose); return res.status(ready ? 200 : 503).json({ success: ready, status: ready ? "ready" : "not_ready", requestId: req.requestId }); });
app.use("/api/category", categoryRouter);
app.use("/api/room-type", roomRouter);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/color", colorRouter);
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found", requestId: req.requestId }));
app.use((error, req, res, next) => {
    console.error(JSON.stringify({ level: "error", requestId: req.requestId, method: req.method, path: req.originalUrl, message: error.message }));
    if (error.name === "MulterError") {
        const message = error.code === "LIMIT_FILE_SIZE" ? "Image must be 5 MB or smaller" : "Only JPG, PNG, and WebP images are allowed";
        return res.status(400).json({ success: false, message, requestId: req.requestId });
    }
    return res.status(500).json({ success: false, message: "Internal server error", requestId: req.requestId });
});

export default app;
