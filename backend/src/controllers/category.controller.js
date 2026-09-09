import { IoCaretForwardCircle } from "react-icons/io5"
import categoryModel from "../models/category.model.js"
import { sendBadRequest, sendConflict, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js"

export const read = async (req, res) => {
    try {

        const query = req.query;
        const filter = {};
        const limit = query.limit ? parseInt(query.limit):null
        if(query.status){
            filter.status = query.status === "true"
        }
        const category = await categoryModel.find(filter).limit(limit);
        const countdocument = await categoryModel.countDocuments()

        res.status(200).json({
            message: "Data fetched successfully",
            success: true,
            data: category,
            total: countdocument
        })




    } catch (error) {
        return sendServerError(res)
    }
}


export const readById = async (req, res) => {
    try {

        console.log("Params:", req.params);
        console.log("ID:", req.params.id);
        const { id } = req.params;

        const category = await categoryModel.findById(id);

        if (!category) {
            return sendNotFound(res);
        }

        return res.status(200).json({
            success: true,
            message: "Category found",
            data: category
        });

    } catch (error) {
        console.error(error);
        return sendServerError(res);
    }
};


export const create = async (req, res) => {
    try {
        const imageUrl = req.file?.path || ""
        const { name, slug } = req.body;
        if (!name || !slug) {
            return  sendBadRequest(res, "name and slug is required")
        }

        const category = await categoryModel.findOne({ slug })
        console.log(category)
        if (category)
            return sendConflict(res)

        await categoryModel.create({ name, slug, image: imageUrl })
        return sendCreated(res)


    } catch (error) {
        console.error(error); 
        return sendServerError(res)
    } 
}


export const updateStatus = async (req, res) => {
    try {
        console.log(req.user,"user information")
        const { id } = req.params;
        const category = await categoryModel.findById(id);
        if (!category) {
            return sendNotFound(res)
        }

        await categoryModel.findByIdAndUpdate(
            { _id: id }, { $set: { status: !category.status } }
        )
        return sendSuccess(res, "category status update")

    } catch (error) {
        return sendServerError(res)
    }
}


export const edit = async (req, res) => {
    try {
        const imageUrl = req.file?.path || ""
        const { name, slug } = req.body
        const { id } = req.params;
        const category = await categoryModel.findById(id)
        if (!category) {
            return sendNotFound(res)
        }

        if (name) category.name = name
        if (slug) category.slug = slug
        if (imageUrl) category.image = imageUrl;

        await category.save();
        return sendSuccess(res, "Category updated successfully");
        
    } catch (error) {
        return sendServerError(res)
    }
}


export const deleteById = async (req, res) => {
    try {

        const { id } = req.params;
        const category = await categoryModel.findById(id);
        if (!category) {
            return sendNotFound(res)
        }

        await categoryModel.findByIdAndDelete(id)
        return sendSuccess(res, "Category delete successfully")

    } catch (error) {
        return sendServerError(res)
    }
}