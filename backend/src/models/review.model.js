import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 80 },
  comment: { type: String, required: true, trim: true, minlength: 20, maxlength: 1000 },
  verifiedPurchase: { type: Boolean, default: false },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
}, { timestamps: true });

reviewSchema.index({ user: 1, product: 1 }, { unique: true });
reviewSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Review", reviewSchema);
