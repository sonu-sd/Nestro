import categoryModel from "../models/category.model.js";
import {
  isValidId,
  normalizeSlug,
  parseBoundedNumber,
} from "../utils/catalog.js";
import { getUploadMetadata, removeCloudinaryAssets } from "../utils/media.js";
import {
  sendBadRequest,
  sendConflict,
  sendNotFound,
  sendServerError,
  sendSuccess,
} from "../utils/response.js";

const validateInput = ({ name, slug }) => {
  if (!name?.trim() || !slug) return "Name and slug are required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  if (!normalizeSlug(slug)) return "Please provide a valid slug";
  return null;
};

const sendList = async (req, res, includeInactive = false) => {
  const limit = parseBoundedNumber(req.query.limit, 100, 1, 100);
  const page = parseBoundedNumber(req.query.page, 1, 1, 100000);
  const filter = includeInactive ? {} : { status: true };
  const [data, total] = await Promise.all([
    categoryModel
      .find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    categoryModel.countDocuments(filter),
  ]);
  return res
    .status(200)
    .json({
      success: true,
      message: "Categories found",
      data,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
};

export const read = async (req, res) => {
  try {
    return await sendList(req, res);
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const readAdmin = async (req, res) => {
  try {
    return await sendList(req, res, true);
  } catch (error) {
    return sendServerError(res, error);
  }
};

const findCategory = async (id, activeOnly = false) => {
  if (!isValidId(id)) return null;
  return categoryModel.findOne(
    activeOnly ? { _id: id, status: true } : { _id: id },
  );
};

export const readById = async (req, res) => {
  try {
    if (!isValidId(req.params.id))
      return sendBadRequest(res, "Invalid category id");
    const category = await findCategory(req.params.id, true);
    if (!category) return sendNotFound(res, "Category not found");
    return res
      .status(200)
      .json({ success: true, message: "Category found", data: category });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const readAdminById = async (req, res) => {
  try {
    if (!isValidId(req.params.id))
      return sendBadRequest(res, "Invalid category id");
    const category = await findCategory(req.params.id);
    if (!category) return sendNotFound(res, "Category not found");
    return res
      .status(200)
      .json({ success: true, message: "Category found", data: category });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const create = async (req, res) => {
  try {
    const validationError = validateInput(req.body);
    if (validationError) return sendBadRequest(res, validationError);
    const slug = normalizeSlug(req.body.slug);
    if (await categoryModel.exists({ slug }))
      return sendConflict(res, "A category already uses this slug");
    const image = getUploadMetadata(req.file);
    const category = await categoryModel.create({
      name: req.body.name.trim(),
      slug,
      image: image.url,
      imagePublicId: image.publicId,
    });
    return res
      .status(201)
      .json({ success: true, message: "Category created", data: category });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    if (!isValidId(req.params.id))
      return sendBadRequest(res, "Invalid category id");
    const category = await findCategory(req.params.id);
    if (!category) return sendNotFound(res, "Category not found");
    category.status = !category.status;
    await category.save();
    return sendSuccess(
      res,
      category.status ? "Category restored" : "Category archived",
    );
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const edit = async (req, res) => {
  try {
    if (!isValidId(req.params.id))
      return sendBadRequest(res, "Invalid category id");
    const category = await categoryModel
      .findById(req.params.id)
      .select("+imagePublicId");
    if (!category) return sendNotFound(res, "Category not found");
    const name = req.body.name?.trim();
    const slug = req.body.slug ? normalizeSlug(req.body.slug) : undefined;
    if (name !== undefined && name.length < 2)
      return sendBadRequest(res, "Name must be at least 2 characters");
    if (req.body.slug && !slug)
      return sendBadRequest(res, "Please provide a valid slug");
    if (
      slug &&
      slug !== category.slug &&
      (await categoryModel.exists({ slug }))
    )
      return sendConflict(res, "A category already uses this slug");
    if (name) category.name = name;
    if (slug) category.slug = slug;
    const image = getUploadMetadata(req.file);
    const oldPublicId = image.url ? category.imagePublicId : "";
    if (image.url) {
      category.image = image.url;
      category.imagePublicId = image.publicId;
    }
    await category.save();
    await removeCloudinaryAssets([oldPublicId]);
    return sendSuccess(res, "Category updated");
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const deleteById = async (req, res) => {
  try {
    if (!isValidId(req.params.id))
      return sendBadRequest(res, "Invalid category id");
    const category = await findCategory(req.params.id);
    if (!category) return sendNotFound(res, "Category not found");
    if (!category.status)
      return sendSuccess(res, "Category is already archived");
    category.status = false;
    await category.save();
    return sendSuccess(res, "Category archived");
  } catch (error) {
    return sendServerError(res, error);
  }
};
