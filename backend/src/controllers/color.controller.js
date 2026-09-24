import colorModel from "../models/color.model.js";
import {
  isValidId,
  normalizeSlug,
  parseBoundedNumber,
} from "../utils/catalog.js";
import {
  sendBadRequest,
  sendConflict,
  sendNotFound,
  sendServerError,
  sendSuccess,
} from "../utils/response.js";

const normalizeHex = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();
const validHex = (value) => /^#[0-9A-F]{6}$/.test(value);

async function list(req, res, includeInactive) {
  const page = parseBoundedNumber(req.query.page, 1, 1, 100000);
  const limit = parseBoundedNumber(req.query.limit, 100, 1, 100);
  const filter = includeInactive ? {} : { status: true };
  const [data, total] = await Promise.all([
    colorModel
      .find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    colorModel.countDocuments(filter),
  ]);
  return res
    .status(200)
    .json({
      success: true,
      data,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
}

export const read = async (req, res) => {
  try {
    return await list(req, res, false);
  } catch (error) {
    return sendServerError(res, error);
  }
};
export const readAdmin = async (req, res) => {
  try {
    return await list(req, res, true);
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const create = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const slug = normalizeSlug(String(req.body.slug || name));
    const hex = normalizeHex(req.body.hex);
    if (name.length < 2 || name.length > 50 || !slug || !validHex(hex))
      return sendBadRequest(res, "Provide a name and a 6-digit hex color");
    if (await colorModel.exists({ slug }))
      return sendConflict(res, "A color already uses this slug");
    const color = await colorModel.create({ name, slug, hex });
    return res
      .status(201)
      .json({ success: true, message: "Color created", data: color });
  } catch (error) {
    return error.code === 11000
      ? sendConflict(res, "A color already uses this slug")
      : sendServerError(res, error);
  }
};

export const edit = async (req, res) => {
  try {
    if (!isValidId(req.params.id))
      return sendBadRequest(res, "Invalid color id");
    const color = await colorModel.findById(req.params.id);
    if (!color) return sendNotFound(res, "Color not found");
    const name =
      req.body.name === undefined ? color.name : String(req.body.name).trim();
    const slug =
      req.body.slug === undefined
        ? color.slug
        : normalizeSlug(String(req.body.slug));
    const hex =
      req.body.hex === undefined ? color.hex : normalizeHex(req.body.hex);
    if (name.length < 2 || name.length > 50 || !slug || !validHex(hex))
      return sendBadRequest(res, "Provide a name and a 6-digit hex color");
    if (slug !== color.slug && (await colorModel.exists({ slug })))
      return sendConflict(res, "A color already uses this slug");
    Object.assign(color, { name, slug, hex });
    await color.save();
    return sendSuccess(res, "Color updated");
  } catch (error) {
    return error.code === 11000
      ? sendConflict(res, "A color already uses this slug")
      : sendServerError(res, error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    if (!isValidId(req.params.id))
      return sendBadRequest(res, "Invalid color id");
    const color = await colorModel.findById(req.params.id);
    if (!color) return sendNotFound(res, "Color not found");
    color.status = !color.status;
    await color.save();
    return sendSuccess(res, color.status ? "Color restored" : "Color archived");
  } catch (error) {
    return sendServerError(res, error);
  }
};
