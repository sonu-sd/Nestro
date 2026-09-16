import crypto from "crypto";
import cartModel from "../models/cart.modal.js";
import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import categoryModel from "../models/category.model.js";
import roomModel from "../models/room.model.js";
import userModel from "../models/user.model.js";
import { isValidId, parseBoundedNumber } from "../utils/catalog.js";
import { sendBadRequest, sendNotFound, sendServerError } from "../utils/response.js";

const SHIPPING_CHARGE = 49;
const TAX_RATE = 0.05;
const buildOrderNumber = () => `NESTRO-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

export const placeOrder = async (req, res) => {
    try {
        const { addressId, paymentMethod } = req.body;
        if (!isValidId(addressId)) return sendBadRequest(res, "Please select a valid delivery address");
        if (paymentMethod !== "COD") return sendBadRequest(res, "Only Cash on Delivery is currently available");

        const user = await userModel.findById(req.user.id).select("adresses");
        const address = user?.adresses.id(addressId);
        if (!address) return sendBadRequest(res, "Selected delivery address was not found");
        const cart = await cartModel.findOne({ userId: req.user.id });
        if (!cart?.items?.length) return sendBadRequest(res, "Your cart is empty");

        const [activeCategories, activeRooms] = await Promise.all([
            categoryModel.find({ status: true }).select("_id"),
            roomModel.find({ status: true }).select("_id"),
        ]);
        const products = await ProductModel.find({
            _id: { $in: cart.items.map((item) => item.productId) }, status: true, stock: true,
            category: { $in: activeCategories.map((category) => category._id) },
            roomType: { $in: activeRooms.map((room) => room._id) },
        })
            .select("title salePrice thumbnail");
        const productsById = new Map(products.map((product) => [String(product._id), product]));
        if (cart.items.some((item) => !productsById.has(String(item.productId)))) return sendBadRequest(res, "One or more cart products are unavailable. Please refresh your cart");

        const items = cart.items.map((cartItem) => {
            const product = productsById.get(String(cartItem.productId));
            return { product_id: product._id, title: product.title, image: product.thumbnail, price: product.salePrice, qty: cartItem.qty, total: product.salePrice * cartItem.qty };
        });
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const tax = Math.round(subtotal * TAX_RATE);
        const totalAmount = subtotal + SHIPPING_CHARGE + tax;
        const order = await OrderModel.create({
            user: req.user.id, orderNumber: buildOrderNumber(), items,
            shippingAddress: { fullName: address.fullName, phone: address.mobile, address: address.adressLine, city: address.city, state: address.state, pincode: address.pincode },
            subtotal, shippingCharge: SHIPPING_CHARGE, tax, totalAmount,
            paymentMethod: "COD", paymentStatus: "PENDING", orderStatus: "PENDING",
        });
        await cartModel.updateOne({ userId: req.user.id }, { $set: { items: [] } });
        return res.status(201).json({ success: true, message: "Order placed successfully", data: order });
    } catch (error) { return sendServerError(res, error); }
};

export const getMyOrders = async (req, res) => {
    try {
        const limit = parseBoundedNumber(req.query.limit, 20, 1, 100);
        const page = parseBoundedNumber(req.query.page, 1, 1, 100000);
        const filter = { user: req.user.id };
        const [data, total] = await Promise.all([OrderModel.find(filter).sort({ placedAt: -1 }).skip((page - 1) * limit).limit(limit), OrderModel.countDocuments(filter)]);
        return res.status(200).json({ success: true, message: "Orders found", data, total, page, limit, pages: Math.ceil(total / limit) });
    } catch (error) { return sendServerError(res, error); }
};

export const getMyOrderById = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) return sendBadRequest(res, "Invalid order id");
        const order = await OrderModel.findOne({ _id: req.params.id, user: req.user.id });
        if (!order) return sendNotFound(res, "Order not found");
        return res.status(200).json({ success: true, message: "Order found", data: order });
    } catch (error) { return sendServerError(res, error); }
};
