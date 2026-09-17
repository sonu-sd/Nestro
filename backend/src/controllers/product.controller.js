import ProductModel from "../models/product.model.js";
import categoryModel from "../models/category.model.js";
import roomModel from "../models/room.model.js";
import { isValidId, normalizeSlug, parseBoolean, parseBoundedNumber } from "../utils/catalog.js";
import { getUploadMetadata, removeCloudinaryAssets } from "../utils/media.js";
import { sendBadRequest, sendConflict, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js";

const MATERIALS = new Set(["Wood", "Sheesham", "Engineered Wood", "Metal", "Steel", "Plastic", "Glass", "Marble", "Fabric", "Leather"]);
const POPULATE = [{ path: "category", select: "name slug status" }, { path: "roomType", select: "name slug status" }];

const getActiveReferences = async () => {
    const [categories, rooms] = await Promise.all([
        categoryModel.find({ status: true }).select("_id"),
        roomModel.find({ status: true }).select("_id"),
    ]);
    return { categories: categories.map(({ _id }) => _id), rooms: rooms.map(({ _id }) => _id) };
};

const validateReferences = async (category, roomType) => {
    if (!isValidId(category) || !isValidId(roomType)) return "Please provide valid category and room type";
    const [activeCategory, activeRoom] = await Promise.all([
        categoryModel.exists({ _id: category, status: true }),
        roomModel.exists({ _id: roomType, status: true }),
    ]);
    return activeCategory && activeRoom ? null : "Category and room type must be active";
};

const parseProductValues = (body) => {
    const allowed = ["title", "slug", "shortDescription", "description", "category", "roomType", "price", "salePrice", "discount", "stock", "material", "color", "length", "width", "height", "weight", "featured", "bestSeller", "newArrival", "status"];
    const values = Object.fromEntries(allowed.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]));
    ["price", "salePrice", "discount"].forEach((key) => {
        if (values[key] !== undefined) values[key] = Number(values[key]);
    });
    ["stock", "featured", "bestSeller", "newArrival", "status"].forEach((key) => {
        if (values[key] !== undefined) values[key] = parseBoolean(values[key]);
    });
    if (values.slug !== undefined) values.slug = normalizeSlug(values.slug);
    const dimensions = {};
    ["length", "width", "height"].forEach((key) => {
        if (values[key] !== undefined) { dimensions[key] = Number(values[key]); delete values[key]; }
    });
    if (Object.keys(dimensions).length) values.dimensions = dimensions;
    if (values.weight !== undefined) { values.weight = { value: Number(values.weight) }; }
    return values;
};

const validateProductValues = (values, isCreate = false) => {
    const required = ["title", "slug", "description", "category", "roomType", "price", "salePrice", "material"];
    if (isCreate && required.some((field) => values[field] === undefined || values[field] === "")) return "Required product fields are missing";
    if (values.title !== undefined && (typeof values.title !== "string" || values.title.trim().length < 2)) return "Title must be at least 2 characters";
    if (values.slug !== undefined && !values.slug) return "Please provide a valid slug";
    if (values.material !== undefined && !MATERIALS.has(values.material)) return "Invalid material";
    if (values.price !== undefined && (!Number.isFinite(values.price) || values.price < 200)) return "Price must be at least 200";
    if (values.salePrice !== undefined && (!Number.isFinite(values.salePrice) || values.salePrice < 0)) return "Sale price must be zero or more";
    if (values.discount !== undefined && (!Number.isFinite(values.discount) || values.discount < 0 || values.discount > 100)) return "Discount must be between 0 and 100";
    if (["stock", "featured", "bestSeller", "newArrival", "status"].some((key) => Object.hasOwn(values, key) && values[key] === undefined)) return "Invalid product setting";
    if (values.dimensions && Object.values(values.dimensions).some((value) => !Number.isFinite(value) || value < 0)) return "Dimensions must be zero or more";
    if (values.weight && (!Number.isFinite(values.weight.value) || values.weight.value < 0)) return "Weight must be zero or more";
    return null;
};

const buildPublicFilter = async (query) => {
    const { categories, rooms } = await getActiveReferences();
    const filter = { status: true, category: { $in: categories }, roomType: { $in: rooms } };
    const booleanFilters = { bestseller: "bestSeller", stock: "stock", newarrival: "newArrival" };
    Object.entries(booleanFilters).forEach(([queryKey, field]) => {
        if (query[queryKey] !== undefined) filter[field] = parseBoolean(query[queryKey]);
    });
    if (query.category) {
        const slugs = query.category.split(",").map(normalizeSlug).filter(Boolean);
        const matches = await categoryModel.find({ slug: { $in: slugs }, status: true }).select("_id");
        filter.category = { $in: matches.map(({ _id }) => _id) };
    }
    if (query.room) {
        const slugs = query.room.split(",").map(normalizeSlug).filter(Boolean);
        const matches = await roomModel.find({ slug: { $in: slugs }, status: true }).select("_id");
        filter.roomType = { $in: matches.map(({ _id }) => _id) };
    }
    const minimum = Number(query.minprice);
    const maximum = Number(query.maxprice);
    if (query.minprice !== undefined || query.maxprice !== undefined) {
        if ((query.minprice !== undefined && !Number.isFinite(minimum)) || (query.maxprice !== undefined && !Number.isFinite(maximum)) || (Number.isFinite(minimum) && Number.isFinite(maximum) && minimum > maximum)) throw new Error("INVALID_PRICE_FILTER");
        filter.salePrice = {};
        if (Number.isFinite(minimum)) filter.salePrice.$gte = minimum;
        if (Number.isFinite(maximum)) filter.salePrice.$lte = maximum;
    }
    if (query.material) filter.material = { $in: query.material.split(",").filter((value) => MATERIALS.has(value)) };
    return filter;
};

const sortFor = (sort) => ({ featured: { featured: -1, createdAt: -1 }, low: { salePrice: 1 }, high: { salePrice: -1 }, bestselling: { bestSeller: -1, createdAt: -1 }, newest: { createdAt: -1 } }[sort] || { createdAt: -1 });

export const read = async (req, res) => {
    try {
        const filter = await buildPublicFilter(req.query);
        const limit = parseBoundedNumber(req.query.limit, 12, 1, 100);
        const page = parseBoundedNumber(req.query.page, 1, 1, 100000);
        const [data, total] = await Promise.all([
            ProductModel.find(filter).populate(POPULATE).sort(sortFor(req.query.sort)).skip((page - 1) * limit).limit(limit),
            ProductModel.countDocuments(filter),
        ]);
        return res.status(200).json({ success: true, message: "Products found", data, total, limit, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        if (error.message === "INVALID_PRICE_FILTER") return sendBadRequest(res, "Invalid price filter");
        return sendServerError(res, error);
    }
};

export const readAdmin = async (req, res) => {
    try {
        const limit = parseBoundedNumber(req.query.limit, 20, 1, 100);
        const page = parseBoundedNumber(req.query.page, 1, 1, 100000);
        const query = String(req.query.search || "").trim().slice(0, 100);
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const filter = query ? { $or: [{ title: { $regex: escaped, $options: "i" } }, { slug: { $regex: escaped, $options: "i" } }] } : {};
        if (req.query.status === "active") filter.status = true;
        if (req.query.status === "archived") filter.status = false;
        const [data, total, all, active, outOfStock] = await Promise.all([
            ProductModel.find(filter).populate(POPULATE).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
            ProductModel.countDocuments(filter), ProductModel.countDocuments(), ProductModel.countDocuments({ status: true }), ProductModel.countDocuments({ stock: false }),
        ]);
        return res.status(200).json({ success: true, message: "Products found", data, total, page, limit, pages: Math.ceil(total / limit), summary: { all, active, archived: all - active, outOfStock } });
    } catch (error) { return sendServerError(res, error); }
};

export const readById = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) return sendBadRequest(res, "Invalid product id");
        const { categories, rooms } = await getActiveReferences();
        const product = await ProductModel.findOne({ _id: req.params.id, status: true, category: { $in: categories }, roomType: { $in: rooms } }).populate(POPULATE);
        if (!product) return sendNotFound(res, "Product not found");
        return res.status(200).json({ success: true, message: "Product found", data: product });
    } catch (error) { return sendServerError(res, error); }
};

export const readAdminById = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) return sendBadRequest(res, "Invalid product id");
        const product = await ProductModel.findById(req.params.id).populate(POPULATE);
        if (!product) return sendNotFound(res, "Product not found");
        return res.status(200).json({ success: true, message: "Product found", data: product });
    } catch (error) { return sendServerError(res, error); }
};

export const create = async (req, res) => {
    try {
        const values = parseProductValues(req.body);
        const validationError = validateProductValues(values, true);
        if (validationError) return sendBadRequest(res, validationError);
        if (values.salePrice > values.price) return sendBadRequest(res, "Sale price cannot exceed regular price");
        if (!req.file) return sendBadRequest(res, "A product thumbnail is required");
        const referenceError = await validateReferences(values.category, values.roomType);
        if (referenceError) return sendBadRequest(res, referenceError);
        if (await ProductModel.exists({ slug: values.slug })) return sendConflict(res, "A product already uses this slug");
        const thumbnail = getUploadMetadata(req.file);
        const product = await ProductModel.create({ ...values, title: values.title.trim(), thumbnail: thumbnail.url, thumbnailPublicId: thumbnail.publicId });
        return res.status(201).json({ success: true, message: "Product created", data: product });
    } catch (error) { return sendServerError(res, error); }
};

export const edit = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) return sendBadRequest(res, "Invalid product id");
        const product = await ProductModel.findById(req.params.id).select("+thumbnailPublicId");
        if (!product) return sendNotFound(res, "Product not found");
        const values = parseProductValues(req.body);
        const validationError = validateProductValues(values);
        if (validationError) return sendBadRequest(res, validationError);
        if ((values.salePrice ?? product.salePrice) > (values.price ?? product.price)) return sendBadRequest(res, "Sale price cannot exceed regular price");
        if (values.slug && values.slug !== product.slug && await ProductModel.exists({ slug: values.slug })) return sendConflict(res, "A product already uses this slug");
        const category = values.category || product.category.toString();
        const roomType = values.roomType || product.roomType.toString();
        const referenceError = await validateReferences(category, roomType);
        if (referenceError) return sendBadRequest(res, referenceError);
        if (values.dimensions) { product.dimensions = { ...product.dimensions, ...values.dimensions }; delete values.dimensions; }
        if (values.weight) { product.weight = { ...product.weight, ...values.weight }; delete values.weight; }
        Object.assign(product, values);
        if (values.title) product.title = values.title.trim();
        const thumbnail = getUploadMetadata(req.file);
        const oldPublicId = thumbnail.url ? product.thumbnailPublicId : "";
        if (thumbnail.url) { product.thumbnail = thumbnail.url; product.thumbnailPublicId = thumbnail.publicId; }
        await product.save();
        await removeCloudinaryAssets([oldPublicId]);
        return res.status(200).json({ success: true, message: "Product updated", data: product });
    } catch (error) { return sendServerError(res, error); }
};

export const addImages = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) return sendBadRequest(res, "Invalid product id");
        const product = await ProductModel.findById(req.params.id).select("+imagePublicIds");
        if (!product) { await removeCloudinaryAssets(req.files?.map((file) => file.filename)); return sendNotFound(res, "Product not found"); }
        const uploads = req.files?.map(getUploadMetadata) || [];
        if (!uploads.length) return sendBadRequest(res, "Please choose at least one image");
        if (product.images.length + uploads.length > 6) { await removeCloudinaryAssets(uploads.map(({ publicId }) => publicId)); return sendBadRequest(res, "A product can have at most 6 images"); }
        product.images.push(...uploads.map(({ url }) => url));
        product.imagePublicIds.push(...uploads.map(({ publicId }) => publicId));
        await product.save();
        return sendSuccess(res, "Product images added");
    } catch (error) { return sendServerError(res, error); }
};

export const updateStatus = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) return sendBadRequest(res, "Invalid product id");
        const product = await ProductModel.findById(req.params.id);
        if (!product) return sendNotFound(res, "Product not found");
        product.status = !product.status;
        await product.save();
        return sendSuccess(res, product.status ? "Product restored" : "Product archived");
    } catch (error) { return sendServerError(res, error); }
};

export const deleteById = async (req, res) => updateStatus(req, res);

export const updateFlag = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) return sendBadRequest(res, "Invalid product id");
        const allowedFields = ["stock", "featured", "bestSeller", "newArrival"];
        if (!allowedFields.includes(req.body.field)) return sendBadRequest(res, "Invalid product field");
        const product = await ProductModel.findById(req.params.id);
        if (!product) return sendNotFound(res, "Product not found");
        product[req.body.field] = !product[req.body.field];
        await product.save();
        return sendSuccess(res, `${req.body.field} updated`);
    } catch (error) { return sendServerError(res, error); }
};
