import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    hex: { type: String, required: true, uppercase: true, match: /^#[0-9A-F]{6}$/ },
    status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("colors", colorSchema);
