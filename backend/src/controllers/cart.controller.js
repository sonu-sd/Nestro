import mongoose from "mongoose";
import cartModel from "../models/cart.modal.js";
import ProductModel from "../models/product.model.js";
import categoryModel from "../models/category.model.js";
import roomModel from "../models/room.model.js";
import { sendBadRequest, sendServerError } from "../utils/response.js";

const normalizeItems = (items) => {
  if (!Array.isArray(items) || items.length > 100)
    throw new Error("INVALID_CART");
  const normalized = new Map();
  for (const item of items) {
    const productId = String(item?.productId || "");
    const qty = Number(item?.qty);
    if (
      !mongoose.isValidObjectId(productId) ||
      !Number.isInteger(qty) ||
      qty < 1 ||
      qty > 5
    )
      throw new Error("INVALID_CART");
    normalized.set(productId, qty);
  }
  return normalized;
};

const validProductIds = async (ids) => {
  if (!ids.length) return new Set();
  const [categories, rooms] = await Promise.all([
    categoryModel.find({ status: true }).select("_id"),
    roomModel.find({ status: true }).select("_id"),
  ]);
  const products = await ProductModel.find({
    _id: { $in: ids },
    status: true,
    stock: true,
    category: { $in: categories.map(({ _id }) => _id) },
    roomType: { $in: rooms.map(({ _id }) => _id) },
  }).select("_id");
  return new Set(products.map(({ _id }) => String(_id)));
};

const savePopulatedCart = async (userId, itemMap) => {
  const validIds = await validProductIds([...itemMap.keys()]);
  const items = [...itemMap]
    .filter(([productId]) => validIds.has(productId))
    .map(([productId, qty]) => ({ productId, qty }));
  return cartModel
    .findOneAndUpdate(
      { userId },
      { $set: { items } },
      { returnDocument: "after", upsert: true, runValidators: true },
    )
    .populate({
      path: "items.productId",
      populate: [
        { path: "category", select: "name slug" },
        { path: "roomType", select: "name slug" },
        { path: "colors", select: "name slug hex status" },
      ],
    });
};

const invalidCart = (res) =>
  sendBadRequest(
    res,
    "Every cart item must have a valid product and quantity between 1 and 5",
  );

// Exact sync is used after login. Removing an item locally removes it from MongoDB too.
export const sync = async (req, res) => {
  try {
    const items = normalizeItems(req.body?.items);
    const cart = await savePopulatedCart(req.user._id, items);
    return res
      .status(200)
      .json({ success: true, message: "Cart synced successfully", data: cart });
  } catch (error) {
    if (error.message === "INVALID_CART") return invalidCart(res);
    return sendServerError(res, error);
  }
};

// Merge is only for the login boundary: guest quantities are added to saved quantities.
export const merge = async (req, res) => {
  try {
    const guestItems = normalizeItems(req.body?.items);
    const savedCart = await cartModel.findOne({ userId: req.user._id });
    const merged = new Map(
      (savedCart?.items || []).map((item) => [
        String(item.productId),
        Number(item.qty),
      ]),
    );
    for (const [productId, qty] of guestItems)
      merged.set(productId, Math.min(5, (merged.get(productId) || 0) + qty));
    const cart = await savePopulatedCart(req.user._id, merged);
    return res
      .status(200)
      .json({
        success: true,
        message: "Guest cart merged successfully",
        data: cart,
      });
  } catch (error) {
    if (error.message === "INVALID_CART") return invalidCart(res);
    return sendServerError(res, error);
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart)
      return res
        .status(200)
        .json({ success: true, message: "Cart is empty", data: null });
    const itemMap = new Map(
      cart.items.map((item) => [String(item.productId), Number(item.qty)]),
    );
    const cleanCart = await savePopulatedCart(req.user._id, itemMap);
    return res
      .status(200)
      .json({
        success: true,
        message: "Cart fetched successfully",
        data: cleanCart,
      });
  } catch (error) {
    return sendServerError(res, error);
  }
};
