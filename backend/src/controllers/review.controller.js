import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import { sendBadRequest, sendConflict, sendNotFound, sendServerError } from "../utils/response.js";

const validId = (id) => mongoose.isValidObjectId(id);
const pageNumber = (value) => Math.max(1, Math.min(100000, Number.parseInt(value, 10) || 1));
const pageSize = (value, fallback) => Math.max(1, Math.min(30, Number.parseInt(value, 10) || fallback));

export async function publicReviews(req, res) {
  try {
    if (req.query.product && !validId(req.query.product)) return sendBadRequest(res, "Invalid product id");
    const page = pageNumber(req.query.page);
    const limit = pageSize(req.query.limit, 3);
    const filter = { status: "approved", ...(req.query.product ? { product: req.query.product } : {}) };
    const [data, total] = await Promise.all([
      Review.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
        .populate("user", "name").populate("product", "title slug status thumbnail"),
      Review.countDocuments(filter),
    ]);
    return res.json({ success: true, data: data.filter((review) => review.user && review.product?.status), total, page, limit });
  } catch (error) { return sendServerError(res, error); }
}

export async function createReview(req, res) {
  try {
    const { product, rating, title, comment } = req.body || {};
    if (!validId(product)) return sendBadRequest(res, "Choose a valid product");
    const score = Number(rating);
    if (!Number.isInteger(score) || score < 1 || score > 5) return sendBadRequest(res, "Rating must be between 1 and 5");
    if (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 80) return sendBadRequest(res, "Title must be 3–80 characters");
    if (typeof comment !== "string" || comment.trim().length < 20 || comment.trim().length > 1000) return sendBadRequest(res, "Review must be 20–1000 characters");
    if (!await Product.exists({ _id: product, status: true })) return sendNotFound(res, "Product not found");
    if (await Review.exists({ user: req.user._id, product })) return sendConflict(res, "You have already reviewed this product");
    const verifiedPurchase = Boolean(await Order.exists({ user: req.user._id, "items.product_id": product, orderStatus: "DELIVERED" }));
    const review = await Review.create({ user: req.user._id, product, rating: score, title: title.trim(), comment: comment.trim(), verifiedPurchase });
    return res.status(201).json({ success: true, message: "Review submitted for approval", data: { _id: review._id, status: review.status } });
  } catch (error) {
    if (error.code === 11000) return sendConflict(res, "You have already reviewed this product");
    return sendServerError(res, error);
  }
}

export async function myReviews(req, res) {
  try {
    const data = await Review.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("product", "title slug thumbnail");
    return res.json({ success: true, data });
  } catch (error) { return sendServerError(res, error); }
}

export async function adminReviews(req, res) {
  try {
    const page = pageNumber(req.query.page);
    const limit = pageSize(req.query.limit, 20);
    const filter = ["pending", "approved", "rejected"].includes(req.query.status) ? { status: req.query.status } : {};
    const [data, total, pending] = await Promise.all([
      Review.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
        .populate("user", "name email").populate("product", "title slug thumbnail"),
      Review.countDocuments(filter), Review.countDocuments({ status: "pending" }),
    ]);
    return res.json({ success: true, data, total, pending, page, limit, pages: Math.ceil(total / limit) });
  } catch (error) { return sendServerError(res, error); }
}

export async function moderateReview(req, res) {
  try {
    if (!validId(req.params.id)) return sendBadRequest(res, "Invalid review id");
    if (!["approved", "rejected", "pending"].includes(req.body?.status)) return sendBadRequest(res, "Invalid review status");
    const review = await Review.findById(req.params.id);
    if (!review) return sendNotFound(res, "Review not found");
    review.status = req.body.status;
    await review.save();
    const [summary] = await Review.aggregate([
      { $match: { product: review.product, status: "approved" } },
      { $group: { _id: null, count: { $sum: 1 }, average: { $avg: "$rating" } } },
    ]);
    await Product.updateOne({ _id: review.product }, { reviewCount: summary?.count || 0, ratingAverage: summary ? Math.round(summary.average * 10) / 10 : 0 });
    return res.json({ success: true, message: `Review ${review.status}`, data: { _id: review._id, status: review.status } });
  } catch (error) { return sendServerError(res, error); }
}
