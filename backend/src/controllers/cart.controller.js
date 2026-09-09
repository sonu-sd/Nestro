import cartModel from "../models/cart.modal.js";
import ProductModel from "../models/product.model.js";
import mongoose from "mongoose";

import {
    sendBadRequest,
    sendServerError,
} from "../utils/response.js";



export const sync = async (req, res) => {
    try {
        const userId = req.user._id;
        const { items } = req.body;

        if (!Array.isArray(items)) {
            return sendBadRequest(res, "Cart must be an array");
        }

        // Normalise and de-duplicate the local cart. The last local quantity
        // wins because it represents the guest's most recent change.
        const localItems = new Map();

        for (const item of items) {
            const productId = String(item?.productId || "");
            const qty = Number(item?.qty);

            if (
                !mongoose.isValidObjectId(productId) ||
                !Number.isInteger(qty) ||
                qty < 1 ||
                qty > 5
            ) {
                return sendBadRequest(
                    res,
                    "Every cart item must have a valid product and quantity between 1 and 5"
                );
            }

            localItems.set(productId, qty);
        }

        const existingCart = await cartModel.findOne({ userId });
        const candidateProductIds = new Set(localItems.keys());

        for (const item of existingCart?.items || []) {
            candidateProductIds.add(String(item.productId));
        }

        // Do not keep deleted product IDs from either cart.
        const validProducts = await ProductModel.find({
            _id: { $in: [...candidateProductIds] },
        }).select("_id");

        const validProductIds = new Set(
            validProducts.map((product) => String(product._id))
        );

        const mergedItems = new Map();

        // Preserve products that exist only in MongoDB.
        for (const item of existingCart?.items || []) {
            const productId = String(item.productId);
            if (validProductIds.has(productId)) {
                mergedItems.set(productId, Number(item.qty));
            }
        }

        // Add local-only products and update matching products with the latest
        // guest quantity.
        for (const [productId, qty] of localItems) {
            if (validProductIds.has(productId)) {
                mergedItems.set(productId, qty);
            }
        }

        const finalItems = [...mergedItems].map(([productId, qty]) => ({
            productId,
            qty,
        }));

        const userCart = await cartModel.findOneAndUpdate(
            { userId },
            { $set: { items: finalItems } },
            { new: true, upsert: true, runValidators: true }
        ).populate("items.productId");

        return res.status(200).json({
            success: true,
            message: "Cart synced successfully",
            data: userCart,
        });

    } catch (error) {
        console.error(error);

        return sendServerError(
            res,
            "Cart sync error"
        );
    }
};


export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const userCart = await cartModel
            .findOne({ userId })
            .populate("items.productId");

        if (!userCart) {
            return res.status(200).json({
                success: true,
                message: "Cart is empty",
                data: null,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            data: userCart,
        });

    } catch (error) {
        console.error(error);

        return sendServerError(
            res,
            "Cart fetch error"
        );
    }
};
