import ProductModel from "../models/product.model.js";
import { sendBadRequest, sendConflict, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js";
import categoryModel from "../models/category.model.js"
import roomModel from "../models/room.model.js"

export const read = async (req, res) => {
    try {
        const query = req.query;
        console.log(query)
        const filter = {};
        const sortFilter = {};
        const limit = query.limit ? parseInt(query.limit) : 6;
        const page = query.page ? parseInt(query.page) : 1;
        const skip = (page - 1) * limit;

        if (query.bestseller) {
            filter.bestSeller = query.bestseller === "true";
        }
        if (query.status) {
            filter.status = query.status === "true";
        }
        if (query.stock) {
            filter.stock = query.stock === "true";
        }
        if (query.newarrival) {
            filter.newArrival = query.newarrival === "true";
        }
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



        if (query.category) {
            const categoryArray = query.category.split(",")
            // slug to id 

            const category = await categoryModel.find({ slug: { $in: categoryArray } }).select("_id");
            filter.category = { $in: category.map((category) => category._id) };
        }

        if (query.room) {
            const roomArray = query.room.split(",")
            // slug to id 
            const room = await roomModel.find({ slug: { $in: roomArray } }).select("_id")
            filter.roomType = { $in: room.map((room) => room._id) };
        }

        // price ================================

        // if(query.minprice && query.maxprice){
        //     const minprice = parseInt(query.minprice)
        //     const maxprice = parseInt(query.maxprice)
        //     filter.salePrice = {$gte:minprice,$lte:maxprice}
        // } 

        if (query.minprice || query.maxprice) {
            filter.salePrice = {};

            if (query.minprice) {
                filter.salePrice.$gte = parseInt(query.minprice);
            }

            if (query.maxprice) {
                filter.salePrice.$lte = parseInt(query.maxprice);
            }
        }


        // Material filter
        if (query.material) {
            const materialArray = query.material.split(",");

            filter.material = {
                $in: materialArray
            };
        }




        const products = await ProductModel.find(filter)
            .populate("category")
            .populate("roomType")
            .sort(sortFilter)
            .skip(skip)
            .limit(limit);

        const total = await ProductModel.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: "Product data found",
            data: products,
            total,
            limit,
            page,
            pages: Math.ceil(total / limit)
        });

    } catch (error) {
        // console.log(error)
        sendServerError(res);
    }
};

export const readById = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await ProductModel.findById(id)
            .populate("category")
            .populate("roomType");

        if (!product)
            return sendNotFound(res);

        res.status(200).json({
            success: true,
            message: "Product found",
            data: product
        });

    } catch (error) {
        sendServerError(res);
    }
};


export const create = async (req, res) => {
    try {

        const imageUrl = req.file?.path;
        const {
            title,
            slug,
            shortDescription,
            description,
            category,
            roomType,
            price,
            salePrice,
            discount,
            stock,
            material,
            color,
            featured,
            bestSeller,
            newArrival
        } = req.body;

        // console.log(req.body);

        if (
            !title ||
            !slug ||
            !description ||
            !category ||
            !roomType ||
            !price ||
            !imageUrl
        ) {
            return sendBadRequest(res, "Required fields are missing");
        }

        // Check duplicate slug
        const product = await ProductModel.findOne({ slug });

        if (product) {
            return sendConflict(
                res,
                "Product with this slug already exists"
            );
        }

        // Create product
        const newProduct = await ProductModel.create({
            title,
            slug,
            shortDescription,
            description,
            category,
            roomType,
            price,
            salePrice,
            discount,
            stock,
            material,
            color,
            featured,
            bestSeller,
            newArrival,
            thumbnail: imageUrl
        });

        console.log("PRODUCT CREATED:", newProduct);

        return sendCreated(res);

    } catch (error) {
        console.error("🔥 CREATE PRODUCT ERROR:", error);
        return sendServerError(res);
    }
};


export const addImages = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await ProductModel.findById(id);

        if (!product) return sendNotFound(res)

        // Existing Images
        const oldImages = product.images || [];

        // Newly Uploaded Images
        const newImages = req.files?.map((file) => file.path) || [];

        // Merge Old + New
        const updatedImages = [...oldImages, ...newImages];

        // Maximum 6 Images
        if (updatedImages.length > 6) {
            return res.status(400).json({
                success: false,
                message: "Maximum 6 images are allowed.",
            });
        }

        product.images = updatedImages;

        await product.save();

        return sendSuccess(res)
    } catch (error) {
        console.error(error);
        return sendServerError(res)
    }
};


export const edit = async (req, res) => {
    try {

        const { id } = req.params;

        const imageUrl = req.file?.path || "";
        console.log(imageUrl)
        return

        const product = await ProductModel.findById(id);

        if (!product)
            return sendNotFound(res);

        Object.assign(product, req.body);

        if (imageUrl)
            product.thumbnail = imageUrl;

        await product.save();

        sendSuccess(res, "Product updated");

    } catch (error) {
        sendServerError(res);
    }
};


export const updateStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const product = await ProductModel.findById(id);
        if (!product)
            return sendNotFound(res);

        product.status = !product.status;
        await product.save();
        sendSuccess(res, "Product status updated");

    } catch (error) {
        sendServerError(res);
    }
};


export const deleteById = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await ProductModel.findById(id);

        if (!product)
            return sendNotFound(res);

        await ProductModel.findByIdAndDelete(id);

        sendSuccess(res, "Product deleted successfully");

    } catch (error) {
        sendServerError(res);
    }
};

export const updateFlag = async (req, res) => {
    try {

        const { id } = req.params;
        const { field } = req.body;
        console.log(id, field)
        const allowedFields = [
            "stock",
            "featured",
            "bestSeller",
            "newArrival"
        ];

        if (!allowedFields.includes(field)) {
            return sendBadRequest(res, "Invalid field");
        }

        const product = await ProductModel.findById(id);

        if (!product) {
            return sendNotFound(res);
        }

        product[field] = !product[field];

        await product.save();

        return sendSuccess(res, `${field} updated successfully`);

    } catch (error) {
        sendServerError(res);
    }
};