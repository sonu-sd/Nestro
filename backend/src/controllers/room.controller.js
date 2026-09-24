import roomModel from "../models/room.model.js";
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
    roomModel
      .find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    roomModel.countDocuments(filter),
  ]);
  return res
    .status(200)
    .json({
      success: true,
      message: "Room types found",
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

const findRoom = async (id, activeOnly = false) => {
  if (!isValidId(id)) return null;
  return roomModel.findOne(
    activeOnly ? { _id: id, status: true } : { _id: id },
  );
};

export const readById = async (req, res) => {
  try {
    if (!isValidId(req.params.id))
      return sendBadRequest(res, "Invalid room type id");
    const room = await findRoom(req.params.id, true);
    if (!room) return sendNotFound(res, "Room type not found");
    return res
      .status(200)
      .json({ success: true, message: "Room type found", data: room });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const readAdminById = async (req, res) => {
  try {
    if (!isValidId(req.params.id))
      return sendBadRequest(res, "Invalid room type id");
    const room = await findRoom(req.params.id);
    if (!room) return sendNotFound(res, "Room type not found");
    return res
      .status(200)
      .json({ success: true, message: "Room type found", data: room });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const create = async (req, res) => {
  try {
    const validationError = validateInput(req.body);
    if (validationError) return sendBadRequest(res, validationError);
    const slug = normalizeSlug(req.body.slug);
    if (await roomModel.exists({ slug }))
      return sendConflict(res, "A room type already uses this slug");
    const image = getUploadMetadata(req.file);
    const room = await roomModel.create({
      name: req.body.name.trim(),
      slug,
      image: image.url,
      imagePublicId: image.publicId,
    });
    return res
      .status(201)
      .json({ success: true, message: "Room type created", data: room });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    if (!isValidId(req.params.id))
      return sendBadRequest(res, "Invalid room type id");
    const room = await findRoom(req.params.id);
    if (!room) return sendNotFound(res, "Room type not found");
    room.status = !room.status;
    await room.save();
    return sendSuccess(
      res,
      room.status ? "Room type restored" : "Room type archived",
    );
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const edit = async (req, res) => {
  try {
    if (!isValidId(req.params.id))
      return sendBadRequest(res, "Invalid room type id");
    const room = await roomModel
      .findById(req.params.id)
      .select("+imagePublicId");
    if (!room) return sendNotFound(res, "Room type not found");
    const name = req.body.name?.trim();
    const slug = req.body.slug ? normalizeSlug(req.body.slug) : undefined;
    if (name !== undefined && name.length < 2)
      return sendBadRequest(res, "Name must be at least 2 characters");
    if (req.body.slug && !slug)
      return sendBadRequest(res, "Please provide a valid slug");
    if (slug && slug !== room.slug && (await roomModel.exists({ slug })))
      return sendConflict(res, "A room type already uses this slug");
    if (name) room.name = name;
    if (slug) room.slug = slug;
    const image = getUploadMetadata(req.file);
    const oldPublicId = image.url ? room.imagePublicId : "";
    if (image.url) {
      room.image = image.url;
      room.imagePublicId = image.publicId;
    }
    await room.save();
    await removeCloudinaryAssets([oldPublicId]);
    return sendSuccess(res, "Room type updated");
  } catch (error) {
    return sendServerError(res, error);
  }
};

export const deleteById = async (req, res) => {
  try {
    if (!isValidId(req.params.id))
      return sendBadRequest(res, "Invalid room type id");
    const room = await findRoom(req.params.id);
    if (!room) return sendNotFound(res, "Room type not found");
    if (!room.status) return sendSuccess(res, "Room type is already archived");
    room.status = false;
    await room.save();
    return sendSuccess(res, "Room type archived");
  } catch (error) {
    return sendServerError(res, error);
  }
};
