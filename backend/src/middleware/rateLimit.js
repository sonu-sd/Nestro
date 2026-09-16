import rateLimit from "express-rate-limit";

const rateLimitMessage = (message) => ({
    success: false,
    message,
});

export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: rateLimitMessage("Too many attempts. Please try again in 15 minutes."),
});

export const otpRateLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 8,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: rateLimitMessage("Too many OTP attempts. Please try again later."),
});
