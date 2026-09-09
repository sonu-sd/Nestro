import userModel from "../models/user.model.js";

import {
    sendBadRequest,
    sendConflict,
    sendNotFound,
    sendServerError,
    sendSuccess,
} from "../utils/response.js";

import Cryptr from "cryptr";
import sendOtpMail from "../utils/sendOtpmail.js";
import jwt from "jsonwebtoken";

const cryptr = new Cryptr(process.env.SECRET_KEY);


// ======================================================
// REGISTER
// ======================================================

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (user) {
            return sendConflict(res, "Email already exist");
        }

        const encryptedpass = cryptr.encrypt(password);

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = Date.now() + 2 * 60 * 1000;

        const newUser = await userModel.create({
            name,
            email,
            password: encryptedpass,
            otp,
            otpExpire,
        });

        await sendOtpMail(email, otp);

        return res.status(201).json({
            message: "User account create successfully",
            success: true,
            email: newUser.email,
        });

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};


// ======================================================
// OTP VERIFY
// ======================================================

export const otpVerify = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return sendConflict(res, "Account not registered");
        }

        if (user.isVerified === true) {
            return sendBadRequest(res, "Account already verified");
        }

        if (String(user.otp) !== String(otp)) {
            return sendBadRequest(res, "Invalid OTP");
        }

        if (user.otpExpire < Date.now()) {
            return sendBadRequest(res, "OTP expired");
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        return sendSuccess(res, "OTP verified successfully");

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};


// ======================================================
// LOGIN
// ======================================================

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return sendNotFound(res, "User not found");
        }

        if (!user.isVerified) {
            return sendBadRequest(
                res,
                "Please verify your email first"
            );
        }

        if (!user.status) {
            return sendBadRequest(
                res,
                "Your account is disabled"
            );
        }

        const decryptedpass = cryptr.decrypt(user.password);

        if (password !== decryptedpass) {
            return sendBadRequest(
                res,
                "Invalid email or password"
            );
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "30d",
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return sendSuccess(res, "Login Successfully");

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};


// ======================================================
// GET MY PROFILE
// ======================================================

export const getMe = async (req, res) => {
    try {
        const user = await userModel
            .findById(req.user.id)
            .select("-password -otp -otpExpire");

        if (!user) {
            return sendNotFound(res, "User not found");
        }

        return res.status(200).json({
            success: true,
            message: "User data found",
            user,
        });

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};


// ======================================================
// UPDATE PROFILE
// ======================================================

export const updateProfile = async (req, res) => {
    try {
        const { name, mobile } = req.body;

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return sendNotFound(res, "User not found");
        }

        if (name !== undefined) {
            user.name = name;
        }

        if (mobile !== undefined) {
            user.mobile = mobile;
        }

        await user.save();

        const updatedUser = await userModel
            .findById(user._id)
            .select("-password -otp -otpExpire");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};


// ======================================================
// GET ADDRESSES
// ======================================================

export const getAddresses = async (req, res) => {
    try {
        const user = await userModel
            .findById(req.user.id)
            .select("adresses");

        if (!user) {
            return sendNotFound(res, "User not found");
        }

        return res.status(200).json({
            success: true,
            message: "Addresses found successfully",
            addresses: user.adresses,
        });

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};


// ======================================================
// ADD ADDRESS
// ======================================================

export const addAddress = async (req, res) => {
    try {
        const {
            fullName,
            mobile,
            pincode,
            adressLine,
            city,
            state,
            country,
            isDefault,
        } = req.body;

        if (
            !fullName ||
            !mobile ||
            !pincode ||
            !adressLine ||
            !city ||
            !state
        ) {
            return sendBadRequest(
                res,
                "All address fields are required"
            );
        }

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return sendNotFound(res, "User not found");
        }

        // First address automatically default
        const makeDefault =
            user.adresses.length === 0
                ? true
                : Boolean(isDefault);

        // If new address is default,
        // remove default from old addresses
        if (makeDefault) {
            user.adresses.forEach((address) => {
                address.isDefault = false;
            });
        }

        user.adresses.push({
            fullName,
            mobile,
            pincode,
            adressLine,
            city,
            state,
            country: country || "india",
            isDefault: makeDefault,
        });

        await user.save();

        return res.status(201).json({
            success: true,
            message: "Address added successfully",
            addresses: user.adresses,
        });

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};


// ======================================================
// UPDATE ADDRESS
// ======================================================

export const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const {
            fullName,
            mobile,
            pincode,
            adressLine,
            city,
            state,
            country,
            isDefault,
        } = req.body;

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return sendNotFound(res, "User not found");
        }

        const address = user.adresses.id(addressId);

        if (!address) {
            return sendNotFound(res, "Address not found");
        }

        if (fullName !== undefined) {
            address.fullName = fullName;
        }

        if (mobile !== undefined) {
            address.mobile = mobile;
        }

        if (pincode !== undefined) {
            address.pincode = pincode;
        }

        if (adressLine !== undefined) {
            address.adressLine = adressLine;
        }

        if (city !== undefined) {
            address.city = city;
        }

        if (state !== undefined) {
            address.state = state;
        }

        if (country !== undefined) {
            address.country = country;
        }

        if (isDefault === true) {
            user.adresses.forEach((item) => {
                item.isDefault = false;
            });

            address.isDefault = true;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            addresses: user.adresses,
        });

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};


// ======================================================
// DELETE ADDRESS
// ======================================================

export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return sendNotFound(res, "User not found");
        }

        const address = user.adresses.id(addressId);

        if (!address) {
            return sendNotFound(res, "Address not found");
        }

        const wasDefault = address.isDefault;

        address.deleteOne();

        // If deleted address was default,
        // make first remaining address default
        if (wasDefault && user.adresses.length > 0) {
            user.adresses[0].isDefault = true;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully",
            addresses: user.adresses,
        });

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};


// ======================================================
// SET DEFAULT ADDRESS
// ======================================================

export const setDefaultAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return sendNotFound(res, "User not found");
        }

        const address = user.adresses.id(addressId);

        if (!address) {
            return sendNotFound(res, "Address not found");
        }

        user.adresses.forEach((item) => {
            item.isDefault = false;
        });

        address.isDefault = true;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Default address updated successfully",
            addresses: user.adresses,
        });

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};


// ======================================================
// CHANGE PASSWORD
// ======================================================

export const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword,
        } = req.body;

        if (!currentPassword || !newPassword) {
            return sendBadRequest(
                res,
                "Current password and new password are required"
            );
        }

        if (newPassword.length < 6) {
            return sendBadRequest(
                res,
                "New password must be at least 6 characters"
            );
        }

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return sendNotFound(res, "User not found");
        }

        const decryptedPassword =
            cryptr.decrypt(user.password);

        if (currentPassword !== decryptedPassword) {
            return sendBadRequest(
                res,
                "Current password is incorrect"
            );
        }

        user.password = cryptr.encrypt(newPassword);

        await user.save();

        return sendSuccess(
            res,
            "Password changed successfully"
        );

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};


// ======================================================
// LOGOUT
// ======================================================

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return sendSuccess(
            res,
            "Logout successfully"
        );

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};