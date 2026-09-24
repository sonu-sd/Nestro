import userModel from "../models/user.model.js";

import {
  sendBadRequest,
  sendConflict,
  sendNotFound,
  sendServerError,
  sendSuccess,
} from "../utils/response.js";

import bcrypt from "bcryptjs";
import sendOtpMail from "../utils/sendOtpmail.js";
import {
  createOtp,
  getCookieClearOptions,
  getCookieOptions,
  getOtpExpiry,
  hashOtp,
  normalizeEmail,
  signSessionToken,
} from "../utils/auth.js";

const PASSWORD_MIN_LENGTH = 8;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

const validateCredentials = (
  { name, email, password },
  requireName = false,
) => {
  if ((requireName && !name?.trim()) || !email || !password) {
    return "Please provide all required fields";
  }

  if (!isValidEmail(email)) {
    return "Please provide a valid email address";
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }

  return null;
};

const issueOtp = async (user) => {
  const otp = createOtp();
  user.otp = hashOtp(otp);
  user.otpExpire = getOtpExpiry();
  user.otpAttempts = 0;
  user.otpLastSentAt = new Date();
  await user.save();
  await sendOtpMail(user.email, otp);
};

// ======================================================
// REGISTER
// ======================================================

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const validationError = validateCredentials(
      { name, email, password },
      true,
    );

    if (validationError) {
      return sendBadRequest(res, validationError);
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await userModel.findOne({ email: normalizedEmail });

    if (user) {
      if (!user.isVerified) {
        return res.status(409).json({
          success: false,
          code: "ACCOUNT_PENDING_VERIFICATION",
          message: "Your account is waiting for email verification",
          email: user.email,
        });
      }
      return sendConflict(res, "An account already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await userModel.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    await issueOtp(newUser);

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

    if (!email || !/^\d{6}$/.test(String(otp || ""))) {
      return sendBadRequest(
        res,
        "Please provide a valid email and 6-digit OTP",
      );
    }

    const user = await userModel
      .findOne({ email: normalizeEmail(email) })
      .select("+otp +otpExpire +otpAttempts +otpLastSentAt");

    if (!user) {
      return sendBadRequest(res, "Invalid email or OTP");
    }

    if (user.isVerified === true) {
      return sendBadRequest(res, "Account already verified");
    }

    if (!user.otp || !user.otpExpire || user.otpExpire.getTime() < Date.now()) {
      return sendBadRequest(res, "OTP expired");
    }

    if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
      return sendBadRequest(
        res,
        "Too many invalid OTP attempts. Please request a new OTP",
      );
    }

    if (hashOtp(otp) !== user.otp) {
      user.otpAttempts += 1;
      await user.save();
      return sendBadRequest(res, "Invalid email or OTP");
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    user.otpAttempts = 0;
    user.otpLastSentAt = undefined;

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
    const validationError = validateCredentials({ email, password });

    if (validationError) {
      return sendBadRequest(res, "Please provide a valid email and password");
    }

    const user = await userModel
      .findOne({ email: normalizeEmail(email) })
      .select("+password");

    if (!user) {
      return sendBadRequest(res, "Invalid email or password");
    }

    if (!user.status) {
      return sendBadRequest(res, "Your account is disabled");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return sendBadRequest(res, "Invalid email or password");
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email before signing in",
        email: user.email,
      });
    }

    const token = signSessionToken(user);
    res.cookie("token", token, getCookieOptions());

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
      .select("-password -otp -otpExpire -otpAttempts -otpLastSentAt");

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
      .select("-password -otp -otpExpire -otpAttempts -otpLastSentAt");

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
    const user = await userModel.findById(req.user.id).select("adresses");

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
      type,
      isDefault,
    } = req.body;

    if (!fullName || !mobile || !pincode || !adressLine || !city || !state) {
      return sendBadRequest(res, "All address fields are required");
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return sendNotFound(res, "User not found");
    }

    // First address automatically default
    const makeDefault = user.adresses.length === 0 ? true : Boolean(isDefault);

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
      type: ["Home", "Work", "Other"].includes(type) ? type : "Home",
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
      type,
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

    if (type !== undefined && ["Home", "Work", "Other"].includes(type)) {
      address.type = type;
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
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendBadRequest(
        res,
        "Current password and new password are required",
      );
    }

    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      return sendBadRequest(
        res,
        `New password must be at least ${PASSWORD_MIN_LENGTH} characters`,
      );
    }

    const user = await userModel.findById(req.user.id).select("+password");

    if (!user) {
      return sendNotFound(res, "User not found");
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!passwordMatches) {
      return sendBadRequest(res, "Current password is incorrect");
    }

    user.password = await bcrypt.hash(newPassword, 12);

    await user.save();

    return sendSuccess(res, "Password changed successfully");
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
    res.clearCookie("token", getCookieClearOptions());

    return sendSuccess(res, "Logout successfully");
  } catch (error) {
    console.error(error);
    return sendServerError(res);
  }
};

// ======================================================
// RESEND OTP
// ======================================================

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return sendBadRequest(res, "Please provide a valid email address");
    }

    const user = await userModel
      .findOne({ email: normalizeEmail(email) })
      .select("+otp +otpExpire +otpAttempts +otpLastSentAt");

    if (!user || user.isVerified) {
      return sendSuccess(
        res,
        "If registration is pending, a new OTP has been sent",
      );
    }

    const lastSent = user.otpLastSentAt?.getTime() || 0;
    if (Date.now() - lastSent < OTP_RESEND_COOLDOWN_MS) {
      return res.status(429).json({
        success: false,
        message: "Please wait one minute before requesting another OTP",
      });
    }

    await issueOtp(user);
    return sendSuccess(res, "A new OTP has been sent to your email");
  } catch (error) {
    return sendServerError(res, error);
  }
};
