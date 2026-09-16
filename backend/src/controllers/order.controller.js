import cartModel from "../models/cart.modal.js";
import OrderModel from "../models/order.model.js";
import mongoose from "mongoose";

import {
    sendBadRequest,
    sendNotFound,
    sendServerError,
} from "../utils/response.js";



// ORDER PLACE

export const Orderplace = async (req, res) => {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await cartModel
        .findOne({ userId })
        .populate(
            "items.productId",
            "_id name slug originalPrice salePrice thumbnail"
        );

    if (!cart) {
        return sendNotFound(res, "cart not found");
    }

    const items = cart?.items?.map((item) => {
        const { salePrice, _id } = item.productId;

        return {
            product_id: _id,
            qty: item.qty,
            price: salePrice,
            total: salePrice * item.qty
        };
    });

    const total = items.reduce(
        (sum, item) => sum + item.total,
        0
    );

    const order = await OrderModel.create({
        user: userId,
        items,
        shippingAddress,
        totalAmount: total,
        orderStatus: "PENDING",
        paymentMethod,
        paymentStatus: "PENDING",
    });

    if (paymentMethod === "COD") {
        return res.status(201).json({
            message: "Order create successfully",
            success: true,
            orderId: order._id
        });
    }
};



//READ ORDERS 

export const read = async (req, res) => {
    try {
        const query = req.query;

        console.log(query);

        const filter = {};
        const sortFilter = {};

        const limit = query.limit ? parseInt(query.limit): 6;
        const page = query.page ? parseInt(query.page) : 1;
        const skip = (page - 1) * limit;


        // ID Filter
        if (query.id) {
            filter._id = query.id;
        }


        // Sort
        if (query.sort) {
            switch (query.sort) {

                case "featured":
                    sortFilter.featured = -1;
                    break;

                case "newest":
                    sortFilter.createdAt = -1;
                    break;

                case "low":
                    sortFilter.salePrice = 1;
                    break;

                case "high":
                    sortFilter.salePrice = -1;
                    break;

                case "bestselling":
                    sortFilter.bestSeller = -1;
                    break;

                default:
                    sortFilter.createdAt = -1;
            }

        } else {
            sortFilter.createdAt = -1;
        }



        // Material filter
        if (query.material) {

            const materialArray = query.material.split(",");

            filter.material = {
                $in: materialArray
            };
        }



        // Find Orders
        const orders = await OrderModel.find(filter)
            .sort(sortFilter)
            .skip(skip)
            .limit(limit);


        // Total Orders
        const total = await OrderModel.countDocuments(filter);



        // Response
        res.status(200).json({
            success: true,
            message: "Order data found",
            data: orders,
            total,
            limit,
            page,
            pages: Math.ceil(total / limit)
        });


    } catch (error) {

        console.log(error);

        sendServerError(res);
    }
};