import express from "express";

import { register,otpVerify,resendOtp, login,getMe,updateProfile,getAddresses,  addAddress,updateAddress,deleteAddress,setDefaultAddress,changePassword, logout,
} from "../controllers/user.controller.js";

import { protect } from "../middleware/auth.js";
import { authRateLimit, otpRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();


// Auth
router.post("/register", authRateLimit, register);
router.post("/otp_verify", otpRateLimit, otpVerify);
router.post("/resend-otp", otpRateLimit, resendOtp);
router.post("/login", authRateLimit, login);
router.post("/logout", logout);


// Profile
router.get("/get-me", protect, getMe);
router.put("/update-profile", protect, updateProfile);


// Addresses
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);
router.put("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);
router.patch(
    "/addresses/:addressId/default",protect,setDefaultAddress
);


// Password
router.put("/change-password",protect,changePassword
);

export default router;
