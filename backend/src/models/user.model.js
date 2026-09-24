import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    mobile: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
    adresses: {
      type: [
        {
          fullName: { type: String, required: true },
          mobile: { type: String, required: true },
          pincode: { type: String, required: true },
          adressLine: { type: String, required: true },
          city: { type: String, required: true },
          state: { type: String, required: true },
          country: { type: String, default: "india" },
          type: { type: String, enum: ["Home", "Work", "Other"], default: "Home" },
          isDefault: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpire: {
      type: Date,
      select: false,
    },
    otpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    otpLastSentAt: {
      type: Date,
      select: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("user", userSchema);
export default userModel;
