import mongoose from "mongoose";

export const normalizeSlug = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const isValidId = (id) => mongoose.isValidObjectId(id);

export const parseBoolean = (value) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
};

export const parseBoundedNumber = (value, fallback, minimum, maximum) => {
  const number = Number(value);
  if (!Number.isInteger(number) || number < minimum || number > maximum)
    return fallback;
  return number;
};
