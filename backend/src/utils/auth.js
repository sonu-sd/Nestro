import crypto from "crypto";
import jwt from "jsonwebtoken";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export const normalizeEmail = (email = "") => email.trim().toLowerCase();

export const createOtp = () => crypto.randomInt(100000, 1000000).toString();

export const hashOtp = (otp) =>
    crypto.createHash("sha256").update(String(otp)).digest("hex");

export const getOtpExpiry = () => {
    const ttlMinutes = Number(process.env.OTP_TTL_MINUTES || 10);
    return new Date(Date.now() + ttlMinutes * 60 * 1000);
};

export const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";
    const sameSite = process.env.COOKIE_SAME_SITE || (isProduction ? "none" : "lax");

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite,
        maxAge: SESSION_DURATION_MS,
    };
};

export const signSessionToken = (user) =>
    jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
