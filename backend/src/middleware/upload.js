import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"nestro",
        allowed_formats:["jpg","png","jpeg","webp"]
    }
})

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
        }
        return callback(null, true);
    },
});

  export default upload

