import crypto from "crypto";
import cartModel from "../models/cart.modal.js";
import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import categoryModel from "../models/category.model.js";
import roomModel from "../models/room.model.js";
import userModel from "../models/user.model.js";
import { isValidId, parseBoundedNumber } from "../utils/catalog.js";
import { createRazorpayOrder, getRazorpayKeyId, getRazorpayPayment } from "../utils/razorpay.js";
import { sendBadRequest, sendNotFound, sendServerError } from "../utils/response.js";

const SHIPPING_CHARGE = 49;
const TAX_RATE = 0.05;
const buildOrderNumber = () => `NESTRO-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
const ADMIN_TRANSITIONS = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["OUT_FOR_DELIVERY"],
    OUT_FOR_DELIVERY: ["DELIVERED"],
};
const CUSTOMER_CANCELLABLE = new Set(["PENDING", "CONFIRMED"]);

const canCancel = (order, isAdmin) => {
    const eligibleStatus = isAdmin ? ["PENDING", "CONFIRMED", "PROCESSING"] : [...CUSTOMER_CANCELLABLE];
    return eligibleStatus.includes(order.orderStatus) && order.paymentStatus !== "PAID";
};

const prepareOrder = async (userId, addressId, paymentMethod) => {
    if (!isValidId(addressId)) throw new Error("INVALID_ADDRESS");
    const user = await userModel.findById(userId).select("adresses");
    const address = user?.adresses.id(addressId);
    if (!address) throw new Error("ADDRESS_NOT_FOUND");
    const cart = await cartModel.findOne({ userId });
    if (!cart?.items?.length) throw new Error("CART_EMPTY");

    const [activeCategories, activeRooms] = await Promise.all([
        categoryModel.find({ status: true }).select("_id"),
        roomModel.find({ status: true }).select("_id"),
    ]);
    const products = await ProductModel.find({
        _id: { $in: cart.items.map((item) => item.productId) }, status: true, stock: true,
        category: { $in: activeCategories.map((category) => category._id) },
        roomType: { $in: activeRooms.map((room) => room._id) },
    }).select("title salePrice thumbnail");
    const productsById = new Map(products.map((product) => [String(product._id), product]));
    if (cart.items.some((item) => !productsById.has(String(item.productId)))) throw new Error("PRODUCT_UNAVAILABLE");

    const items = cart.items.map((cartItem) => {
        const product = productsById.get(String(cartItem.productId));
        return { product_id: product._id, title: product.title, image: product.thumbnail, price: product.salePrice, qty: cartItem.qty, total: product.salePrice * cartItem.qty };
    });
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    return {
        user: userId, orderNumber: buildOrderNumber(), items,
        shippingAddress: { fullName: address.fullName, phone: address.mobile, address: address.adressLine, city: address.city, state: address.state, pincode: address.pincode },
        subtotal, shippingCharge: SHIPPING_CHARGE, tax, totalAmount: subtotal + SHIPPING_CHARGE + tax,
        paymentMethod, paymentStatus: "PENDING", orderStatus: "PENDING",
    };
};

const sendOrderInputError = (res, error) => {
    const messages = { INVALID_ADDRESS: "Please select a valid delivery address", ADDRESS_NOT_FOUND: "Selected delivery address was not found", CART_EMPTY: "Your cart is empty", PRODUCT_UNAVAILABLE: "One or more cart products are unavailable. Please refresh your cart" };
    return messages[error.message] ? sendBadRequest(res, messages[error.message]) : null;
};

export const placeOrder = async (req, res) => {
    try {
        if (req.body.paymentMethod !== "COD") return sendBadRequest(res, "Use the online payment endpoint for online payments");
        const payload = await prepareOrder(req.user.id, req.body.addressId, "COD");
        const order = await OrderModel.create(payload);
        await cartModel.updateOne({ userId: req.user.id }, { $set: { items: [] } });
        return res.status(201).json({ success: true, message: "Order placed successfully", data: order });
    } catch (error) { return sendOrderInputError(res, error) || sendServerError(res, error); }
};

export const createOnlineOrder = async (req, res) => {
    try {
        const payload = await prepareOrder(req.user.id, req.body.addressId, "ONLINE");
        const order = await OrderModel.create(payload);
        try {
            const razorpayOrder = await createRazorpayOrder({ amount: order.totalAmount * 100, receipt: order.orderNumber, notes: { nestroOrderId: String(order._id) } });
            order.paymentOrderId = razorpayOrder.id;
            await order.save();
            return res.status(201).json({ success: true, message: "Payment order created", data: { orderId: order._id, razorpayOrderId: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency, keyId: getRazorpayKeyId() } });
        } catch (paymentError) {
            await OrderModel.findByIdAndDelete(order._id);
            if (paymentError.message === "RAZORPAY_NOT_CONFIGURED") return sendServerError(res, paymentError);
            throw paymentError;
        }
    } catch (error) { return sendOrderInputError(res, error) || sendServerError(res, error); }
};

export const verifyOnlinePayment = async (req, res) => {
    try {
        const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        if (!isValidId(orderId) || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) return sendBadRequest(res, "Invalid payment verification data");
        const order = await OrderModel.findOne({ _id: orderId, user: req.user.id, paymentMethod: "ONLINE" });
        if (!order) return sendNotFound(res, "Order not found");
        if (order.paymentStatus === "PAID") return res.status(200).json({ success: true, message: "Payment already verified", data: order });
        if (order.paymentOrderId !== razorpayOrderId) return sendBadRequest(res, "Payment order does not match");
        if (!process.env.RAZORPAY_KEY_SECRET) throw new Error("RAZORPAY_NOT_CONFIGURED");
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest("hex");
        const signatureMatches = expectedSignature.length === razorpaySignature.length && crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpaySignature));
        if (!signatureMatches) return sendBadRequest(res, "Payment signature verification failed");
        const payment = await getRazorpayPayment(razorpayPaymentId);
        if (payment.order_id !== order.paymentOrderId || payment.amount !== order.totalAmount * 100 || payment.currency !== "INR") {
            return sendBadRequest(res, "Payment details do not match the order");
        }
        if (payment.status !== "captured") return res.status(409).json({ success: false, message: "Payment is awaiting capture. Please check your orders shortly." });
        order.paymentStatus = "PAID";
        order.paymentId = razorpayPaymentId;
        order.orderStatus = "CONFIRMED";
        await order.save();
        await cartModel.updateOne({ userId: req.user.id }, { $set: { items: [] } });
        return res.status(200).json({ success: true, message: "Payment verified and order confirmed", data: order });
    } catch (error) { return sendServerError(res, error); }
};

export const razorpayWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.get("x-razorpay-signature") || "";
        if (!secret || !Buffer.isBuffer(req.body) || !/^[a-f0-9]{64}$/i.test(signature)) return res.sendStatus(401);
        const expected = crypto.createHmac("sha256", secret).update(req.body).digest("hex");
        if (!crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"))) return res.sendStatus(401);
        const event = JSON.parse(req.body.toString("utf8"));
        if (event.event !== "payment.captured") return res.sendStatus(200);
        const payment = event.payload?.payment?.entity;
        if (!payment?.order_id || !payment?.id || payment.status !== "captured") return res.sendStatus(200);
        const order = await OrderModel.findOne({ paymentOrderId: payment.order_id, paymentMethod: "ONLINE" });
        if (!order || payment.amount !== order.totalAmount * 100 || payment.currency !== "INR") return res.sendStatus(200);
        if (order.paymentStatus !== "PAID") {
            order.paymentStatus = "PAID";
            order.paymentId = payment.id;
            order.orderStatus = "CONFIRMED";
            await order.save();
            await cartModel.updateOne({ userId: order.user }, { $pull: { items: { productId: { $in: order.items.map((item) => item.product_id) } } } });
        }
        return res.sendStatus(200);
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

export const cancelMyOrder = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) return sendBadRequest(res, "Invalid order id");
        const order = await OrderModel.findOne({ _id: req.params.id, user: req.user.id });
        if (!order) return sendNotFound(res, "Order not found");
        if (!canCancel(order, false)) return sendBadRequest(res, order.paymentStatus === "PAID" ? "Paid orders require a refund before cancellation" : "This order can no longer be cancelled");
        const reason = String(req.body.reason || "Cancelled by customer").trim().slice(0, 300);
        order.orderStatus = "CANCELLED";
        order.cancelledAt = new Date();
        order.cancellationReason = reason;
        await order.save();
        return res.status(200).json({ success: true, message: "Order cancelled", data: order });
    } catch (error) { return sendServerError(res, error); }
};

export const getAdminOrders = async (req, res) => {
    try {
        const limit = parseBoundedNumber(req.query.limit, 20, 1, 100);
        const page = parseBoundedNumber(req.query.page, 1, 1, 100000);
        const filter = {};
        if (req.query.status) filter.orderStatus = req.query.status;
        if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
        const [data, total, all, pending, revenue] = await Promise.all([
            OrderModel.find(filter).populate("user", "name email").sort({ placedAt: -1 }).skip((page - 1) * limit).limit(limit),
            OrderModel.countDocuments(filter),
            OrderModel.countDocuments(),
            OrderModel.countDocuments({ orderStatus: { $nin: ["DELIVERED", "CANCELLED"] } }),
            OrderModel.aggregate([{ $match: { $or: [{ paymentStatus: "PAID" }, { paymentMethod: "COD", orderStatus: "DELIVERED" }] } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
        ]);
        return res.status(200).json({ success: true, message: "Orders found", data, total, page, limit, pages: Math.ceil(total / limit), summary: { all, pending, revenue: revenue[0]?.total || 0 } });
    } catch (error) { return sendServerError(res, error); }
};

export const updateAdminOrder = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) return sendBadRequest(res, "Invalid order id");
        const { orderStatus, trackingNumber, courierName, cancellationReason } = req.body;
        const order = await OrderModel.findById(req.params.id);
        if (!order) return sendNotFound(res, "Order not found");
        if (!ADMIN_TRANSITIONS[order.orderStatus]?.includes(orderStatus)) return sendBadRequest(res, "Invalid order status transition");
        if (orderStatus === "CANCELLED") {
            if (!canCancel(order, true)) return sendBadRequest(res, order.paymentStatus === "PAID" ? "Paid orders require a refund before cancellation" : "This order can no longer be cancelled");
            order.cancelledAt = new Date();
            order.cancellationReason = String(cancellationReason || "Cancelled by admin").trim().slice(0, 300);
        }
        if (orderStatus === "SHIPPED") {
            if (!String(trackingNumber || "").trim() || !String(courierName || "").trim()) return sendBadRequest(res, "Tracking number and courier name are required before shipping");
            order.trackingNumber = String(trackingNumber).trim().slice(0, 100);
            order.courierName = String(courierName).trim().slice(0, 100);
        }
        order.orderStatus = orderStatus;
        if (orderStatus === "DELIVERED") order.deliveredAt = new Date();
        await order.save();
        return res.status(200).json({ success: true, message: "Order updated", data: order });
    } catch (error) { return sendServerError(res, error); }
};
